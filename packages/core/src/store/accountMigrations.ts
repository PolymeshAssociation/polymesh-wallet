/* global chrome */

import type { AuthUrlInfo } from '@polkadot/extension-base/background/types';
import type { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';

import { AccountsStore } from '@polkadot/extension-base/stores';
import BaseStore from '@polkadot/extension-base/stores/Base';

const AUTH_URLS_KEY = 'authUrls';

export default class AccountMigrations extends BaseStore<KeyringJson> implements KeyringStore {
  constructor () {
    super(null);
  }

  // Migrates authorization entries keyed by hostname (without protocol)
  // to origin-style keys (e.g. https://example.com), matching stripUrl behavior.
  public async migrateAuthUrls (): Promise<boolean> {
    const stored = await chrome.storage.local.get(AUTH_URLS_KEY);
    const authString = (stored[AUTH_URLS_KEY] as string | undefined) ?? '{}';
    const authUrls = JSON.parse(authString) as Record<string, AuthUrlInfo>;
    let changed = false;

    Object.keys(authUrls).forEach((key) => {
      // Already in canonical format
      if (/^(https?:\/\/|ipfs:\/\/|ipns:\/\/)/.test(key)) {
        return;
      }

      const protocol = key.startsWith('localhost') ? 'http' : 'https';
      const newKey = `${protocol}://${key}`;
      const currentEntry = authUrls[key];
      const existingEntry = authUrls[newKey];

      if (existingEntry) {
        const mergedAuthorizedAccounts = Array.from(new Set([
          ...existingEntry.authorizedAccounts,
          ...currentEntry.authorizedAccounts
        ]));

        authUrls[newKey] = {
          ...existingEntry,
          authorizedAccounts: mergedAuthorizedAccounts
        };
      } else {
        authUrls[newKey] = {
          ...currentEntry,
          id: newKey
        };
      }

      delete authUrls[key];
      changed = true;
    });

    if (changed) {
      await chrome.storage.local.set({ [AUTH_URLS_KEY]: JSON.stringify(authUrls) });
      console.log('Migration successful for authUrls key format');
    }

    return changed;
  }

  // Migrates accounts stored without an extension prefix to be stored with the
  // EXTENSION_PREFIX configured in webpack.shared.cjs
  public async migrateUnPrefixedAccounts (): Promise<boolean> {
    const accountsStore = new AccountsStore();
    const migrationPromises: Promise<void>[] = [];
    let needsReload = false;

    const migrateAccount = async (key: string, value: KeyringJson): Promise<void> => {
      let existingValue: KeyringJson | null = null;

      await accountsStore.get(key, (value) => {
        existingValue = value;
      });

      // If the account already exists, remove the old storage key
      if (existingValue) {
        console.log(`Account with key ${key} already migrated, removing the old storage key`);
        await super.remove(key);

        return;
      }

      // migrate the account to the new storage key
      await accountsStore.set(key, value);
      // Only reload if migrations actually happened this ensure the keyring reinitialized from the migrated storage
      needsReload = true;

      // Verify the migration was successful
      await accountsStore.get(key, (value) => {
        existingValue = value;
      });

      if (existingValue) {
        // Migration successful, remove the old storage key
        await super.remove(key);
        console.log(`Migration successful for key ${key}`);
      } else {
        console.error(`Failed to verify migration for key ${key}`);
      }
    };

    await super.all((key, value): void => {
      if (key.startsWith('account:')) {
        migrationPromises.push(migrateAccount(key, value).catch(console.error));
      }
    });

    await Promise.all(migrationPromises);

    return needsReload;
  }
}

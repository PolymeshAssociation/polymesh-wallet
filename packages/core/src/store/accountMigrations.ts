import type { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';

import { AccountsStore } from '@polkadot/extension-base/stores';
import BaseStore from '@polkadot/extension-base/stores/Base';

export default class AccountMigrations extends BaseStore<KeyringJson> implements KeyringStore {
  constructor () {
    super(null);
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

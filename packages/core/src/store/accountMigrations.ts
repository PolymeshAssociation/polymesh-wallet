import type { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';

import { AccountsStore } from '@polkadot/extension-base/stores';
import BaseStore from '@polkadot/extension-base/stores/Base';

export default class AccountMigrations extends BaseStore<KeyringJson> implements KeyringStore {
  constructor () {
    super(null);
  }

  // Migrates accounts stored without an extension prefix to be stored with the
  // EXTENSION_PREFIX configured in webpack.shared.cjs
  public async migrateUnPrefixedAccounts (): Promise<void> {
    const accountsStore = new AccountsStore();

    const migrateAccount = async (key: string, value: KeyringJson): Promise<void> => {
      if (key.startsWith('account:')) {
        await accountsStore.set(key, value);
      }
    };

    await super.all((key, value): void => {
      migrateAccount(key, value).catch(console.error);
    });
  }
}

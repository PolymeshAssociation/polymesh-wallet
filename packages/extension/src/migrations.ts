/* global chrome */

import AccountMigrations from '@polymeshassociation/extension-core/store/accountMigrations';

// Helper function to compare two version strings
function isVersionEarlierOrEqual (version: string, compareTo: string): boolean {
  const versionParts = version.split('.').map(Number);
  const compareToParts = compareTo.split('.').map(Number);

  for (let i = 0; i < compareToParts.length; i++) {
    if ((versionParts[i] || 0) > compareToParts[i]) {
      return false;
    }

    if ((versionParts[i] || 0) < compareToParts[i]) {
      return true;
    }
  }

  return true;
}

// Run the migration applicable to version 2.2.0 or earlier
async function runUnPrefixedAccountsMigration (migrate: AccountMigrations): Promise<boolean> {
  const shouldReload = await migrate.migrateUnPrefixedAccounts();

  console.log('Account Prefix Migration completed');

  return shouldReload;
}

async function runAuthUrlMigration (migrate: AccountMigrations): Promise<boolean> {
  const shouldReload = await migrate.migrateAuthUrls();

  if (shouldReload) {
    console.log('Auth URL Migration completed');
  }

  return shouldReload;
}

// Check for version update and perform migration if needed
export async function checkForUpdateAndMigrate (details: chrome.runtime.InstalledDetails): Promise<void> {
  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const previousVersion = details.previousVersion;
    const migrate = new AccountMigrations();
    let shouldReload = false;

    // Migrate Account Prefixes. Runs when no lastVersion or a previous version of 2.3.0 or earlier
    if (!previousVersion || isVersionEarlierOrEqual(previousVersion, '2.3.0')) {
      shouldReload = (await runUnPrefixedAccountsMigration(migrate)) || shouldReload;
    }

    // Migrate legacy auth URL keys without protocol to origin-style keys.
    if (!previousVersion || isVersionEarlierOrEqual(previousVersion, '2.4.1')) {
      shouldReload = (await runAuthUrlMigration(migrate)) || shouldReload;
    }

    if (shouldReload) {
      console.log('Reloading extension after migrations');
      chrome.runtime.reload();
    }
  }
}

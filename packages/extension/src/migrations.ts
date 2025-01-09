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
async function runMigrations () {
  const migrate = new AccountMigrations();

  await migrate.migrateUnPrefixedAccounts();
  console.log('Migration completed');
}

// Check for version update and perform migration if needed
export async function checkForUpdateAndMigrate (details: chrome.runtime.InstalledDetails): Promise<void> {
  if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    const previousVersion = details.previousVersion;

    // Migrate Account Prefixes. Runs when no lastVersion or a previous version of 2.0.2 or earlier
    if (!previousVersion || isVersionEarlierOrEqual(previousVersion, '2.2.0')) {
      await runMigrations();
    }
  }
}

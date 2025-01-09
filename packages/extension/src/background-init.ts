/* global chrome */

import { AccountsStore } from '@polkadot/extension-base/stores';
import { keyring } from '@polkadot/ui-keyring';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import { fatalErrorHandler } from '@polymeshassociation/extension-core/utils';

import { checkForUpdateAndMigrate } from './migrations';

// Ensure crypto is ready and load all keyring data
async function initializeCryptoAndKeyring () {
  await cryptoWaitReady();
  console.log('crypto initialized');

  keyring.loadAll({ store: new AccountsStore(), type: 'sr25519' });
  console.log('initialization completed');
}

/*
 This is placed in a separate file to ensure that the listener is registered immediately,
 avoiding any delays caused by other imports or initializations. When placed in background.ts
 it was not being registered before the event was emitted.
*/

chrome.runtime.onInstalled.addListener((details) => {
  checkForUpdateAndMigrate(details)
    .catch(fatalErrorHandler);
});

// Run initialization immediately
initializeCryptoAndKeyring()
  .catch(fatalErrorHandler);

// Runs in the extension background, handling all keyring access

import handlers from '@polkadot/extension-base/background/handlers';
import { PORT_CONTENT, PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { AccountsStore } from '@polkadot/extension-base/stores';
import chrome from '@polkadot/extension-inject/chrome';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import subscribePolymesh, { accountsSynchronizer } from '@polymathnetwork/extension-core';
import polyHandlers from '@polymathnetwork/extension-core/background/handlers';
import { resetState, setIsRehydrated } from '@polymathnetwork/extension-core/store/setters';
import { fatalErrorHandler, isPolyMessage } from '@polymathnetwork/extension-core/utils';

// setup the notification (same a FF default background, white text)
chrome.browserAction.setBadgeBackgroundColor({ color: '#d90000' });

// This listener is invoked every time the extension is installed, updated, or reloaded.
chrome.runtime.onInstalled.addListener(() => {
  // Reset stored state to avoid integrity issues. Store will be repopulated next time the wallet is opened.
  resetState();
  setIsRehydrated();
});

// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener((port): void => {
  // shouldn't happen, however... only listen to what we know about
  assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`);
  let polyUnsub: VoidCallback;
  let accountsUnsub: VoidCallback;

  if (port.name === PORT_EXTENSION) {
    accountsUnsub = accountsSynchronizer();
    polyUnsub = subscribePolymesh();
  }

  // message and disconnect handlers
  port.onMessage.addListener((data): void => {
    if (isPolyMessage(data.message)) return polyHandlers(data, port);
    else return handlers(data, port);
  });
  port.onDisconnect.addListener((): void => {
    console.log(`Disconnected from ${port.name}`);
    if (polyUnsub) polyUnsub();
    if (accountsUnsub) accountsUnsub();
  });
});

// initial setup
cryptoWaitReady()
  .then((): void => {
    console.log('crypto initialized');

    // load all the keyring data
    keyring.loadAll({ store: new AccountsStore(), type: 'sr25519' });

    console.log('initialization completed');
  }, fatalErrorHandler)
  .catch(fatalErrorHandler);

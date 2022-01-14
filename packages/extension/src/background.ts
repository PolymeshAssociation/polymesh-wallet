// Runs in the extension background, handling all keyring access
import { AccountsStore } from '@polkadot/extension-base/stores';
import chrome from '@polkadot/extension-inject/chrome';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import subscribePolymesh, {
  accountsSynchronizer,
} from '@polymathnetwork/extension-core';
import handlers from '@polymathnetwork/extension-core/background/handlers';
import { PORTS } from '@polymathnetwork/extension-core/constants';
import SchemaService from '@polymathnetwork/extension-core/external/schema';
import { fatalErrorHandler } from '@polymathnetwork/extension-core/utils';

const loadSchema = () => {
  SchemaService.load().catch(console.error);
};

// setup the notification (same a FF default background, white text)
chrome.browserAction.setBadgeBackgroundColor({ color: '#d90000' });
chrome.browserAction.setBadgeText({ text: '' });


// This listener is invoked every time the extension is installed, updated, or reloaded.
chrome.runtime.onInstalled.addListener(() => {
  loadSchema();
  subscribePolymesh();
});

// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener((port): void => {
  assert(
    [PORTS.CONTENT, PORTS.EXTENSION].includes(port.name),
    `Unknown connection from ${port.name}`
  );

  let polyUnsub: () => void;
  const accountsUnsub = accountsSynchronizer();

  if (port.name === PORTS.EXTENSION) {
    polyUnsub = subscribePolymesh();
    loadSchema();

    port.onDisconnect.addListener((): void => {
      console.log(`Disconnected from ${port.name}`);

      polyUnsub();
    });
  }

  port.onDisconnect.addListener((): void => {
    if (accountsUnsub) accountsUnsub();
  });

  // message handlers
  port.onMessage.addListener((data): void => {
    return handlers(data, port);
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

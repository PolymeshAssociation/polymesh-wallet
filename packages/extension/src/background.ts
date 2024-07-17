// Runs in the extension background, handling all keyring access

/* global chrome */

import '@polkadot/extension-inject/crossenv';

import type { PolyRequestSignatures, PolyTransportRequestMessage } from '@polymeshassociation/extension-core/background/types';

import { withErrorLog } from '@polkadot/extension-base/background';
import { PORT_CONTENT, PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { AccountsStore } from '@polkadot/extension-base/stores';
import { keyring } from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

import subscribePolymesh, { accountsSynchronizer } from '@polymeshassociation/extension-core';
import handlers from '@polymeshassociation/extension-core/background/handlers';
import { fatalErrorHandler } from '@polymeshassociation/extension-core/utils';

// setup the notification (same a FF default background, white text)
withErrorLog(() => chrome.action.setBadgeBackgroundColor({ color: '#d90000' }));
withErrorLog(() => chrome.action.setBadgeText({ text: '' }));

// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener((port): void => {
  // shouldn't happen, however... only listen to what we know about
  assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`);

  let polyUnsub: () => void;
  const accountsUnsub = accountsSynchronizer();

  if (port.name === PORT_EXTENSION) {
    polyUnsub = subscribePolymesh();
  }

  // disconnect handler
  port.onDisconnect.addListener((): void => {
    console.log(`Disconnected from ${port.name}`);

    if (port.name === PORT_EXTENSION && polyUnsub) {
      polyUnsub();
    }

    if (accountsUnsub) {
      accountsUnsub();
    }
  });

  // message handler
  port.onMessage.addListener((data: PolyTransportRequestMessage<keyof PolyRequestSignatures>) => handlers(data, port));
});

function isValidUrl (url: string) {
  try {
    const urlObj = new URL(url);

    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (_e) {
    return false;
  }
}

function getActiveTabs () {
  // querying the current active tab in the current window should only ever return 1 tab
  // although an array is specified here
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // get the urls of the active tabs. Only http or https urls are supported. Other urls will be filtered out.
    // e.g. browser tabs like chrome://newtab/, chrome://extensions/, about:addons etc will be filtered out
    const urls: string[] = tabs
      .map(({ url }) => url)
      .filter((url) => !!url && isValidUrl(url)) as string[];

    const request: PolyTransportRequestMessage<'pri(activeTabsUrl.update)'> = {
      id: 'background',
      message: 'pri(activeTabsUrl.update)',
      origin: 'background',
      request: { urls }
    };

    handlers(request);
  });
}

// listener to ensure the background script has not stopped
chrome.runtime.onMessage.addListener((message: { type: string }, _, sendResponse) => {
  if (message.type === 'wakeup') {
    sendResponse({ status: 'awake' });
  }
});

// listen to tab updates this is fired on url change
chrome.tabs.onUpdated.addListener((_, changeInfo) => {
  // we are only interested in url change
  if (!changeInfo.url) {
    return;
  }

  getActiveTabs();
});

// the list of active tab changes when switching window
// in a multi window setup
chrome.windows.onFocusChanged.addListener(() =>
  getActiveTabs()
);

// when clicking on an existing tab or opening a new tab this will be fired
// before the url is entered by users
chrome.tabs.onActivated.addListener(() => {
  getActiveTabs();
});

// when deleting a tab this will be fired
chrome.tabs.onRemoved.addListener(() => {
  getActiveTabs();
});

// initial setup
cryptoWaitReady()
  .then((): void => {
    console.log('crypto initialized');

    // load all the keyring data
    keyring.loadAll({ store: new AccountsStore(), type: 'sr25519' });

    console.log('initialization completed');
  })
  .catch(fatalErrorHandler);

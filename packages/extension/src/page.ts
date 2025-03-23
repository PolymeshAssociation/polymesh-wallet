import type { Message } from '@polkadot/extension-base/types';
import type { PolyRequestSignatures, PolyTransportRequestMessage } from '@polymeshassociation/extension-core/background/types';

import { MESSAGE_ORIGIN_CONTENT } from '@polkadot/extension-base/defaults';
import { injectExtension } from '@polkadot/extension-inject';

import { enable, handleResponse, redirectIfPhishing } from '@polymeshassociation/extension-core/page';

function inject () {
  injectExtension(enable, {
    name: 'polywallet',
    version: process.env.PKG_VERSION || 'unknown'
  });
}

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }: Message): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== MESSAGE_ORIGIN_CONTENT) {
    return;
  }

  if (data.id) {
    handleResponse(data as PolyTransportRequestMessage<keyof PolyRequestSignatures>);
  } else {
    console.error('Missing id for response.');
  }
});

inject();
redirectIfPhishing().catch((e) => console.warn(`Unable to determine if the site is in the phishing list: ${(e as Error).message}`));

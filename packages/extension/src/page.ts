import { handleResponse } from '@polkadot/extension-base/page';
import { Message } from '@polkadot/extension-base/types';
import { injectExtension } from '@polkadot/extension-inject';
import { enable } from '@polymathnetwork/extension-core/page';

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }: Message): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== 'content') {
    return;
  }

  if (data.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleResponse(data as any);
  } else {
    console.error('Missing id for response.');
  }
});

injectExtension(enable, {
  name: 'polywallet',
  version: process.env.PKG_VERSION as string
});

import { PORT_CONTENT } from '@polkadot/extension-base/defaults';
import { Message } from '@polkadot/extension-base/types';
import chrome from '@polkadot/extension-inject/chrome';

// connect to the extension
const port = chrome.runtime.connect({ name: `polywallet_${PORT_CONTENT}` });

console.log("port: ", port)
// send any messages from the extension back to the page
port.onMessage.addListener((data): void => {
  window.postMessage({ ...data, origin: 'content' }, '*');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }: Message): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== 'page') {
    return;
  }

  port.postMessage(data);
});

// inject our data injector
const script = document.createElement('script');

script.src = chrome.extension.getURL('page.js');

script.onload = (): void => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};

(document.head || document.documentElement).appendChild(script);

import { assert } from '@polkadot/util';
import { PORTS } from '@polymathnetwork/extension-core/constants';

import { PolyMessageTypes, PolyTransportRequestMessage } from '../types';
import Extension from './Extension';
import State from './State';
import Tabs from './Tabs';

const state = new State();
const extension = new Extension(state); // handles messages coming from the extension popup
const tabs = new Tabs(state); // handles messages coming from the app running in the currently open tab

export default function handler<TMessageType extends PolyMessageTypes>(
  { id, message, request }: PolyTransportRequestMessage<TMessageType>,
  port: chrome.runtime.Port
): void {
  const isExtension = port.name === PORTS.EXTENSION;
  const sender = port.sender as chrome.runtime.MessageSender;
  const from = isExtension
    ? PORTS.EXTENSION
    : (sender.tab && sender.tab.url) || sender.url || '<unknown>';
  const source = `${from}: ${id}: ${message}`;

  console.log(` [in] ${source}`); // :: ${JSON.stringify(request)}`);

  const promise = isExtension
    ? extension._handle(id, message, request, port)
    : tabs._handle(id, message, request, from, port);

  promise
    .then((response): void => {
      console.log(`[out] ${source}`); // :: ${JSON.stringify(response)}`);

      // between the start and the end of the promise, the user may have closed
      // the tab, in which case port will be undefined
      assert(port, 'Port has been disconnected');

      port.postMessage({ id, response });
    })
    .catch((error: Error): void => {
      console.log(`[err] ${source}:: ${error.message}`);

      // only send message back to port if it's still connected
      if (port) {
        port.postMessage({ error: error.message, id });
      }
    });
}

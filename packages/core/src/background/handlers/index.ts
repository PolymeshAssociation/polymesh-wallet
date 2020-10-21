import { assert } from '@polkadot/util';

import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';

import Tabs from './Tabs';
import Extension from './Extension';
import { PolyMessageTypes, PolyTransportRequestMessage } from '../types';
import { nonFatalErrorHandler } from '@polymathnetwork/extension-core/utils';

const extension = new Extension();
const tabs = new Tabs();

export default function polyHandler<TMessageType extends PolyMessageTypes> ({ id, message, request }: PolyTransportRequestMessage<TMessageType>, port: chrome.runtime.Port): void {
  const isExtension = port.name === PORT_EXTENSION;
  const sender = port.sender as chrome.runtime.MessageSender;
  const from = isExtension
    ? 'extension'
    : (sender.tab && sender.tab.url) || sender.url || '<unknown>';
  const source = `${from}: ${id}: ${message}`;

  console.log(` [in] ${source}`); // :: ${JSON.stringify(request)}`);

  const promise = isExtension
    ? extension.handle(id, message, request, port)
    : tabs.handle(id, message, request, from, port);

  promise
    .then((response): void => {
      console.log(`[out] ${source}`); // :: ${JSON.stringify(response)}`);

      // between the start and the end of the promise, the user may have closed
      // the tab, in which case port will be undefined
      assert(port, 'Port has been disconnected');

      port.postMessage({ id, response });
    }, nonFatalErrorHandler)
    .catch((error: Error): void => {
      console.log(`[err] ${source}:: ${error.message}`);

      // only send message back to port if it's still connected
      if (port) {
        port.postMessage({ error: error.message, id });
      }
    });
}

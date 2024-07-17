/* global chrome */

import type { PolyMessageTypes, PolyTransportRequestMessage } from '../types';

import DotState from '@polkadot/extension-base/background/handlers/State';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { assert } from '@polkadot/util';

import Extension from './Extension';
import Tabs from './Tabs';

const state = new DotState();

await state.init();
const extension = new Extension(state); // handles messages coming from the extension popup
const tabs = new Tabs(state); // handles messages coming from the app running in the currently open tab

export default function handler<TMessageType extends PolyMessageTypes> ({ id, message, request }: PolyTransportRequestMessage<TMessageType>, port?: chrome.runtime.Port, extensionPortName = PORT_EXTENSION): void {
  const isExtension = !port || port?.name === extensionPortName;
  const sender = port?.sender;

  if (!isExtension && !sender) {
    throw new Error('Unable to extract message sender');
  }

  const from = isExtension
    ? 'extension'
    : sender?.url || sender?.tab?.url || '<unknown>';
  const source = `${from}: ${id}: ${message}`;

  console.log(` [in] ${source}`); // :: ${JSON.stringify(request)}`);

  const promise = isExtension
    ? extension._handle(id, message, request, port)
    : tabs._handle(id, message, request, from, port);

  promise
    .then((response: unknown): void => {
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

import { Unsubcall } from '@polkadot/extension-inject/types';
import { SendRequest } from '@polymeshassociation/extension-core/page/types';

import { InjectedNetwork, NetworkMeta } from '../types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;

export default class Network implements InjectedNetwork {
  constructor(_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public get(): Promise<NetworkMeta> {
    return sendRequest('poly:pub(network.get)');
  }

  public subscribe(cb: (networkMeta: NetworkMeta) => unknown): Unsubcall {
    sendRequest('poly:pub(network.subscribe)', null, cb).catch((error: Error) =>
      console.error(error)
    );

    return (): void => {
      // FIXME we need the ability to unsubscribe
    };
  }
}

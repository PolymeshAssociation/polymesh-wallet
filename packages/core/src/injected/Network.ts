import { SendRequest } from '@polkadot/extension-base/page/types';
import { Unsubcall } from '@polkadot/extension-inject/types';
import { InjectedNetwork, NetworkMeta } from '../types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;

export default class Network implements InjectedNetwork {
  constructor (_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public get (): Promise<NetworkMeta> {
    return sendRequest('pub(polyNetwork.get)');
  }

  public subscribe (cb: (networkMeta: NetworkMeta) => unknown): Unsubcall {
    sendRequest('pub(polyNetwork.subscribe)', null, cb)
      .catch((error: Error) => console.error(error));

    return (): void => {
      // FIXME we need the ability to unsubscribe
    };
  }
}

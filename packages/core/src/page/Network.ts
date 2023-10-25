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
    let id: string | null = null;

    sendRequest('poly:pub(network.subscribe)', null, cb)
      .then((subId): void => {
        id = subId;
      })
      .catch(console.error);

    return (): void => {
      id &&
        sendRequest('poly:pub(network.unsubscribe)', { id }).catch(
          console.error
        );
    };
  }
}

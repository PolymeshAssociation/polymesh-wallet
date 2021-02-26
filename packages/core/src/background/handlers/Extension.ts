import { callDetails } from '@polymathnetwork/extension-core/external';
import { getNetwork } from '@polymathnetwork/extension-core/store/getters';
import { renameIdentity, setNetwork, setSelectedAccount, toggleIsDeveloper } from '@polymathnetwork/extension-core/store/setters';
import { subscribeIdentifiedAccounts, subscribeIsDev, subscribeNetwork, subscribeSelectedAccount, subscribeStatus } from '@polymathnetwork/extension-core/store/subscribers';

import { PolyMessageTypes, PolyRequestTypes, PolyResponseType, RequestPolyCallDetails, RequestPolyIdentityRename, RequestPolyNetworkSet, RequestPolySelectedAccountSet, ResponsePolyCallDetails } from '../types';
import { createSubscription, unsubscribe } from './subscriptions';

export default class Extension {
  private polyAccountsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(accounts.subscribe)'>(id, port);

    const reduxUnsub = subscribeIdentifiedAccounts(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyNetworkSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(network.subscribe)'>(id, port);

    const reduxUnsub = subscribeNetwork(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polySelectedAccountSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(selectedAccount.subscribe)'>(id, port);

    const reduxUnsub = subscribeSelectedAccount(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyStoreStatusSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(status.subscribe)'>(id, port);

    const reduxUnsub = subscribeStatus(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyIsDevSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(isDev.subscribe)'>(id, port);

    const reduxUnsub = subscribeIsDev((data) => {
      cb(data);
    });

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private polyNetworkSet ({ network }: RequestPolyNetworkSet): boolean {
    setNetwork(network);

    return true;
  }

  private polyIdentityRename ({ did, name, network }: RequestPolyIdentityRename): boolean {
    renameIdentity(network, did, name);

    return true;
  }

  private polySelectedAccount ({ account }: RequestPolySelectedAccountSet): boolean {
    setSelectedAccount(account);

    return true;
  }

  private polyCallDetailsGet ({ request }: RequestPolyCallDetails): Promise<ResponsePolyCallDetails> {
    const network = getNetwork();

    return callDetails(request, network);
  }

  private polyIsDevToggle (): boolean {
    toggleIsDeveloper();

    return true;
  }

  public async handle<TMessageType extends PolyMessageTypes> (id: string, type: TMessageType, request: PolyRequestTypes[TMessageType], port: chrome.runtime.Port): Promise<PolyResponseType<TMessageType>> {
    switch (type) {
      case 'poly:pri(accounts.subscribe)':
        return this.polyAccountsSubscribe(id, port);

      case 'poly:pri(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'poly:pri(network.set)':
        return this.polyNetworkSet(request as RequestPolyNetworkSet);

      case 'poly:pri(selectedAccount.subscribe)':
        return this.polySelectedAccountSubscribe(id, port);

      case 'poly:pri(selectedAccount.set)':
        return this.polySelectedAccount(request as RequestPolySelectedAccountSet);

      case 'poly:pri(callDetails.get)':
        return this.polyCallDetailsGet(request as RequestPolyCallDetails);

      case 'poly:pri(status.subscribe)':
        return this.polyStoreStatusSubscribe(id, port);

      case 'poly:pri(identity.rename)':
        return this.polyIdentityRename(request as RequestPolyIdentityRename);

      case 'poly:pri(isDev.toggle)':
        return this.polyIsDevToggle();

      case 'poly:pri(isDev.subscribe)':
        return this.polyIsDevSubscribe(id, port);

      default:
        throw new Error(`Unable to handle message of type ${type}`);
    }
  }
}

import DotTabs from '@polkadot/extension-base/background/handlers/Tabs';
import DotState from '@polkadot/extension-base/background/handlers/State';
import {
  MessageTypes,
  RequestRpcUnsubscribe,
} from '@polkadot/extension-base/background/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { polyNetworkGet } from '@polymeshassociation/extension-core/external';
import polyNetworkSubscribe from '@polymeshassociation/extension-core/external/polyNetworkSubscribe';
import { getSelectedAccount } from '@polymeshassociation/extension-core/store/getters';
import { subscribeSelectedAccount } from '@polymeshassociation/extension-core/store/subscribers';
import { NetworkMeta } from '@polymeshassociation/extension-core/types';
import { prioritize } from '@polymeshassociation/extension-core/utils';

import {
  PolyMessageTypes,
  PolyRequestTypes,
  PolyResponseTypes,
} from '../types';
import { createSubscription, unsubscribe } from './subscriptions';

function transformAccounts(accounts: SubjectInfo): InjectedAccount[] {
  return (
    Object.values(accounts)
      .filter(
        ({
          json: {
            meta: { isHidden },
          },
        }) => !isHidden
      )
      .sort(
        (a, b) =>
          (a.json.meta.whenCreated || 0) - (b.json.meta.whenCreated || 0)
      )
      .map(
        ({
          json: {
            address,
            meta: { genesisHash, name },
          },
        }): InjectedAccount => ({
          address,
          genesisHash,
          name,
        })
      )
      // Prioritize selected account.
      .sort(prioritize(getSelectedAccount(), (a) => a.address))
  );
}

/**
 * Tabs handles messages coming from the web app running in the currently open browser tabs
 */
export default class Tabs extends DotTabs {
  readonly #state: DotState;

  constructor(state: DotState) {
    super(state);

    this.#state = state;
  }

  private polyNetworkGet(): NetworkMeta {
    return polyNetworkGet();
  }

  private polyNetworkSubscribe(id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pub(network.subscribe)'>(id, port);
    let initialCall = true;

    const innerCb = (networkMeta: NetworkMeta) => {
      if (initialCall) {
        initialCall = false;
      } else {
        cb(networkMeta);
      }
    };

    const reduxUnsub = polyNetworkSubscribe(innerCb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private _accountsList(): InjectedAccount[] {
    return transformAccounts(accountsObservable.subject.getValue());
  }

  private _accountsSubscribe(id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'pub(accounts.subscribe)'>(id, port);
    let calls = 0;

    const innerCb = (accounts: InjectedAccount[]) => {
      // Callback will be called twice initially, we need to skip those two calls.
      if (calls < 2) {
        calls++;
      } else {
        cb(accounts);
      }
    };

    // Call the callback every time the selected account changes, so that we return
    // that account first.
    const selectedAccUnsub = subscribeSelectedAccount(() => {
      innerCb(transformAccounts(accountsObservable.subject.getValue()));
    });

    const subscription = accountsObservable.subject.subscribe(
      (accounts: SubjectInfo): void => {
        innerCb(transformAccounts(accounts));
      }
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      selectedAccUnsub();
      subscription.unsubscribe();
    });

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async _handle<TMessageType extends PolyMessageTypes>(
    id: string,
    type: TMessageType,
    request: PolyRequestTypes[TMessageType],
    url: string,
    port: chrome.runtime.Port
  ): Promise<PolyResponseTypes[keyof PolyResponseTypes]> {
    if (type !== 'pub(authorize.tab)') {
      this.#state.ensureUrlAuthorized(url);
    }

    switch (type) {
      case 'poly:pub(network.get)':
        return this.polyNetworkGet();

      case 'poly:pub(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'pub(accounts.list)':
        return this._accountsList();

      case 'pub(accounts.subscribe)':
        return this._accountsSubscribe(id, port);

      case 'pub(metadata.list)': {
        // Deny app's request to provide metadata because Polymesh wallet
        // is fully aware of network metadata via ApiPromise objects.

        return [];
      }

      case 'pub(metadata.provide)': {
        // Deny app's request to provide metadata because Polymesh wallet
        // is fully aware of network metadata via ApiPromise objects.

        return false;
      }

      default:
        return super.handle(
          id,
          type as MessageTypes,
          request as RequestRpcUnsubscribe,
          url,
          port
        );
    }
  }
}

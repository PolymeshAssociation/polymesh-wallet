/* global chrome */

import type DotState from '@polkadot/extension-base/background/handlers/State';
import type { MessageTypes, RequestRpcUnsubscribe } from '@polkadot/extension-base/background/types';
import type { InjectedAccount } from '@polkadot/extension-inject/types';
import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import type { Subscription } from 'rxjs';
import type { NetworkMeta } from '@polymeshassociation/extension-core/types';
import type { PolyMessageTypes, PolyRequestTypes, PolyResponseTypes, RequestPolyAccountUnsubscribe, RequestPolyNetworkUnsubscribe } from '../types';

import DotTabs from '@polkadot/extension-base/background/handlers/Tabs';
import { canDerive } from '@polkadot/extension-base/utils';
import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';

import { polyNetworkGet } from '@polymeshassociation/extension-core/external';
import polyNetworkSubscribe from '@polymeshassociation/extension-core/external/polyNetworkSubscribe';
import { getSelectedAccount } from '@polymeshassociation/extension-core/store/getters';
import { subscribeSelectedAccount } from '@polymeshassociation/extension-core/store/subscribers';
import { prioritize } from '@polymeshassociation/extension-core/utils';

import { createSubscription, unsubscribe } from './subscriptions';

interface AccountSub {
  subscription: Subscription;
  url: string;
  selectedAccUnsub: () => void;
}

interface NetworkSub {
  reduxUnsub: () => void;
}

function transformAccounts (accounts: SubjectInfo, anyType = false): InjectedAccount[] {
  return Object
    .values(accounts)
    .filter(({ json: { meta: { isHidden } } }) => !isHidden)
    .filter(({ type }) => anyType ? true : canDerive(type))
    .sort((a, b) => (a.json.meta.whenCreated || 0) - (b.json.meta.whenCreated || 0))
    .map(({ json: { address, meta: { genesisHash, name } }, type }): InjectedAccount => ({
      address,
      genesisHash,
      name,
      type
    }))
  // Prioritize selected account.
    .sort(prioritize(getSelectedAccount(), (a) => a.address))
  ;
}

/**
 * Tabs handles messages coming from the web app running in the currently open browser tabs
 */
export default class Tabs extends DotTabs {
  readonly #state: DotState;
  readonly #accountSubs: Record<string, AccountSub> = {};
  readonly #networkSubs: Record<string, NetworkSub> = {};

  constructor (state: DotState) {
    super(state);

    this.#state = state;
  }

  private polyNetworkGet (): NetworkMeta {
    return polyNetworkGet();
  }

  private polyNetworkSubscribe (id: string, port: chrome.runtime.Port): string {
    const cb = createSubscription<'poly:pub(network.subscribe)'>(id, port);

    const reduxUnsub = polyNetworkSubscribe(cb);

    this.#networkSubs[id] = { reduxUnsub };

    port.onDisconnect.addListener((): void => {
      this.polyNetworkUnsubscribe({ id });
    });

    return id;
  }

  private polyNetworkUnsubscribe ({ id }: RequestPolyNetworkUnsubscribe): boolean {
    const sub = this.#networkSubs[id];

    if (!sub) {
      return false;
    }

    delete this.#networkSubs[id];

    unsubscribe(id);
    sub.reduxUnsub();

    return true;
  }

  private _accountsList (): InjectedAccount[] {
    return transformAccounts(accountsObservable.subject.getValue());
  }

  private _accountsSubscribe (
    url: string,
    id: string,
    port: chrome.runtime.Port
  ): string {
    const cb = createSubscription<'pub(accounts.subscribe)'>(id, port);
    let firstCall = true;

    const handleSubscription = () => {
      // Skip the first call to avoid double invocation
      if (firstCall) {
        firstCall = false;
      } else {
        cb(this._accountsList());
      }
    };

    // Subscribe to both the accountsObservable and the selected account changes
    const accountsSubscription = accountsObservable.subject.subscribe(() => {
      handleSubscription();
    });

    const selectedAccUnsub = subscribeSelectedAccount(() => {
      handleSubscription();
    });

    this.#accountSubs[id] = {
      selectedAccUnsub,
      subscription: accountsSubscription,
      url
    };

    port.onDisconnect.addListener((): void => {
      this._accountsUnsubscribe(url, { id });
    });

    return id;
  }

  private _accountsUnsubscribe (
    url: string,
    { id }: RequestPolyAccountUnsubscribe
  ): boolean {
    const sub = this.#accountSubs[id];

    if (!sub || sub.url !== url) {
      return false;
    }

    delete this.#accountSubs[id];

    unsubscribe(id);
    sub.selectedAccUnsub();
    sub.subscription.unsubscribe();

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async _handle<TMessageType extends PolyMessageTypes> (
    id: string,
    type: TMessageType,
    request: PolyRequestTypes[TMessageType],
    url: string,
    port: chrome.runtime.Port
  ): Promise<PolyResponseTypes[keyof PolyResponseTypes]> {
    if (type === 'pub(phishing.redirectIfDenied)') {
      return super.handle(
        id,
        type as MessageTypes,
        request as RequestRpcUnsubscribe,
        url,
        port
      );
    }

    if (type !== 'pub(authorize.tab)') {
      this.#state.ensureUrlAuthorized(url);
    }

    switch (type) {
      case 'poly:pub(network.get)':
        return this.polyNetworkGet();

      case 'poly:pub(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'poly:pub(network.unsubscribe)':
        return this.polyNetworkUnsubscribe(
          request as RequestPolyNetworkUnsubscribe
        );

      case 'pub(accounts.list)':
        return this._accountsList();

      case 'pub(accounts.subscribe)':
        return this._accountsSubscribe(url, id, port);

      case 'pub(accounts.unsubscribe)':
        return this._accountsUnsubscribe(
          url,
          request as RequestPolyAccountUnsubscribe
        );

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

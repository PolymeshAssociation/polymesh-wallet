// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { PolyRequestTypes, PolyResponseTypes, PolyMessageTypes } from '../types';

import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { subscribeSelectedAccount } from '@polymathnetwork/extension-core/store/subscribers';
import { prioritize } from '@polymathnetwork/extension-core/utils';
import { getSelectedAccount } from '@polymathnetwork/extension-core/store/getters';
import { NetworkMeta } from '@polymathnetwork/extension-core/types';
import { polyNetworkGet } from '@polymathnetwork/extension-core/api';
import polyNetworkSubscribe from '@polymathnetwork/extension-core/api/polyNetworkSubscribe';
import { createSubscription, unsubscribe } from './subscriptions';

function transformAccounts (accounts: SubjectInfo): InjectedAccount[] {
  return Object
    .values(accounts)
    .filter(({ json: { meta: { isHidden } } }) => !isHidden)
    .sort((a, b) => (a.json.meta.whenCreated || 0) - (b.json.meta.whenCreated || 0))
    .map(({ json: { address, meta: { genesisHash, name } } }): InjectedAccount => ({
      address, genesisHash, name
    }))
    // Prioritize selected account.
    .sort(prioritize(getSelectedAccount(), (a) => a.address));
}

export default class Tabs {
  private polyNetworkGet (): NetworkMeta {
    return polyNetworkGet();
  }

  private polyNetworkSubscribe (id: string, port: chrome.runtime.Port): boolean {
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
  private accountsList (url: string): InjectedAccount[] {
    return transformAccounts(accountsObservable.subject.getValue());
  }

  // FIXME This looks very much like what we have in Extension
  private accountsSubscribe (url: string, id: string, port: chrome.runtime.Port): boolean {
    // Call the callback every time the selected account changes, so that we return
    // that account first.
    const selectedAccUnsub = subscribeSelectedAccount(() => {
      cb(transformAccounts(accountsObservable.subject.getValue()));
    });

    const cb = createSubscription<'pub(accounts.subscribe)'>(id, port);
    const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
      cb(transformAccounts(accounts))
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      selectedAccUnsub();
      subscription.unsubscribe();
    });

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async handle<TMessageType extends PolyMessageTypes> (id: string, type: TMessageType, request: PolyRequestTypes[TMessageType], url: string, port: chrome.runtime.Port): Promise<PolyResponseTypes[keyof PolyResponseTypes]> {
    switch (type) {
      case 'poly:pub(network.get)':
        return this.polyNetworkGet();

      case 'poly:pub(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'pub(accounts.list)':
        return this.accountsList(url);

      case 'pub(accounts.subscribe)':
        return this.accountsSubscribe(url, id, port);

      default:
        throw new Error(`Unable to handle message of type ${type}`);
    }
  }
}

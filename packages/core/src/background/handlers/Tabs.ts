import type { KeyringPair } from '@polkadot/keyring/types';

import { InjectedAccount } from '@polkadot/extension-inject/types';
import keyring from '@polkadot/ui-keyring';
import accountsObservable from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { assert } from '@polkadot/util';
import { polyNetworkGet } from '@polymathnetwork/extension-core/api';
import polyNetworkSubscribe from '@polymathnetwork/extension-core/api/polyNetworkSubscribe';
import { getSelectedAccount } from '@polymathnetwork/extension-core/store/getters';
import { subscribeSelectedAccount } from '@polymathnetwork/extension-core/store/subscribers';
import { NetworkMeta, ProofRequestPayload } from '@polymathnetwork/extension-core/types';
import { prioritize } from '@polymathnetwork/extension-core/utils';

import { PolyMessageTypes, PolyRequestTypes, PolyResponseTypes, ResponseProofing } from '../types';
import State from './State';
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
  readonly #state: State;

  constructor (state: State) {
    this.#state = state;
  }

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

  private accountsSubscribe (url: string, id: string, port: chrome.runtime.Port): boolean {
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

    const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void => {
      innerCb(transformAccounts(accounts));
    });

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      selectedAccUnsub();
      subscription.unsubscribe();
    });

    return true;
  }

  private getSigningPair (address: string): KeyringPair {
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find keypair');

    return pair;
  }

  private generateProof (url: string, request: ProofRequestPayload): Promise<ResponseProofing> {
    console.log('>>>> Generate proof', url, request);
    const address = request.address;
    const pair = this.getSigningPair(address);

    return this.#state.generateProof(url, { payload: request }, { address, ...pair.meta });
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

      case 'poly:pub(proofs.generateProof)':
        return this.generateProof(url, request as ProofRequestPayload);

      default:
        throw new Error(`Unable to handle message of type ${type}`);
    }
  }
}

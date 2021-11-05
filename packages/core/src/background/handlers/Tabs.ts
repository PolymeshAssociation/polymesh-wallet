import DotTabs from '@polkadot/extension-base/background/handlers/Tabs';
import { MessageTypes, RequestRpcUnsubscribe } from '@polkadot/extension-base/background/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { assert } from '@polkadot/util';
import { polyNetworkGet } from '@polymathnetwork/extension-core/external';
import polyNetworkSubscribe from '@polymathnetwork/extension-core/external/polyNetworkSubscribe';
import { getSelectedAccount, getSelectedIdentifiedAccount } from '@polymathnetwork/extension-core/store/getters';
import { subscribeSelectedAccount } from '@polymathnetwork/extension-core/store/subscribers';
import { NetworkMeta, ProofRequestPayload, RequestPolyProvideUid } from '@polymathnetwork/extension-core/types';
import { allowedUidProvider, allowedUidReader, prioritize, recodeAddress, validateNetwork, validateSelectedNetwork, validateTicker, validateUid } from '@polymathnetwork/extension-core/utils';

import { Errors, PolyMessageTypes, PolyRequestTypes, PolyResponseTypes, ProofingResponse, ReadUidResponse, RequestPolyReadUid } from '../types';
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

/**
 * Tabs handles messages coming from the web app running in the currently open browser tabs
 */
export default class Tabs extends DotTabs {
  readonly #state: State;

  constructor (state: State) {
    super(state);

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
  private _accountsList (url: string): InjectedAccount[] {
    return transformAccounts(accountsObservable.subject.getValue());
  }

  private _accountsSubscribe (url: string, id: string, port: chrome.runtime.Port): boolean {
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

  private requestProof (url: string, request: ProofRequestPayload): Promise<ProofingResponse> {
    const account = getSelectedIdentifiedAccount();

    assert(validateTicker(request.ticker), Errors.INVALID_TICKER);

    assert(account, Errors.NO_ACCOUNT);

    assert(account.did, Errors.NO_DID);

    const address = recodeAddress(account.address);

    return this.#state.generateProof(url, request, { address });
  }

  private provideUid (url: string, request: RequestPolyProvideUid): Promise<boolean> {
    // XXX: felt unnecessary, might delete later
    // assert(allowedUidProvider(url), `App ${url} is not allowed to provide uid`);

    const { network, uid } = request;

    assert(validateNetwork(network), `Invalid network ${JSON.stringify(network)}`);

    assert(validateSelectedNetwork(network), `Network ${JSON.stringify(network)} doesn't match the selected network in Polymesh Wallet`);

    // FIXME we're disabling this check temporarily.
    // The problem is, CDD providers will create DID and attempt to push uid in on go.
    // Until user opens wallet popup, it would have no awareness of the newly created DID,
    // and will ultimately reject the uid provision request.

    // assert(validateDid(did), Errors.DID_NOT_MATCH);

    assert(validateUid(uid), Errors.INVALID_UID);

    return this.#state.provideUid(url, request);
  }

  private readUid (url: string, request: RequestPolyReadUid): Promise<ReadUidResponse> {
    // XXX: felt unnecessary, might delete later
    // assert(allowedUidReader(url), `App ${url} is not allowed access uid`);

    const account = getSelectedIdentifiedAccount();

    assert(account, Errors.NO_ACCOUNT);

    assert(account.did, Errors.NO_DID);

    return this.#state.readUid(url, request);
  }

  private async uidIsSet (): Promise<boolean> {
    const uidRecords = await this.#state.allUidRecords();

    const account = getSelectedIdentifiedAccount();

    assert(account, 'No account is present or no account selected');

    if (!account.did) { return false; }

    return uidRecords.some(({ did }) => did === account.did);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async _handle<TMessageType extends PolyMessageTypes> (id: string, type: TMessageType, request: PolyRequestTypes[TMessageType], url: string, port: chrome.runtime.Port): Promise<PolyResponseTypes[keyof PolyResponseTypes]> {
    if (type !== 'pub(authorize.tab)') {
      this.#state.ensureUrlAuthorized(url);
    }

    switch (type) {
      case 'poly:pub(network.get)':
        return this.polyNetworkGet();

      case 'poly:pub(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'pub(accounts.list)':
        return this._accountsList(url);

      case 'pub(accounts.subscribe)':
        return this._accountsSubscribe(url, id, port);

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

      case 'poly:pub(uid.requestProof)':
        return this.requestProof(url, request as ProofRequestPayload);

      case 'poly:pub(uid.provide)':
        return this.provideUid(url, request as RequestPolyProvideUid);

      case 'poly:pub(uid.isSet)':
        return this.uidIsSet();

      case 'poly:pub(uid.read)':
        return this.readUid(url, request as RequestPolyReadUid);

      default:
        return super.handle(id, type as MessageTypes, request as RequestRpcUnsubscribe, url, port);
    }
  }
}

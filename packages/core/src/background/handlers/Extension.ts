import { assert } from '@polkadot/util';
import { callDetails } from '@polymathnetwork/extension-core/api';
import { auxStore } from '@polymathnetwork/extension-core/store';
import { getNetwork, getSelectedIdentifiedAccount } from '@polymathnetwork/extension-core/store/getters';
import { renameIdentity, setNetwork, setSelectedAccount, toggleIsDeveloper } from '@polymathnetwork/extension-core/store/setters';
import { subscribeIdentifiedAccounts, subscribeIsDev, subscribeNetwork, subscribeSelectedAccount, subscribeStatus } from '@polymathnetwork/extension-core/store/subscribers';

import { Errors, PolyMessageTypes, PolyRequestTypes, PolyResponseType, ProofingRequest, ProvideUidRequest, RequestPolyApproveProof, RequestPolyCallDetails, RequestPolyIdentityRename, RequestPolyNetworkSet, RequestPolyProvideUidApprove, RequestPolyProvideUidReject, RequestPolyRejectProof, RequestPolySelectedAccountSet, ResponsePolyCallDetails } from '../types';
import State from './State';
import { createSubscription, unsubscribe } from './subscriptions';
import { getScopeAttestationProof } from './utils';

export default class Extension {
  readonly #state: State;

  constructor (state: State) {
    this.#state = state;
  }

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

  private proofRequestsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(uid.proofRequests.subscribe)'>(id, port);
    const subscription = this.#state.proofSubject.subscribe((requests: ProofingRequest[]): void =>
      cb(requests)
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
    });

    return true;
  }

  private uidProvideRequestsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(uid.provideRequests.subscribe)'>(id, port);
    const subscription = this.#state.provideUidRequestsSubject.subscribe((requests: ProvideUidRequest[]): void =>
      cb(requests)
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
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

  private async proofsApproveRequest ({ id, password }: RequestPolyApproveProof): Promise<boolean> {
    const queued = this.#state.getProofRequest(id);

    assert(queued, 'Unable to find request');

    const { reject, request, resolve } = queued;
    const { ticker } = request;

    const account = getSelectedIdentifiedAccount();

    const network = getNetwork();

    if (account === undefined) {
      reject(new Error(Errors.NO_ACCOUNT));

      return false;
    }

    if (account.did === undefined) {
      reject(new Error(Errors.NO_DID));

      return false;
    }

    const accountDid = account.did;

    let uid = null;

    try {
      uid = await auxStore.getN(account.did, network, password);
    } catch (error) {
      reject(error);

      return false;
    }

    if (!uid) {
      reject(new Error(Errors.NO_UID));

      return false;
    }

    const proof = await getScopeAttestationProof(accountDid, uid, ticker);

    console.log('Proof', proof);

    resolve({
      id,
      proof
    });

    return true;
  }

  private proofsRejectRequest ({ id }: RequestPolyRejectProof): boolean {
    const queued = this.#state.getProofRequest(id);

    assert(queued, 'Unable to find request');
    const { reject } = queued;

    reject(new Error('Error: Rejected'));

    return true;
  }

  private uidProvideRequestsApprove ({ id, password }: RequestPolyProvideUidApprove): boolean {
    const queued = this.#state.getProvideUidRequest(id);

    assert(queued, 'Unable to find request');
    const { request, resolve } = queued;
    const { address, did, network, uid } = request;

    auxStore.setN(did, network, uid, password);

    resolve(true);

    return true;
  }

  private uidProvideRequestsReject ({ id }: RequestPolyProvideUidReject): boolean {
    const queued = this.#state.getProvideUidRequest(id);

    assert(queued, 'Unable to find request');
    const { reject } = queued;

    reject(new Error('Rejected'));

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

      case 'poly:pri(uid.proofRequests.subscribe)':
        return this.proofRequestsSubscribe(id, port);

      case 'poly:pri(uid.proofRequests.approve)':
        return this.proofsApproveRequest(request as RequestPolyApproveProof);

      case 'poly:pri(uid.proofRequests.reject)':
        return this.proofsRejectRequest(request as RequestPolyRejectProof);

      case 'poly:pri(uid.provideRequests.subscribe)':
        return this.uidProvideRequestsSubscribe(id, port);

      case 'poly:pri(uid.provideRequests.approve)':
        return this.uidProvideRequestsApprove(request as RequestPolyProvideUidApprove);

      case 'poly:pri(uid.provideRequests.reject)':
        return this.uidProvideRequestsReject(request as RequestPolyProvideUidReject);

      default:
        throw new Error(`Unable to handle message of type ${type}`);
    }
  }
}

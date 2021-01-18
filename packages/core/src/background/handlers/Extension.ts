import { assert } from '@polkadot/util';
import { callDetails } from '@polymathnetwork/extension-core/api';
import { getNetwork } from '@polymathnetwork/extension-core/store/getters';
import { renameIdentity, setNetwork, setSelectedAccount, toggleIsDeveloper } from '@polymathnetwork/extension-core/store/setters';
import { subscribeIdentifiedAccounts, subscribeIsDev, subscribeNetwork, subscribeSelectedAccount, subscribeStatus } from '@polymathnetwork/extension-core/store/subscribers';

import { PolyMessageTypes, PolyRequestTypes, PolyResponseType, ProofingRequest, RequestPolyApproveProof, RequestPolyCallDetails, RequestPolyIdentityRename, RequestPolyNetworkSet, RequestPolySelectedAccountSet, ResponsePolyCallDetails } from '../types';
import State from './State';
import { createSubscription, unsubscribe } from './subscriptions';
import { getMockUId, getScopeAttestationProof } from './utils';

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

  private proofsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(proofs.requests)'>(id, port);
    const subscription = this.#state.proofSubject.subscribe((requests: ProofingRequest[]): void =>
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

  private async proofsApproveRequest ({ id }: RequestPolyApproveProof): Promise<boolean> {
    const queued = this.#state.getProofRequest(id);

    assert(queued, 'Unable to find request');
    const { reject, request, resolve } = queued;
    const { ticker } = request;

    // console.log('Address, Ticker', address, ticker);

    // // unlike queued.account.address the following
    // // address is encoded with the default prefix
    // // which what is used for password caching mapping
    // const { address } = pair;

    // if (!pair) {
    //   reject(new Error('Unable to find pair'));

    //   return false;
    // }

    // this.refreshAccountPasswordCache(pair);

    // // if the keyring pair is locked, the password is needed
    // if (pair.isLocked && !password) {
    //   reject(new Error('Password needed to unlock the account'));
    // }

    // if (pair.isLocked) {
    //   pair.decodePkcs8(password);
    // }

    // const result = request.sign(registry, pair);

    // if (savePass) {
    //   this.#cachedUnlocks[address] = Date.now() + PASSWORD_EXPIRY_MS;
    // } else {
    //   pair.lock();
    // }

    const did = '0x4e7bf83016ac0a39d4266ae263d99a03350c66f53f92e4dbbf5f9baa11a2a36b';
    const uid = await getMockUId(did);

    console.log('>>>> UID', uid);

    const proof = await getScopeAttestationProof(did, uid, ticker);

    console.log('Proof', proof);

    resolve({
      id,
      proof
    });

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

      case 'poly:pri(proofs.requests)':
        return this.proofsSubscribe(id, port);

      case 'poly:pri(proofs.approveRequest)':
        return this.proofsApproveRequest(request as RequestPolyApproveProof);

      default:
        throw new Error(`Unable to handle message of type ${type}`);
    }
  }
}

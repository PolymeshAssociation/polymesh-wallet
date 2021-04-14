import DotExtension from '@polkadot/extension-base/background/handlers/Extension';
import { MessageTypes, RequestAuthorizeApprove, RequestAuthorizeReject, RequestRpcUnsubscribe, ResponseAuthorizeList } from '@polkadot/extension-base/background/types';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { callDetails } from '@polymathnetwork/extension-core/external';
import { getNetwork, getSelectedIdentifiedAccount } from '@polymathnetwork/extension-core/store/getters';
import { renameIdentity,
  setNetwork,
  setSelectedAccount,
  toggleIsDeveloper } from '@polymathnetwork/extension-core/store/setters';
import { subscribeIdentifiedAccounts,
  subscribeNetworkState,
  subscribeSelectedAccount,
  subscribeSelectedNetwork,
  subscribeStatus } from '@polymathnetwork/extension-core/store/subscribers';
import { UidRecord } from '@polymathnetwork/extension-core/types';

import { Errors,
  PolyMessageTypes,
  PolyRequestTypes,
  PolyResponseType,
  ProofingRequest,
  ProvideUidRequest,
  RequestPolyApproveProof,
  RequestPolyCallDetails,
  RequestPolyChangePass,
  RequestPolyGetUid,
  RequestPolyGlobalChangePass,
  RequestPolyIdentityRename,
  RequestPolyNetworkSet,
  RequestPolyProvideUidApprove,
  RequestPolyProvideUidReject,
  RequestPolyRejectProof,
  RequestPolySelectedAccountSet,
  RequestPolyValidatePassword,
  ResponsePolyCallDetails } from '../types';
import State from './State';
import { createSubscription, unsubscribe } from './subscriptions';
import { getScopeAttestationProof } from './utils';

/**
 * Extension handles messages coming from the extension popup UI (i.e packages/ui)
 */
export default class Extension extends DotExtension {
  readonly #state: State;

  constructor (state: State) {
    super(state);

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

    const reduxUnsub = subscribeSelectedNetwork(cb);

    port.onDisconnect.addListener((): void => {
      reduxUnsub();
      unsubscribe(id);
    });

    return true;
  }

  private subscribeNetworkState (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(networkState.subscribe)'>(id, port);

    const reduxUnsub = subscribeNetworkState(cb);

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

  private proofRequestsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(uid.proofRequests.subscribe)'>(id, port);
    const subscription = this.#state.proofSubject.subscribe((requests: ProofingRequest[]): void => cb(requests));

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

  private uidRecordsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'poly:pri(uid.records.subscribe)'>(id, port);
    const subscription = this.#state.uidsSubject.subscribe((records: UidRecord[]): void => cb(records));

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
      uid = await this.#state.getUid(account.did, network, password);

      if (!uid) {
        reject(new Error(Errors.NO_UID));

        return false;
      }
    } catch (error) {
      reject(error);

      return false;
    }

    const proof = await getScopeAttestationProof(accountDid, uid, ticker);

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

    reject(new Error('Rejected'));

    return true;
  }

  private uidProvideRequestsApprove ({ id, password }: RequestPolyProvideUidApprove): boolean {
    const queued = this.#state.getProvideUidRequest(id);

    assert(queued, 'Unable to find request');
    const { request, resolve } = queued;
    const { did, network, uid } = request;

    this.#state.setUid(did, network, uid, password);

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

  private async uidChangePass ({ newPass, oldPass }: RequestPolyChangePass): Promise<boolean> {
    try {
      await this.#state.changeUidPassword(oldPass, newPass);

      return true;
    } catch (error) {
      return false;
    }
  }

  private async getUid ({ did, network, password }: RequestPolyGetUid): Promise<string> {
    let uid = null;

    try {
      uid = await this.#state.getUid(did, network, password);
    } catch (error) {
      return '';
    }

    if (!uid) {
      return '';
    }

    return uid;
  }

  private _changePassword (pair: KeyringPair, oldPass: string, newPass: string): boolean {
    try {
      if (!pair.isLocked) {
        pair.lock();
      }

      pair.decodePkcs8(oldPass);
    } catch (error) {
      return false;
    }

    keyring.encryptAccount(pair, newPass);

    return true;
  }

  private async globalChangePassword ({ newPass, oldPass }: RequestPolyGlobalChangePass): Promise<boolean> {
    const pairs = keyring.getPairs();

    let i = 0;

    for (i; i < pairs.length; i++) {
      const ret = this._changePassword(pairs[i], oldPass, newPass);

      if (!ret) {
        break;
      }
    }

    if (i <= pairs.length - 1) {
      for (let j = 0; j < i; j++) {
        this._changePassword(pairs[j], newPass, oldPass);
      }
    }

    const ret = await this.uidChangePass({ oldPass, newPass });

    return ret;
  }

  private async isPasswordSet (): Promise<boolean> {
    // If there's at least one, non-ledger account, or
    // If there's at least one uid stored
    // Then, user has set password before

    const nonLedgerPairs = keyring.getPairs().filter((pair) => !pair.meta.isHardware).length > 0;

    if (nonLedgerPairs) return true;

    const uidRecords = await this.#state.allUidRecords();

    if (uidRecords.length) return true;

    return false;
  }

  private async validatePassword ({ password }: RequestPolyValidatePassword): Promise<boolean> {
    const nonLedgerPair = keyring.getPairs().filter((pair) => !pair.meta.isHardware)[0];

    // Try to validate against an existing pair.
    if (nonLedgerPair) {
      try {
        if (!nonLedgerPair.isLocked) {
          nonLedgerPair.lock();
        }

        nonLedgerPair.decodePkcs8(password);

        return true;
      } catch (error) {
        return false;
      }
    }

    // If no pairs found, try to validate an existing uID.
    const uidRecords = await this.#state.allUidRecords();

    if (uidRecords.length) {
      const { did, network } = uidRecords[0];

      try {
        await this.#state.getUid(did, network, password);

        return true;
      } catch (error) {
        return false;
      }
    }

    return false;
  }

  private _authorizeApprove ({ id }: RequestAuthorizeApprove): boolean {
    const queued = this.#state._getAuthRequest(id);

    assert(queued, 'Unable to find request');

    const { resolve } = queued;

    resolve(true);

    return true;
  }

  private _getAuthList (): ResponseAuthorizeList {
    return { list: this.#state.authUrls };
  }

  private _authorizeReject ({ id }: RequestAuthorizeReject): boolean {
    const queued = this.#state._getAuthRequest(id);

    assert(queued, 'Unable to find request');

    const { reject } = queued;

    reject(new Error('Rejected'));

    return true;
  }

  public async _handle<TMessageType extends PolyMessageTypes> (
    id: string,
    type: TMessageType,
    request: PolyRequestTypes[TMessageType],
    port: chrome.runtime.Port
  ): Promise<PolyResponseType<TMessageType>> {
    switch (type) {
      case 'pri(authorize.approve)':
        return this._authorizeApprove(request as RequestAuthorizeApprove);

      case 'pri(authorize.list)':
        return this._getAuthList();

      case 'pri(authorize.reject)':
        return this._authorizeReject(request as RequestAuthorizeReject);

      case 'poly:pri(accounts.subscribe)':
        return this.polyAccountsSubscribe(id, port);

      case 'poly:pri(password.isSet)':
        return this.isPasswordSet();

      case 'poly:pri(password.validate)':
        return this.validatePassword(request as RequestPolyValidatePassword);

      case 'poly:pri(network.subscribe)':
        return this.polyNetworkSubscribe(id, port);

      case 'poly:pri(networkState.subscribe)':
        return this.subscribeNetworkState(id, port);

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

      case 'poly:pri(uid.changePass)':
        return this.uidChangePass(request as RequestPolyChangePass);

      case 'poly:pri(uid.records.subscribe)':
        return this.uidRecordsSubscribe(id, port);

      case 'poly:pri(uid.provideRequests.reject)':
        return this.uidProvideRequestsReject(request as RequestPolyProvideUidReject);

      case 'poly:pri(global.changePass)':
        return this.globalChangePassword(request as RequestPolyGlobalChangePass);

      case 'poly:pri(uid.getUid)':
        return this.getUid(request as RequestPolyGetUid);

      default:
        return super.handle(id, type as MessageTypes, request as RequestRpcUnsubscribe, port);
    }
  }
}

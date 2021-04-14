
import DotState, { AuthUrls } from '@polkadot/extension-base/background/handlers/State';
import { AccountJson, RequestAuthorizeTab } from '@polkadot/extension-base/background/types';
import chrome from '@polkadot/extension-inject/chrome';
import { assert } from '@polkadot/util';
import { AUTH_URLS_KEY } from '@polymathnetwork/extension-core/constants';
import { BehaviorSubject } from 'rxjs';

import { NetworkName, ProofRequestPayload, RequestPolyProvideUid, UidRecord } from '../../types';
import { ProofingRequest, ProofingResponse, ProvideUidRequest } from '../types';
import AuxStore from './AuxStore';
import { stripUrl } from './utils';

interface Resolver <T> {
  reject: (error: Error) => void;
  resolve: (result: T) => void;
}

let idCounter = 0;

interface ProofRequestResolver extends Resolver<ProofingResponse> {
  account: AccountJson;
  id: string;
  request: ProofRequestPayload;
  url: string;
}

interface ProvideUidRequestResolver extends Resolver<boolean> {
  id: string;
  request: RequestPolyProvideUid;
  url: string;
}

interface AuthRequest extends Resolver<boolean> {
  id: string;
  idStr: string;
  request: RequestAuthorizeTab;
  url: string;
}

const WINDOW_OPTS = {
  height: 621,
  left: 150,
  top: 150,
  type: 'popup',
  url: chrome.extension.getURL('index.html'),
  width: 400
};

function getId (): string {
  return `${Date.now()}.${++idCounter}`;
}

export default class State extends DotState {
  readonly #proofRequests: Record<string, ProofRequestResolver> = {};

  readonly #provideUidRequests: Record<string, ProvideUidRequestResolver> = {};

  readonly #auxStore = new AuxStore();

  #windows: number[] = [];

  readonly #authUrls: AuthUrls = {};

  readonly #authRequests: Record<string, AuthRequest> = {};

  public readonly proofSubject: BehaviorSubject<ProofingRequest[]> = new BehaviorSubject<ProofingRequest[]>([]);

  public readonly provideUidRequestsSubject: BehaviorSubject<ProvideUidRequest[]> = new BehaviorSubject<ProvideUidRequest[]>([]);

  public uidsSubject: BehaviorSubject<UidRecord[]> = new BehaviorSubject<UidRecord[]>([]);

  constructor () {
    super();

    // retrieve previously set authorizations
    const authString = localStorage.getItem(AUTH_URLS_KEY) || '{}';
    const previousAuth = JSON.parse(authString) as AuthUrls;

    this.#authUrls = previousAuth;

    console.log('>>>> Post init >> this.#authUrls', this.#authUrls);

    this.updateUidSubject();
  }

  private updateUidSubject (): void {
    this.#auxStore.allRecords().then((keys) => {
      this.uidsSubject.next(keys);
    }).catch(console.error);
  }

  public get numProofRequests (): number {
    return Object.keys(this.#proofRequests).length;
  }

  public get numProvideUidRequests (): number {
    return Object.keys(this.#provideUidRequests).length;
  }

  public get allProofRequests (): ProofingRequest[] {
    return Object
      .values(this.#proofRequests)
      .map(({ account, id, request, url }): ProofingRequest => ({ account, id, request, url }));
  }

  public get allProvideUidRequests (): ProvideUidRequest[] {
    return Object
      .values(this.#provideUidRequests)
      .map(({ id, request, url }): ProvideUidRequest => ({ id, request, url }));
  }

  private _saveCurrentAuthList () {
    localStorage.setItem(AUTH_URLS_KEY, JSON.stringify(this.#authUrls));
  }

  public async authorizeUrl (url: string, request: RequestAuthorizeTab): Promise<boolean> {
    const idStr = stripUrl(url);

    // Do not enqueue duplicate authorization requests.
    const isDuplicate = Object.values(this.allAuthRequests)
      .some((request) => stripUrl(request.url) === idStr);

    assert(!isDuplicate, `The source ${url} has a pending authorization request`);

    return new Promise((resolve, reject): void => {
      const id = getId();

      this.#authRequests[id] = {
        ...this._authComplete(id, resolve, reject),
        id,
        idStr,
        request,
        url
      };

      this._updateIconAuth();
      this._popupOpen();
    });
  }

  private _authComplete = (id: string, resolve: (result: boolean) => void, reject: (error: Error) => void): Resolver<boolean> => {
    const complete = (result: boolean | Error) => {
      const isAllowed = result === true;
      const { idStr, request: { origin }, url } = this.#authRequests[id];

      this.#authUrls[stripUrl(url)] = {
        count: 0,
        id: idStr,
        isAllowed,
        origin,
        url
      };

      this._saveCurrentAuthList();
      delete this.#authRequests[id];
      this._updateIconAuth(true);
    };

    return {
      reject: (error: Error): void => {
        complete(error);
        reject(error);
      },
      resolve: (result: boolean): void => {
        complete(result);
        resolve(result);
      }
    };
  }

  private _popupClose (): void {
    this.#windows.forEach((id: number): void =>
      chrome.windows.remove(id)
    );
    this.#windows = [];
  }

  private _popupOpen (): void {
    chrome.windows.create({ ...WINDOW_OPTS }, (window?: chrome.windows.Window): void => {
      if (window) {
        this.#windows.push(window.id);
      }
    });
  }

  private proofRequestComplete = (id: string, resolve: (result: ProofingResponse) => void, reject: (error: Error) => void): Resolver<ProofingResponse> => {
    const complete = (): void => {
      delete this.#proofRequests[id];
      this.updateIconProof(true);
    };

    return {
      reject: (error: Error): void => {
        complete();
        reject(error);
      },
      resolve: (result: ProofingResponse): void => {
        complete();
        resolve(result);
      }
    };
  }

  private provideUidComplete = (id: string, resolve: (result: boolean) => void, reject: (error: Error) => void): Resolver<boolean> => {
    const complete = (): void => {
      delete this.#provideUidRequests[id];
      this.updateIconProvideUid(true);
    };

    return {
      reject: (error: Error): void => {
        complete();
        reject(error);
      },
      resolve: (result: boolean): void => {
        complete();
        resolve(result);
      }
    };
  }

  private updateIconProof (shouldClose?: boolean): void {
    this.proofSubject.next(this.allProofRequests);
    const count = this.numProofRequests;
    const text = (
      count ? `${count}` : '')
    ;

    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this._popupClose();
    }
  }

  private updateIconProvideUid (shouldClose?: boolean): void {
    this.provideUidRequestsSubject.next(this.allProvideUidRequests);
    const count = this.numProvideUidRequests;
    const text = (
      count ? `${count}` : '')
    ;

    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this._popupClose();
    }
  }

  private _updateIcon (shouldClose?: boolean): void {
    const authCount = this.numAuthRequests;
    const metaCount = this.numMetaRequests;
    const signCount = this.numSignRequests;
    const text = (
      authCount
        ? 'Auth'
        : metaCount
          ? 'Meta'
          : (signCount ? `${signCount}` : '')
    );

    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this._popupClose();
    }
  }

  private _updateIconAuth (shouldClose?: boolean): void {
    this.authSubject.next(this.allAuthRequests);
    this._updateIcon(shouldClose);
  }

  public getProofRequest (id: string): ProofRequestResolver {
    return this.#proofRequests[id];
  }

  public getProvideUidRequest (id: string): ProvideUidRequestResolver {
    return this.#provideUidRequests[id];
  }

  public generateProof (url: string, request: ProofRequestPayload, account: AccountJson): Promise<ProofingResponse> {
    const id = getId();

    return new Promise((resolve, reject): void => {
      this.#proofRequests[id] = {
        ...this.proofRequestComplete(id, resolve, reject),
        account,
        id,
        request,
        url
      };

      this.updateIconProof();
      this._popupOpen();
    });
  }

  public provideUid (url: string, request: RequestPolyProvideUid): Promise<boolean> {
    return new Promise((resolve, reject): void => {
      const id = getId();

      this.#provideUidRequests[id] = {
        ...this.provideUidComplete(id, resolve, reject),
        id,
        request,
        url
      };

      this.updateIconProvideUid();
      this._popupOpen();
    });
  }

  public getUid (did: string, network: NetworkName, password: string): Promise<string | null> {
    return this.#auxStore.getn(did, network, password);
  }

  public setUid (did: string, network: NetworkName, uid: string, password: string): void {
    this.#auxStore.setn(did, network, uid, password);
    this.updateUidSubject();
  }

  public async changeUidPassword (oldPass: string, newPass: string): Promise<void> {
    return this.#auxStore.changePassword(oldPass, newPass);
  }

  public async allUidRecords (): Promise<UidRecord[]> {
    return this.#auxStore.allRecords();
  }
}


import { AccountJson } from '@polkadot/extension-base/background/types';
import chrome from '@polkadot/extension-inject/chrome';
import { BehaviorSubject } from 'rxjs';

import { NetworkName, ProofRequestPayload, RequestPolyProvideUid, UidRecord } from '../../types';
import { ProofingRequest, ProofingResponse, ProvideUidRequest } from '../types';
import AuxStore from './AuxStore';

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

const WINDOW_OPTS = {
  height: 621,
  left: 150,
  top: 150,
  type: 'popup',
  url: chrome.extension.getURL('index.html'),
  width: 328
};

function getId (): string {
  return `${Date.now()}.${++idCounter}`;
}

export default class State {
  readonly #proofRequests: Record<string, ProofRequestResolver> = {};

  readonly #provideUidRequests: Record<string, ProvideUidRequestResolver> = {};

  readonly #auxStore = new AuxStore();

  #windows: number[] = [];

  public readonly proofSubject: BehaviorSubject<ProofingRequest[]> = new BehaviorSubject<ProofingRequest[]>([]);

  public readonly provideUidRequestsSubject: BehaviorSubject<ProvideUidRequest[]> = new BehaviorSubject<ProvideUidRequest[]>([]);

  public uidsSubject: BehaviorSubject<UidRecord[]> = new BehaviorSubject<UidRecord[]>([]);

  constructor () {
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

  private popupClose (): void {
    this.#windows.forEach((id: number): void =>
      chrome.windows.remove(id)
    );
    this.#windows = [];
  }

  private popupOpen (): void {
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
      this.popupClose();
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
      this.popupClose();
    }
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
      this.popupOpen();
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
      this.popupOpen();
    });
  }

  public getUid (did: string, network: NetworkName, password: string): Promise<string | null> {
    return this.#auxStore.getN(did, network, password);
  }

  public setUid (did: string, network: NetworkName, uid: string, password: string): void {
    this.#auxStore.setN(did, network, uid, password);
    this.updateUidSubject();
  }

  public async changeUidPassword (oldPass: string, newPass: string): Promise<void> {
    const keys = await this.#auxStore.allKeys();

    let i = 0;
    const values = [];

    try {
      for (i; i < keys.length; i++) {
        const value = await this.#auxStore.getNDecrypt(keys[i], oldPass);

        values.push(value);
        this.#auxStore.setNEncrypt(keys[i], value, newPass);
      }
    } catch (error) {
      for (let j = 0; j < i; j++) {
        this.#auxStore.setNEncrypt(keys[j], values[j], oldPass);
      }

      // Escalate error
      throw new Error('oldPass: Some uIDs cannot be decrypted with the provided password.');
    }
  }
}

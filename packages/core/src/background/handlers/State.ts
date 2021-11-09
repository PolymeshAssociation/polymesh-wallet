import DotState from '@polkadot/extension-base/background/handlers/State';
import { AccountJson } from '@polkadot/extension-base/background/types';
import chrome from '@polkadot/extension-inject/chrome';
import { BehaviorSubject } from 'rxjs';

import {
  NetworkName,
  ProofRequestPayload,
  RequestPolyProvideUid,
  UidRecord,
} from '../../types';
import {
  ProofingRequest,
  ProofingResponse,
  ProvideUidRequest,
  ReadUidRequest,
  ReadUidResponse,
  RequestPolyReadUid,
} from '../types';
import AuxStore from './AuxStore';

interface Resolver<T> {
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

interface UidReadRequestResolver extends Resolver<ReadUidResponse> {
  id: string;
  request: RequestPolyReadUid;
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
  type: 'popup' as const,
  url: chrome.extension.getURL('index.html'),
  width: 400,
};

function getId(): string {
  return `${Date.now()}.${++idCounter}`;
}

export default class State extends DotState {
  readonly #proofRequests: Record<string, ProofRequestResolver> = {};

  readonly #provideUidRequests: Record<string, ProvideUidRequestResolver> = {};

  readonly #readUidRequests: Record<string, UidReadRequestResolver> = {};

  readonly #auxStore = new AuxStore();

  #windows: number[] = [];

  public readonly proofSubject: BehaviorSubject<ProofingRequest[]> =
    new BehaviorSubject<ProofingRequest[]>([]);

  public readonly provideUidRequestsSubject: BehaviorSubject<
    ProvideUidRequest[]
  > = new BehaviorSubject<ProvideUidRequest[]>([]);

  public readonly readUidRequestsSubject: BehaviorSubject<ReadUidRequest[]> =
    new BehaviorSubject<ReadUidRequest[]>([]);

  public uidsSubject: BehaviorSubject<UidRecord[]> = new BehaviorSubject<
    UidRecord[]
  >([]);

  constructor() {
    super();

    this.updateUidSubject();
  }

  private updateUidSubject(): void {
    this.#auxStore
      .allRecords()
      .then((keys) => {
        this.uidsSubject.next(keys);
      })
      .catch(console.error);
  }

  public get numProofRequests(): number {
    return Object.keys(this.#proofRequests).length;
  }

  public get numProvideUidRequests(): number {
    return Object.keys(this.#provideUidRequests).length;
  }

  public get numReadUidRequests(): number {
    return Object.keys(this.#readUidRequests).length;
  }

  public get allProofRequests(): ProofingRequest[] {
    return Object.values(this.#proofRequests).map(
      ({ account, id, request, url }): ProofingRequest => ({
        account,
        id,
        request,
        url,
      })
    );
  }

  public get allProvideUidRequests(): ProvideUidRequest[] {
    return Object.values(this.#provideUidRequests).map(
      ({ id, request, url }): ProvideUidRequest => ({ id, request, url })
    );
  }

  public get allReadUidRequests(): ReadUidRequest[] {
    return Object.values(this.#readUidRequests).map(
      ({ id, request, url }): ReadUidRequest => ({ id, request, url })
    );
  }

  private _popupClose(): void {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.#windows.forEach((id: number) => chrome.windows.remove(id));
    this.#windows = [];
  }

  private _popupOpen(): void {
    chrome.windows.create(
      { ...WINDOW_OPTS },
      (window?: chrome.windows.Window): void => {
        if (window?.id) {
          this.#windows.push(window.id);
        }
      }
    );
  }

  private proofRequestComplete = (
    id: string,
    resolve: (result: ProofingResponse) => void,
    reject: (error: Error) => void
  ): Resolver<ProofingResponse> => {
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
      },
    };
  };

  private readUidComplete = (
    id: string,
    resolve: (result: ReadUidResponse) => void,
    reject: (error: Error) => void
  ): Resolver<ReadUidResponse> => {
    const complete = (): void => {
      delete this.#readUidRequests[id];
      this.updateIconReadUid(true);
    };

    return {
      reject: (error: Error): void => {
        complete();
        reject(error);
      },
      resolve: (result: ReadUidResponse): void => {
        complete();
        resolve(result);
      },
    };
  };

  private provideUidComplete = (
    id: string,
    resolve: (result: boolean) => void,
    reject: (error: Error) => void
  ): Resolver<boolean> => {
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
      },
    };
  };

  private updateIconProof(shouldClose?: boolean): void {
    this.proofSubject.next(this.allProofRequests);
    const count = this.numProofRequests;
    const text = count ? `${count}` : '';

    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this._popupClose();
    }
  }

  private updateIconProvideUid(shouldClose?: boolean): void {
    this.provideUidRequestsSubject.next(this.allProvideUidRequests);
    const count = this.numProvideUidRequests;
    const text = count ? `${count}` : '';
    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this._popupClose();
    }
  }

  private updateIconReadUid(shouldClose?: boolean): void {
    this.readUidRequestsSubject.next(this.allReadUidRequests);
    const count = this.numReadUidRequests;
    const text = count ? `${count}` : '';
    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this._popupClose();
    }
  }

  public getProofRequest(id: string): ProofRequestResolver {
    return this.#proofRequests[id];
  }

  public getProvideUidRequest(id: string): ProvideUidRequestResolver {
    return this.#provideUidRequests[id];
  }

  public getReadUidRequest(id: string): UidReadRequestResolver {
    return this.#readUidRequests[id];
  }

  public generateProof(
    url: string,
    request: ProofRequestPayload,
    account: AccountJson
  ): Promise<ProofingResponse> {
    const id = getId();

    return new Promise((resolve, reject): void => {
      this.#proofRequests[id] = {
        ...this.proofRequestComplete(id, resolve, reject),
        account,
        id,
        request,
        url,
      };

      this.updateIconProof();
      this._popupOpen();
    });
  }

  public readUid(
    url: string,
    request: RequestPolyReadUid
  ): Promise<ReadUidResponse> {
    const id = getId();

    return new Promise((resolve, reject): void => {
      this.#readUidRequests[id] = {
        ...this.readUidComplete(id, resolve, reject),
        id,
        request,
        url,
      };

      this.updateIconReadUid();
      this._popupOpen();
    });
  }

  public provideUid(
    url: string,
    request: RequestPolyProvideUid
  ): Promise<boolean> {
    return new Promise((resolve, reject): void => {
      const id = getId();

      this.#provideUidRequests[id] = {
        ...this.provideUidComplete(id, resolve, reject),
        id,
        request,
        url,
      };

      this.updateIconProvideUid();
      this._popupOpen();
    });
  }

  public getUid(
    did: string,
    network: NetworkName,
    password: string
  ): Promise<string | null> {
    return this.#auxStore.getn(did, network, password);
  }

  public setUid(
    did: string,
    network: NetworkName,
    uid: string,
    password: string
  ): void {
    this.#auxStore.setn(did, network, uid, password);
    this.updateUidSubject();
  }

  public async changeUidPassword(
    oldPass: string,
    newPass: string
  ): Promise<void> {
    return this.#auxStore.changePassword(oldPass, newPass);
  }

  public async allUidRecords(): Promise<UidRecord[]> {
    return this.#auxStore.allRecords();
  }
}


import { AccountJson } from '@polkadot/extension-base/background/types';
import chrome from '@polkadot/extension-inject/chrome';
import { ProofRequestPayload } from '@polymathnetwork/extension-core/types';
import { BehaviorSubject } from 'rxjs';

import { ProofingRequest, ResponseProofing } from '../types';

interface Resolver <T> {
  reject: (error: Error) => void;
  resolve: (result: T) => void;
}

let idCounter = 0;

interface ProofRequest extends Resolver<ResponseProofing> {
  account: AccountJson;
  id: string;
  request: ProofRequestPayload;
  url: string;
}

const WINDOW_OPTS = {
  // This is not allowed on FF, only on Chrome - disable completely
  // focused: true,
  height: 621,
  left: 150,
  top: 150,
  type: 'popup',
  url: chrome.extension.getURL('index.html'),
  width: 560
};

function getId (): string {
  return `${Date.now()}.${++idCounter}`;
}

export default class State {
  readonly #proofRequests: Record<string, ProofRequest> = {};

  #windows: number[] = [];

  public readonly proofSubject: BehaviorSubject<ProofingRequest[]> = new BehaviorSubject<ProofingRequest[]>([]);

  public get numProofRequests (): number {
    return Object.keys(this.#proofRequests).length;
  }

  public get allProofRequests (): ProofingRequest[] {
    return Object
      .values(this.#proofRequests)
      .map(({ account, id, request, url }): ProofingRequest => ({ account, id, request, url }));
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

  private requestComplete = (id: string, resolve: (result: ResponseProofing) => void, reject: (error: Error) => void): Resolver<ResponseProofing> => {
    const complete = (): void => {
      delete this.#proofRequests[id];
      this.updateIconSign(true);
    };

    return {
      reject: (error: Error): void => {
        complete();
        reject(error);
      },
      resolve: (result: ResponseProofing): void => {
        complete();
        resolve(result);
      }
    };
  }

  private updateIcon (shouldClose?: boolean): void {
    const signCount = this.numProofRequests;
    const text = (
      signCount ? `${signCount}` : '')
    ;

    chrome.browserAction.setBadgeText({ text });

    if (shouldClose && text === '') {
      this.popupClose();
    }
  }

  private updateIconSign (shouldClose?: boolean): void {
    this.proofSubject.next(this.allProofRequests);
    this.updateIcon(shouldClose);
  }

  public getProofRequest (id: string): ProofRequest {
    return this.#proofRequests[id];
  }

  public generateProof (url: string, request: ProofRequestPayload, account: AccountJson): Promise<ResponseProofing> {
    const id = getId();

    return new Promise((resolve, reject): void => {
      this.#proofRequests[id] = {
        ...this.requestComplete(id, resolve, reject),
        account,
        id,
        request,
        url
      };

      this.updateIconSign();
      this.popupOpen();
    });
  }
}

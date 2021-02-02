import { AccountJson, AuthorizeRequest, MessageTypes, MessageTypesWithNoSubscriptions, MessageTypesWithNullRequest, MessageTypesWithSubscriptions, MetadataRequest, RequestTypes, ResponseDeriveValidate, ResponseJsonRestore, ResponseTypes, SeedLengths, SigningRequest, SubscriptionMessageTypes } from '@polkadot/extension-base/background/types';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { Message } from '@polkadot/extension-base/types';
import { metadataExpand } from '@polkadot/extension-chains';
import allChains from '@polkadot/extension-chains/chains';
import { Chain } from '@polkadot/extension-chains/types';
import chrome from '@polkadot/extension-inject/chrome';
import { MetadataDef } from '@polkadot/extension-inject/types';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { PolyMessageTypes, PolyMessageTypesWithNoSubscriptions, PolyMessageTypesWithNullRequest, PolyMessageTypesWithSubscriptions, PolyRequestTypes, PolyResponseTypes, PolySubscriptionMessageTypes, ProofingRequest, ProvideUidRequest, ResponsePolyCallDetails } from '@polymathnetwork/extension-core/background/types';
import { IdentifiedAccount, NetworkName, StoreStatus } from '@polymathnetwork/extension-core/types';

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;
type CB = (isBusy: boolean) => void

const metadataGets = new Map<string, Promise<MetadataDef | null>>();
const port = chrome.runtime.connect({ name: PORT_EXTENSION });
const handlers: Handlers = {};
let idCounter = 0;

class BusyStateSubscriber {
  private isBusy = false;
  private listeners: CB[] = [];
  private notifyListeners () {
    this.listeners.forEach((listener) => listener(this.isBusy));
  }

  public addListener (cb: CB) {
    this.listeners.push(cb);
  }

  public sentMessage () {
    this.isBusy = true;
    this.notifyListeners();
  }

  public receivedResponse () {
    this.isBusy = false;
    this.notifyListeners();
  }
}

export const busySubscriber = new BusyStateSubscriber();

// setup a listener for messages, any incoming resolves the promise
port.onMessage.addListener((data: Message['data']): void => {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`);

    return;
  }

  busySubscriber.receivedResponse();

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
});

function sendMessage<TMessageType extends MessageTypesWithNullRequest>(message: TMessageType): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithNoSubscriptions>(message: TMessageType, request: RequestTypes[TMessageType]): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithSubscriptions>(message: TMessageType, request: RequestTypes[TMessageType], subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypes> (message: TMessageType, request?: RequestTypes[TMessageType], subscriber?: (data: unknown) => void): Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { reject, resolve, subscriber };

    busySubscriber.sentMessage();

    port.postMessage({ id, message, request: request || {} });
  });
}

function polyMessage<TMessageType extends PolyMessageTypesWithNullRequest>(message: TMessageType): Promise<PolyRequestTypes[TMessageType]>;
function polyMessage<TMessageType extends PolyMessageTypesWithNoSubscriptions>(message: TMessageType, request: PolyRequestTypes[TMessageType]): Promise<PolyResponseTypes[TMessageType]>;
function polyMessage<TMessageType extends PolyMessageTypesWithSubscriptions>(message: TMessageType, request: PolyRequestTypes[TMessageType], subscriber: (data: PolySubscriptionMessageTypes[TMessageType]) => void): Promise<PolyResponseTypes[TMessageType]>;
function polyMessage<TMessageType extends PolyMessageTypes> (message: TMessageType, request?: PolyRequestTypes[TMessageType], subscriber?: (data: unknown) => void): Promise<PolyResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { reject, resolve, subscriber };

    busySubscriber.sentMessage();

    port.postMessage({ id, message, request: request || {} });
  });
}

export async function editAccount (address: string, name: string): Promise<boolean> {
  return sendMessage('pri(accounts.edit)', { address, name });
}

export async function showAccount (address: string, isShowing: boolean): Promise<boolean> {
  return sendMessage('pri(accounts.show)', { address, isShowing });
}

export async function tieAccount (address: string, genesisHash: string | null): Promise<boolean> {
  return sendMessage('pri(accounts.tie)', { address, genesisHash });
}

export async function exportAccount (address: string, password: string): Promise<{ exportedJson: string }> {
  return sendMessage('pri(accounts.export)', { address, password });
}

export async function validateAccount (address: string, password: string): Promise<boolean> {
  return sendMessage('pri(accounts.validate)', { address, password });
}

export async function forgetAccount (address: string): Promise<boolean> {
  return sendMessage('pri(accounts.forget)', { address });
}

export async function approveAuthRequest (id: string): Promise<boolean> {
  return sendMessage('pri(authorize.approve)', { id });
}

export async function approveMetaRequest (id: string): Promise<boolean> {
  return sendMessage('pri(metadata.approve)', { id });
}

export async function cancelSignRequest (id: string): Promise<boolean> {
  return sendMessage('pri(signing.cancel)', { id });
}

export async function isSignLocked (id: string): Promise<boolean> {
  return sendMessage('pri(signing.isLocked)', { id });
}

export async function approveSignPassword (id: string, password: string, isSavedPass: boolean): Promise<boolean> {
  return sendMessage('pri(signing.approve.password)', { id, isSavedPass, password });
}

export async function approveSignSignature (id: string, signature: string): Promise<boolean> {
  return sendMessage('pri(signing.approve.signature)', { id, signature });
}

export async function approveProofRequest (id: string): Promise<boolean> {
  return polyMessage('poly:pri(uid.proofRequests.approve)', { id });
}

export async function rejectProofRequest (id: string): Promise<boolean> {
  return polyMessage('poly:pri(uid.proofRequests.reject)', { id });
}

export async function approveUidProvideRequest (id: string): Promise<boolean> {
  return polyMessage('poly:pri(uid.provideRequests.approve)', { id });
}

export async function rejectUidProvideRequest (id: string): Promise<boolean> {
  return polyMessage('poly:pri(uid.provideRequests.reject)', { id });
}

export async function createAccountExternal (name: string, address: string, genesisHash: string): Promise<boolean> {
  return sendMessage('pri(accounts.create.external)', { address, genesisHash, name });
}

export async function createAccountSuri (name: string, password: string, suri: string, type?: KeypairType): Promise<boolean> {
  return sendMessage('pri(accounts.create.suri)', { name, password, suri, type });
}

export async function createSeed (length?: SeedLengths, type?: KeypairType): Promise<{ address: string; seed: string }> {
  return sendMessage('pri(seed.create)', { length, type });
}

export async function subscribePolyAccounts (cb: (accounts: IdentifiedAccount[]) => void): Promise<boolean> {
  return polyMessage('poly:pri(accounts.subscribe)', null, cb);
}

export async function subscribePolyNetwork (cb: (network: NetworkName) => void): Promise<boolean> {
  return polyMessage('poly:pri(network.subscribe)', null, cb);
}

export async function getMetadata (genesisHash?: string | null, isPartial = false): Promise<Chain | null> {
  if (!genesisHash) {
    return null;
  }

  let request = metadataGets.get(genesisHash);

  if (!request) {
    request = sendMessage('pri(metadata.get)', genesisHash || null);
    metadataGets.set(genesisHash, request);
  }

  const def = await request;

  if (def) {
    return metadataExpand(def, isPartial);
  } else if (isPartial) {
    const chain = allChains.find((chain) => chain.genesisHash === genesisHash);

    if (chain) {
      return metadataExpand({
        ...chain,
        specVersion: 0,
        tokenDecimals: 15,
        tokenSymbol: 'Unit',
        types: {}
      }, isPartial);
    }
  }

  return null;
}

export async function rejectAuthRequest (id: string): Promise<boolean> {
  return sendMessage('pri(authorize.reject)', { id });
}

export async function rejectMetaRequest (id: string): Promise<boolean> {
  return sendMessage('pri(metadata.reject)', { id });
}

export async function subscribeAccounts (cb: (accounts: AccountJson[]) => void): Promise<boolean> {
  return sendMessage('pri(accounts.subscribe)', null, cb);
}

export async function subscribePolySelectedAccount (cb: (selected: string | undefined) => void): Promise<boolean> {
  return polyMessage('poly:pri(selectedAccount.subscribe)', null, cb);
}

export async function setPolySelectedAccount (account: string): Promise<boolean> {
  return polyMessage('poly:pri(selectedAccount.set)', { account });
}

export async function setPolyNetwork (network: NetworkName): Promise<boolean> {
  return polyMessage('poly:pri(network.set)', { network });
}

export async function togglePolyIsDev (): Promise<boolean> {
  return polyMessage('poly:pri(isDev.toggle)', null);
}

export async function subscribePolyStatus (cb: (status: StoreStatus) => void): Promise<boolean> {
  return polyMessage('poly:pri(status.subscribe)', null, cb);
}

export async function subscribePolyIsDev (cb: (isDev: string) => void): Promise<boolean> {
  return polyMessage('poly:pri(isDev.subscribe)', null, cb);
}

export async function subscribeProofingRequests (cb: (requests: ProofingRequest[]) => void): Promise<boolean> {
  return polyMessage('poly:pri(uid.proofRequests.subscribe)', null, cb);
}

export async function subscribeProvideUidRequests (cb: (requests: ProvideUidRequest[]) => void): Promise<boolean> {
  return polyMessage('poly:pri(uid.provideRequests.subscribe)', null, cb);
}

export async function renameIdentity (network: NetworkName, did: string, name: string): Promise<boolean> {
  return polyMessage('poly:pri(identity.rename)', { network, did, name });
}

export async function getPolyCallDetails (request: SignerPayloadJSON): Promise<ResponsePolyCallDetails> {
  return polyMessage('poly:pri(callDetails.get)', { request });
}

export async function subscribeAuthorizeRequests (cb: (accounts: AuthorizeRequest[]) => void): Promise<boolean> {
  return sendMessage('pri(authorize.requests)', null, cb);
}

export async function subscribeMetadataRequests (cb: (requests: MetadataRequest[]) => void): Promise<boolean> {
  return sendMessage('pri(metadata.requests)', null, cb);
}

export async function subscribeSigningRequests (cb: (requests: SigningRequest[]) => void): Promise<boolean> {
  return sendMessage('pri(signing.requests)', null, cb);
}

export async function validateSeed (suri: string, type?: KeypairType): Promise<{ address: string; suri: string }> {
  return sendMessage('pri(seed.validate)', { suri, type });
}

export async function windowOpen (): Promise<boolean> {
  return sendMessage('pri(window.open)', null);
}

export async function validateDerivationPath (parentAddress: string, suri: string, parentPassword: string): Promise<ResponseDeriveValidate> {
  return sendMessage('pri(derivation.validate)', { parentAddress, parentPassword, suri });
}

export async function deriveAccount (parentAddress: string, suri: string, parentPassword: string, name: string, password: string, genesisHash: string | null): Promise<boolean> {
  return sendMessage('pri(derivation.create)', { genesisHash, name, parentAddress, parentPassword, password, suri });
}

export async function jsonRestoreWindowOpen (): Promise<boolean> {
  return sendMessage('pri(window.open.json)', null);
}

export async function jsonVerifyFile (json: KeyringPair$Json): Promise<boolean> {
  return sendMessage('pri(json.verify.file)', { json, password: '' });
}

export async function jsonVerifyPassword (password: string): Promise<boolean> {
  return sendMessage('pri(json.verify.password)', password);
}

export async function jsonRestore (json: KeyringPair$Json, password: string): Promise<ResponseJsonRestore> {
  return sendMessage('pri(json.restore)', { json, password });
}

export async function changePassword (address: string, oldPass: string, newPass: string): Promise<boolean> {
  return sendMessage('pri(accounts.changePassword)', { address, newPass, oldPass });
}

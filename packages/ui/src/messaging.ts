/* global chrome */
/* eslint-disable no-redeclare */

import type { AccountJson, AuthorizeRequest, ConnectedTabsUrlResponse, MetadataRequest, ResponseAuthorizeList, ResponseDeriveValidate, ResponseJsonGetAccountInfo, ResponseSigningIsLocked, SeedLengths, SigningRequest } from '@polkadot/extension-base/background/types';
import type { Message } from '@polkadot/extension-base/types';
import type { MetadataDef } from '@polkadot/extension-inject/types';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import type { HexString } from '@polkadot/util/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { AllowedPath, PolyMessageTypes, PolyMessageTypesWithNoSubscriptions, PolyMessageTypesWithNullRequest, PolyMessageTypesWithSubscriptions, PolyRequestTypes, PolyResponseTypes, PolySubscriptionMessageTypes, ResponsePolyCallDetails } from '@polymeshassociation/extension-core/background/types';
import type { IdentifiedAccount, NetworkName, NetworkState, StoreStatus } from '@polymeshassociation/extension-core/types';

import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { getId } from '@polkadot/extension-base/utils/getId';
import { ensurePortConnection } from '@polkadot/extension-base/utils/portUtils';

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;
type CB = (isBusy: boolean) => void;

const handlers: Handlers = {};

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

let port: chrome.runtime.Port | undefined;

function onPortMessageHandler (data: Message['data']): void {
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
}

function onPortDisconnectHandler (): void {
  port = undefined;
}

const portConfig = {
  onPortDisconnectHandler,
  onPortMessageHandler,
  portName: PORT_EXTENSION
};

/**
 * - Handles sending messages to be handled by polkadot extension.
 * - Refer to packages/extension/src/background.ts for routing logic.
 */
function sendMessage<TMessageType extends PolyMessageTypesWithNullRequest>(message: TMessageType): Promise<PolyResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends PolyMessageTypesWithNoSubscriptions>(message: TMessageType, request: PolyRequestTypes[TMessageType]): Promise<PolyResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends PolyMessageTypesWithSubscriptions>(message: TMessageType, request: PolyRequestTypes[TMessageType], subscriber: (data: PolySubscriptionMessageTypes[TMessageType]) => void): Promise<PolyResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends PolyMessageTypes> (message: TMessageType, request?: PolyRequestTypes[TMessageType], subscriber?: (data: unknown) => void): Promise<PolyResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = getId();

    handlers[id] = { reject, resolve, subscriber };

    busySubscriber.sentMessage();
    console.log('message = ', message);

    ensurePortConnection(port, portConfig).then((connectedPort) => {
      connectedPort.postMessage({ id, message, request: request || {} });
      port = connectedPort;
    }).catch((error) => {
      console.error(`Failed to send message: ${(error as Error).message}`);
      reject(error);
    });
  });
}

export async function editAccount (address: string, name: string): Promise<boolean> {
  return sendMessage('pri(accounts.edit)', { address, name });
}

export async function showAccount (address: string, isShowing: boolean): Promise<boolean> {
  return sendMessage('pri(accounts.show)', { address, isShowing });
}

export async function tieAccount (address: string, genesisHash: HexString | null): Promise<boolean> {
  return sendMessage('pri(accounts.tie)', { address, genesisHash });
}

export async function exportAccount (address: string, password: string): Promise<{ exportedJson: KeyringPair$Json }> {
  return sendMessage('pri(accounts.export)', { address, password });
}

export async function exportAccounts (addresses: string[], password: string): Promise<{ exportedJson: KeyringPairs$Json }> {
  return sendMessage('pri(accounts.batchExport)', { addresses, password });
}

export async function validateAccount (address: string, password: string): Promise<boolean> {
  return sendMessage('pri(accounts.validate)', { address, password });
}

export async function forgetAccount (address: string): Promise<boolean> {
  return sendMessage('pri(accounts.forget)', { address });
}

export async function approveAuthRequest (id: string, authorizedAccounts: string[]): Promise<boolean> {
  return sendMessage('pri(authorize.approve)', { authorizedAccounts, id });
}

export async function approveMetaRequest (id: string): Promise<boolean> {
  return sendMessage('pri(metadata.approve)', { id });
}

export async function cancelSignRequest (id: string): Promise<boolean> {
  return sendMessage('pri(signing.cancel)', { id });
}

export async function isSignLocked (id: string): Promise<ResponseSigningIsLocked> {
  return sendMessage('pri(signing.isLocked)', { id });
}

export async function approveSignPassword (id: string, savePass: boolean, password?: string): Promise<boolean> {
  return sendMessage('pri(signing.approve.password)', { id, password, savePass });
}

export async function approveSignSignature (id: string, signature: HexString): Promise<boolean> {
  return sendMessage('pri(signing.approve.signature)', { id, signature });
}

export async function createAccountExternal (name: string, address: string, genesisHash: HexString | null): Promise<boolean> {
  return sendMessage('pri(accounts.create.external)', { address, genesisHash, name });
}

export async function createAccountHardware (address: string, hardwareType: string, accountIndex: number, addressOffset: number, name: string, genesisHash: HexString): Promise<boolean> {
  return sendMessage('pri(accounts.create.hardware)', { accountIndex, address, addressOffset, genesisHash, hardwareType, name });
}

export async function createAccountSuri (name: string, password: string, suri: string, type?: KeypairType, genesisHash?: HexString | null): Promise<boolean> {
  return sendMessage('pri(accounts.create.suri)', { genesisHash, name, password, suri, type });
}

export async function createSeed (length?: SeedLengths, seed?: string, type?: KeypairType): Promise<{ address: string; seed: string }> {
  return sendMessage('pri(seed.create)', { length, seed, type });
}

export async function getAllMetadata (): Promise<MetadataDef[]> {
  return sendMessage('pri(metadata.list)');
}

export async function getConnectedTabsUrl (): Promise<ConnectedTabsUrlResponse> {
  return sendMessage('pri(connectedTabsUrl.get)', null);
}

export async function rejectMetaRequest (id: string): Promise<boolean> {
  return sendMessage('pri(metadata.reject)', { id });
}

export async function subscribeAccounts (cb: (accounts: AccountJson[]) => void): Promise<boolean> {
  return sendMessage('pri(accounts.subscribe)', null, cb);
}

export async function subscribeAuthorizeRequests (cb: (accounts: AuthorizeRequest[]) => void): Promise<boolean> {
  return sendMessage('pri(authorize.requests)', null, cb);
}

export async function getAuthList (): Promise<ResponseAuthorizeList> {
  return sendMessage('pri(authorize.list)');
}

export async function removeAuthorization (url: string): Promise<ResponseAuthorizeList> {
  return sendMessage('pri(authorize.remove)', url);
}

export async function updateAuthorization (authorizedAccounts: string[], url: string): Promise<void> {
  return sendMessage('pri(authorize.update)', { authorizedAccounts, url });
}

export async function rejectAuthRequest (requestId: string): Promise<void> {
  return sendMessage('pri(authorize.reject)', requestId);
}

export async function cancelAuthRequest (requestId: string): Promise<void> {
  return sendMessage('pri(authorize.cancel)', requestId);
}

export async function subscribeMetadataRequests (cb: (accounts: MetadataRequest[]) => void): Promise<boolean> {
  return sendMessage('pri(metadata.requests)', null, cb);
}

export async function subscribeSigningRequests (cb: (accounts: SigningRequest[]) => void): Promise<boolean> {
  return sendMessage('pri(signing.requests)', null, cb);
}

export async function validateSeed (suri: string, type?: KeypairType): Promise<{ address: string; suri: string }> {
  return sendMessage('pri(seed.validate)', { suri, type });
}

export async function validateDerivationPath (parentAddress: string, suri: string, parentPassword: string): Promise<ResponseDeriveValidate> {
  return sendMessage('pri(derivation.validate)', { parentAddress, parentPassword, suri });
}

export async function deriveAccount (parentAddress: string, suri: string, parentPassword: string, name: string, password: string, genesisHash: HexString | null): Promise<boolean> {
  return sendMessage('pri(derivation.create)', { genesisHash, name, parentAddress, parentPassword, password, suri });
}

// export async function windowOpen (path: AllowedPath): Promise<boolean> {
//   return sendMessage('pri(window.open)', path);
// }

export async function jsonGetAccountInfo (json: KeyringPair$Json): Promise<ResponseJsonGetAccountInfo> {
  return sendMessage('pri(json.account.info)', json);
}

export async function jsonRestore (file: KeyringPair$Json, password: string): Promise<void> {
  return sendMessage('pri(json.restore)', { file, password });
}

export async function batchRestore (file: KeyringPairs$Json, password: string): Promise<void> {
  return sendMessage('pri(json.batchRestore)', { file, password });
}

export async function setNotification (notification: string): Promise<boolean> {
  return sendMessage('pri(settings.notification)', notification);
}

export async function ping (): Promise<boolean> {
  return sendMessage('pri(ping)', null);
}

export async function changePassword (address: string, oldPass: string, newPass: string): Promise<boolean> {
  return sendMessage('pri(accounts.changePassword)', { address, newPass, oldPass });
}

/* POLYWALLET SPECIFIC MESSAGES */

export async function windowOpen (path: AllowedPath): Promise<boolean> {
  return sendMessage('poly:pri(window.open)', path);
}

export async function subscribePolyAccounts (cb: (accounts: IdentifiedAccount[]) => void): Promise<boolean> {
  return sendMessage('poly:pri(accounts.subscribe)', null, cb);
}

export async function subscribeNetworkState (cb: (networkState: NetworkState) => void): Promise<boolean> {
  return sendMessage('poly:pri(networkState.subscribe)', null, cb);
}

export async function subscribePolySelectedAccount (cb: (selected: string | undefined) => void): Promise<boolean> {
  return sendMessage('poly:pri(selectedAccount.subscribe)', null, cb);
}

export async function setPolySelectedAccount (account: string): Promise<boolean> {
  return sendMessage('poly:pri(selectedAccount.set)', { account });
}

export async function setPolyNetwork (network: NetworkName): Promise<boolean> {
  return sendMessage('poly:pri(network.set)', { network });
}

export async function setPolyCustomRpc (customNetworkUrl: string): Promise<boolean> {
  return sendMessage('poly:pri(network.setCustomNetworkUrl)', { customNetworkUrl });
}

export async function isPasswordSet (): Promise<boolean> {
  return sendMessage('poly:pri(password.isSet)', null);
}

export async function validatePassword (password: string): Promise<boolean> {
  return sendMessage('poly:pri(password.validate)', { password });
}

export async function togglePolyIsDev (): Promise<boolean> {
  return sendMessage('poly:pri(isDev.toggle)', null);
}

export async function subscribePolyStatus (cb: (status: StoreStatus) => void): Promise<boolean> {
  return sendMessage('poly:pri(status.subscribe)', null, cb);
}

export async function renameIdentity (did: string, name: string): Promise<boolean> {
  return sendMessage('poly:pri(identity.rename)', { did, name });
}

export async function getPolyCallDetails (
  request: SignerPayloadJSON
): Promise<ResponsePolyCallDetails> {
  return sendMessage('poly:pri(callDetails.get)', { request });
}

export async function globalChangePass (oldPass: string, newPass: string): Promise<boolean> {
  return sendMessage('poly:pri(global.changePass)', { newPass, oldPass });
}

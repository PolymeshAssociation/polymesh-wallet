import { AccountJson, RequestAccountList, RequestAccountSubscribe } from '@polkadot/extension-base/background/types';
import { InjectedAccount, InjectedMetadataKnown, MetadataDef } from '@polkadot/extension-inject/types';
import { FunctionMetadataLatest } from '@polkadot/types/interfaces';
import { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';

import { IdentifiedAccount, NetworkMeta, NetworkName, ProofRequestPayload, RequestPolyProvideUid, StoreStatus } from '../types';

export enum Errors {
  NO_ACCOUNT = 'No accounts found.',
  NO_DID = 'Selected user account is not verified.',
  NO_UID = 'No uID associated with the selected account / chain',
}
export interface ResponsePolyCallDetails {
  networkFee: string,
  protocolFee: string,
  method: string,
  section: string,
  meta: FunctionMetadataLatest,
  args: AnyJson;
}

export type RequestPolyAccountsSubscribe = null;

export type RequestPolyNetworkSubscribe = null;

export type RequestPolySelectedAccountSubscribe = null;

export type RequestPolyStatusSubscribe = null;

export type RequestPolyNetworkGet = null;

export type RequestPolyNetworkMetaSubscribe = null;

export type RequestPolyIsDevSubscribe = null;

export type RequestProofingSubscribe = null;

export type RequestPolyProvideUidSubscribe = null;

export interface RequestPolyNetworkSet {
  network: NetworkName
}

export type RequestPolyIsDevToggle = null;

export interface RequestPolySelectedAccountSet {
  account: string
}

export interface RequestPolyCallDetails {
  request: SignerPayloadJSON;
}

export interface RequestPolyIdentityRename {
  network: NetworkName,
  did: string,
  name: string
}

export interface ProofingResponse {
  id: string;
  proof: string;
}

export interface ProofingRequest {
  account: AccountJson;
  id: string;
  request: ProofRequestPayload;
  url: string;
}

export interface ProvideUidRequest {
  id: string;
  request: RequestPolyProvideUid;
  url: string;
}

export interface RequestPolyApproveProof {
  id: string;
  password: string;
}

export interface RequestPolyRejectProof {
  id: string;
}

export interface RequestPolyProvideUidApprove {
  id: string;
  password: string;
}

export interface RequestPolyChangePass {
  oldPass: string;
  newPass: string;
}

export interface RequestPolyGlobalChangePass {
  oldPass: string;
  newPass: string;
}

export interface RequestPolyProvideUidReject {
  id: string;
}

export interface PolyRequestSignatures {
  'poly:pri(accounts.subscribe)': [RequestPolyAccountsSubscribe, boolean, IdentifiedAccount[]];
  'poly:pri(network.subscribe)': [RequestPolyNetworkSubscribe, boolean, NetworkName];
  'poly:pri(selectedAccount.subscribe)': [RequestPolySelectedAccountSubscribe, boolean, string | undefined];
  'poly:pri(status.subscribe)': [RequestPolyStatusSubscribe, boolean, StoreStatus]
  'poly:pri(network.set)': [RequestPolyNetworkSet, boolean];
  'poly:pri(isDev.toggle)': [RequestPolyIsDevToggle, boolean];
  'poly:pri(isDev.subscribe)': [RequestPolyIsDevSubscribe, boolean, string];
  'poly:pri(selectedAccount.set)': [RequestPolySelectedAccountSet, boolean];
  'poly:pri(callDetails.get)': [RequestPolyCallDetails, ResponsePolyCallDetails];
  'poly:pri(identity.rename)': [RequestPolyIdentityRename, boolean];
  'poly:pub(network.get)': [RequestPolyNetworkGet, NetworkMeta];
  'poly:pub(network.subscribe)': [RequestPolyNetworkMetaSubscribe, boolean, NetworkMeta];

  'poly:pub(uid.requestProof)': [ProofRequestPayload, ProofingResponse];
  'poly:pri(uid.proofRequests.subscribe)': [RequestProofingSubscribe, boolean, ProofingRequest[]];
  'poly:pri(uid.proofRequests.approve)': [RequestPolyApproveProof, boolean];
  'poly:pri(uid.proofRequests.reject)': [RequestPolyRejectProof, boolean];

  'poly:pub(uid.provide)': [RequestPolyProvideUid, boolean];
  'poly:pri(uid.provideRequests.subscribe)': [RequestPolyProvideUidSubscribe, boolean, ProvideUidRequest[]];
  'poly:pri(uid.provideRequests.approve)': [RequestPolyProvideUidApprove, boolean];
  'poly:pri(uid.provideRequests.reject)': [RequestPolyProvideUidReject, boolean];
  'poly:pri(uid.changePass)': [RequestPolyChangePass, boolean];
  'poly:pri(global.changePass)': [RequestPolyGlobalChangePass, boolean];
  /*
    this is an inelegant yet effective way to take over these couple requests from Polkadot handlers,
    in order to alter their behavior as needed.
  */
  // Re-order accounts list to bring the selected account, first.
  'pub(accounts.list)': [RequestAccountList, InjectedAccount[]];
  'pub(accounts.subscribe)': [RequestAccountSubscribe, boolean, InjectedAccount[]];
  // Disable metadata requests.
  'pub(metadata.list)': [null, InjectedMetadataKnown[]];
  'pub(metadata.provide)': [MetadataDef, boolean];
}

declare type IsNull<T, K extends keyof T> = {
  [K1 in Exclude<keyof T, K>]: T[K1];
} & T[K] extends null ? K : never;
declare type NullKeys<T> = {
  [K in keyof T]: IsNull<T, K>;
}[keyof T];
declare type NoUndefinedValues<T> = {
  [K in KeysWithDefinedValues<T>]: T[K];
};
declare type KeysWithDefinedValues<T> = {
  [K in keyof T]: T[K] extends undefined ? never : K;
}[keyof T];
export declare type PolyMessageTypes = keyof PolyRequestSignatures;
export declare type PolyRequestTypes = {
  [MessageType in keyof PolyRequestSignatures]: PolyRequestSignatures[MessageType][0];
};
export declare type PolySubscriptionMessageTypes = NoUndefinedValues<{
  [MessageType in keyof PolyRequestSignatures]: PolyRequestSignatures[MessageType][2];
}>;
export declare type PolyMessageTypesWithNullRequest = NullKeys<PolyRequestTypes>;
export declare type PolyMessageTypesWithSubscriptions = keyof PolySubscriptionMessageTypes;
export declare type PolyMessageTypesWithNoSubscriptions = Exclude<PolyMessageTypes, keyof PolySubscriptionMessageTypes>;
export declare type PolyResponseTypes = {
  [MessageType in keyof PolyRequestSignatures]: PolyRequestSignatures[MessageType][1];
};
export type PolyResponseType<TMessageType extends keyof PolyRequestSignatures> = PolyRequestSignatures[TMessageType][1];
export interface PolyTransportRequestMessage<TMessageType extends PolyMessageTypes> {
  id: string;
  message: TMessageType;
  origin: 'page' | 'extension';
  request: PolyRequestTypes[TMessageType];
}

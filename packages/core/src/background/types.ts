import { AccountJson, RequestSignatures as DotRequestSignatures } from '@polkadot/extension-base/background/types';
import { FunctionMetadataLatest } from '@polkadot/types/interfaces';
import { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';
import { ORIGINS } from '@polymathnetwork/extension-core/constants';

import { IdentifiedAccount, NetworkMeta, NetworkName, NetworkState, ProofRequestPayload, RequestPolyProvideUid, StoreStatus, UidRecord } from '../types';

export enum Errors {
  NO_ACCOUNT = 'No accounts found.',
  NO_DID = 'Selected user account is not verified.',
  NO_UID = 'No uID associated with the selected account or chain.',
  DID_NOT_MATCH = 'Request does not match any existing account in the wallet.',
  INVALID_TICKER = 'Invalid ticker.',
  INVALID_UID = 'Provided uID string is not a valid v4 uuid.'
}
export interface ResponsePolyCallDetails {
  networkFee: string;
  protocolFee: string;
  method: string;
  section: string;
  meta: FunctionMetadataLatest;
  args: AnyJson;
}

export type RequestPolyAccountsSubscribe = null;

export type RequestPolyNetworkSubscribe = null;

export type RequestPolySelectedAccountSubscribe = null;

export type RequestPolyStatusSubscribe = null;

export type RequestPolyNetworkGet = null;

export type RequestPolyNetworkMetaSubscribe = null;

export type RequestSubscribeNetworkState = null;

export type RequestPolyIsDevSubscribe = null;

export type RequestProofingSubscribe = null;

export type RequestPolyProvideUidSubscribe = null;

export type RequestPolyReadUidSubscribe = null;

export type RequestPolyUidRecordsSubscribe = null;

export type RequestPolyReadUid = null;

export type RequestPolyIsUidSet = null;

export type RequestPolyIsPasswordSet = null;

export interface RequestPolyNetworkSet {
  network: NetworkName;
}

export interface RequestPolyValidatePassword {
  password: string;
}

export type RequestPolyIsDevToggle = null;

export interface RequestPolySelectedAccountSet {
  account: string;
}

export interface RequestPolyCallDetails {
  request: SignerPayloadJSON;
}

export interface RequestPolyIdentityRename {
  network: NetworkName;
  did: string;
  name: string;
}

export interface ProofingResponse {
  id: string;
  proof: string;
}

export interface ReadUidResponse {
  id: string;
  uid: string;
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

export interface ReadUidRequest {
  id: string;
  request: RequestPolyReadUid;
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

export interface RequestPolyReadUidApprove {
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

export interface RequestPolyReadUidReject {
  id: string;
}

export interface RequestPolyGetUid {
  did: string;
  password: string;
  network: NetworkName;
}

export interface PolyRequestSignatures extends DotRequestSignatures {
  // private/internal requests, i.e. from a popup
  'poly:pri(accounts.subscribe)': [RequestPolyAccountsSubscribe, boolean, IdentifiedAccount[]];
  'poly:pri(network.subscribe)': [RequestPolyNetworkSubscribe, boolean, NetworkName];
  'poly:pri(selectedAccount.subscribe)': [RequestPolySelectedAccountSubscribe, boolean, string | undefined];
  'poly:pri(status.subscribe)': [RequestPolyStatusSubscribe, boolean, StoreStatus];
  'poly:pri(network.set)': [RequestPolyNetworkSet, boolean];
  'poly:pri(isDev.toggle)': [RequestPolyIsDevToggle, boolean];
  'poly:pri(selectedAccount.set)': [RequestPolySelectedAccountSet, boolean];
  'poly:pri(callDetails.get)': [RequestPolyCallDetails, ResponsePolyCallDetails];
  'poly:pri(identity.rename)': [RequestPolyIdentityRename, boolean];
  'poly:pri(networkState.subscribe)': [RequestSubscribeNetworkState, boolean, NetworkState];
  'poly:pri(uid.proofRequests.subscribe)': [RequestProofingSubscribe, boolean, ProofingRequest[]];
  'poly:pri(uid.proofRequests.approve)': [RequestPolyApproveProof, boolean];
  'poly:pri(uid.proofRequests.reject)': [RequestPolyRejectProof, boolean];
  'poly:pri(uid.provideRequests.subscribe)': [RequestPolyProvideUidSubscribe, boolean, ProvideUidRequest[]];
  'poly:pri(uid.provideRequests.approve)': [RequestPolyProvideUidApprove, boolean];
  'poly:pri(uid.provideRequests.reject)': [RequestPolyProvideUidReject, boolean];
  'poly:pri(uid.readRequests.subscribe)': [RequestPolyReadUidSubscribe, boolean, ReadUidRequest[]];
  'poly:pri(uid.readRequests.approve)': [RequestPolyReadUidApprove, boolean];
  'poly:pri(uid.readRequests.reject)': [RequestPolyReadUidReject, boolean];
  'poly:pri(uid.changePass)': [RequestPolyChangePass, boolean];
  'poly:pri(uid.records.subscribe)': [RequestPolyUidRecordsSubscribe, boolean, UidRecord[]];
  'poly:pri(uid.getUid)': [RequestPolyGetUid, string];
  'poly:pri(global.changePass)': [RequestPolyGlobalChangePass, boolean];
  'poly:pri(password.isSet)': [RequestPolyIsPasswordSet, boolean];
  'poly:pri(password.validate)': [RequestPolyValidatePassword, boolean];
  'poly:pri(window.open)': [AllowedPath, boolean];
  // public/external requests, i.e. from a page
  'poly:pub(network.get)': [RequestPolyNetworkGet, NetworkMeta];
  'poly:pub(network.subscribe)': [RequestPolyNetworkMetaSubscribe, boolean, NetworkMeta];
  'poly:pub(uid.requestProof)': [ProofRequestPayload, ProofingResponse];
  'poly:pub(uid.provide)': [RequestPolyProvideUid, boolean];
  'poly:pub(uid.read)': [RequestPolyReadUid, ReadUidResponse];
  'poly:pub(uid.isSet)': [RequestPolyIsUidSet, boolean];
}

declare type IsNull<T, K extends keyof T> = {
  [K1 in Exclude<keyof T, K>]: T[K1];
} &
T[K] extends null
  ? K
  : never;
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
export declare type PolySubscriptionMessageTypes = NoUndefinedValues<
{
  [MessageType in keyof PolyRequestSignatures]: PolyRequestSignatures[MessageType][2];
}
>;
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
  origin: ORIGINS.PAGE | ORIGINS.EXTENSION;
  request: PolyRequestTypes[TMessageType];
}

interface PolyTransportResponseMessageNoSub<TMessageType extends PolyMessageTypesWithNoSubscriptions> {
  error?: string;
  id: string;
  response?: PolyResponseTypes[TMessageType];
}

interface PolyTransportResponseMessageSub<TMessageType extends PolyMessageTypesWithSubscriptions> {
  error?: string;
  id: string;
  response?: PolyResponseTypes[TMessageType];
  subscription?: PolySubscriptionMessageTypes[TMessageType];
}

export type PolyTransportResponseMessage<TMessageType extends PolyMessageTypes> =
  TMessageType extends PolyMessageTypesWithNoSubscriptions
    ? PolyTransportResponseMessageNoSub<TMessageType>
    : TMessageType extends PolyMessageTypesWithSubscriptions
      ? PolyTransportResponseMessageSub<TMessageType>
      : never;

export const ALLOWED_PATH = [
  '/',
  '/account/import-ledger',
  '/account/restore/json',
  '/account/restore/seed',
  '/account/change-password',
  '/account/create'
];

export declare type AllowedPath = typeof ALLOWED_PATH[number];

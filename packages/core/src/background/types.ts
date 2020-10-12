import { IdentifiedAccount, NetworkMeta, NetworkName } from '../types';
import { SignerPayloadJSON, AnyJson } from '@polkadot/types/types';
import { FunctionMetadataLatest } from '@polkadot/types/interfaces';
import { RequestAccountList, RequestAccountSubscribe } from '@polkadot/extension-base/background/types';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import BN from 'bn.js';

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

export type RequestPolyIsReadySubscribe = null;

export type RequestPolyNetworkGet = null;

export type RequestPolyNetworkMetaSubscribe = null;

export interface RequestPolyNetworkSet {
  network: NetworkName
}

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

export interface PolyRequestSignatures {
  'poly:pri(accounts.subscribe)': [RequestPolyAccountsSubscribe, boolean, IdentifiedAccount[]];
  'poly:pri(network.subscribe)': [RequestPolyNetworkSubscribe, boolean, NetworkName];
  'poly:pri(selectedAccount.subscribe)': [RequestPolySelectedAccountSubscribe, boolean, string | undefined];
  'poly:pri(isReady.subscribe)': [RequestPolyIsReadySubscribe, boolean, boolean]
  'poly:pri(network.set)': [RequestPolyNetworkSet, boolean];
  'poly:pri(selectedAccount.set)': [RequestPolySelectedAccountSet, boolean];
  'poly:pri(callDetails.get)': [RequestPolyCallDetails, ResponsePolyCallDetails];
  'poly:pri(identity.rename)': [RequestPolyIdentityRename, boolean];
  'poly:pub(network.get)': [RequestPolyNetworkGet, NetworkMeta];
  'poly:pub(network.subscribe)': [RequestPolyNetworkMetaSubscribe, boolean, NetworkMeta];
  // @FIXME this is an inelegant way to take over these two requests from Polkadot, in order to get
  // to re-order accounts list based on account selection.
  'pub(accounts.list)': [RequestAccountList, InjectedAccount[]];
  'pub(accounts.subscribe)': [RequestAccountSubscribe, boolean, InjectedAccount[]];
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

import { RequestSignatures as DotRequestSignatures } from '@polkadot/extension-base/background/types';
import { FunctionMetadataLatest } from '@polkadot/types/interfaces';
import { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';
import { ORIGINS } from '@polymeshassociation/extension-core/constants';

import {
  IdentifiedAccount,
  NetworkMeta,
  NetworkName,
  NetworkState,
  StoreStatus,
} from '../types';

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

export type RequestPolyCustomNetworkUrlSubscribe = null;

export type RequestPolySelectedAccountSubscribe = null;

export type RequestPolyStatusSubscribe = null;

export type RequestPolyNetworkGet = null;

export type RequestPolyNetworkMetaSubscribe = null;

export type RequestSubscribeNetworkState = null;

export type RequestPolyIsDevSubscribe = null;

export type RequestPolyIsPasswordSet = null;

export interface RequestPolyNetworkSet {
  network: NetworkName;
}

export interface RequestPolyCustomNetworkUrlSet {
  customNetworkUrl: string;
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

export interface RequestPolyChangePass {
  oldPass: string;
  newPass: string;
}

export interface RequestPolyGlobalChangePass {
  oldPass: string;
  newPass: string;
}

export interface PolyRequestSignatures extends DotRequestSignatures {
  // private/internal requests, i.e. from a popup
  'poly:pri(accounts.subscribe)': [
    RequestPolyAccountsSubscribe,
    boolean,
    IdentifiedAccount[]
  ];
  'poly:pri(network.subscribe)': [
    RequestPolyNetworkSubscribe,
    boolean,
    NetworkName
  ];
  'poly:pri(customNetworkUrl.subscribe)': [
    RequestPolyCustomNetworkUrlSubscribe,
    boolean,
    string
  ];
  'poly:pri(selectedAccount.subscribe)': [
    RequestPolySelectedAccountSubscribe,
    boolean,
    string | undefined
  ];
  'poly:pri(status.subscribe)': [
    RequestPolyStatusSubscribe,
    boolean,
    StoreStatus
  ];
  'poly:pri(network.set)': [RequestPolyNetworkSet, boolean];
  'poly:pri(network.setCustomNetworkUrl)': [RequestPolyCustomNetworkUrlSet, boolean],
  'poly:pri(isDev.toggle)': [RequestPolyIsDevToggle, boolean];
  'poly:pri(selectedAccount.set)': [RequestPolySelectedAccountSet, boolean];
  'poly:pri(callDetails.get)': [
    RequestPolyCallDetails,
    ResponsePolyCallDetails
  ];
  'poly:pri(identity.rename)': [RequestPolyIdentityRename, boolean];
  'poly:pri(networkState.subscribe)': [
    RequestSubscribeNetworkState,
    boolean,
    NetworkState
  ];
  'poly:pri(global.changePass)': [RequestPolyGlobalChangePass, boolean];
  'poly:pri(password.isSet)': [RequestPolyIsPasswordSet, boolean];
  'poly:pri(password.validate)': [RequestPolyValidatePassword, boolean];
  'poly:pri(window.open)': [AllowedPath, boolean];
  // public/external requests, i.e. from a page
  'poly:pub(network.get)': [RequestPolyNetworkGet, NetworkMeta];
  'poly:pub(network.subscribe)': [
    RequestPolyNetworkMetaSubscribe,
    boolean,
    NetworkMeta
  ];
  'poly:pub(customNetworkUrl.subscribe)': [
    RequestPolyCustomNetworkUrlSubscribe,
    boolean,
    string
  ];
}

declare type IsNull<T, K extends keyof T> = {
  [K1 in Exclude<keyof T, K>]: T[K1];
} & T[K] extends null
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
export declare type PolySubscriptionMessageTypes = NoUndefinedValues<{
  [MessageType in keyof PolyRequestSignatures]: PolyRequestSignatures[MessageType][2];
}>;
export declare type PolyMessageTypesWithNullRequest =
  NullKeys<PolyRequestTypes>;
export declare type PolyMessageTypesWithSubscriptions =
  keyof PolySubscriptionMessageTypes;
export declare type PolyMessageTypesWithNoSubscriptions = Exclude<
  PolyMessageTypes,
  keyof PolySubscriptionMessageTypes
>;
export declare type PolyResponseTypes = {
  [MessageType in keyof PolyRequestSignatures]: PolyRequestSignatures[MessageType][1];
};
export type PolyResponseType<TMessageType extends keyof PolyRequestSignatures> =
  PolyRequestSignatures[TMessageType][1];
export interface PolyTransportRequestMessage<
  TMessageType extends PolyMessageTypes
> {
  id: string;
  message: TMessageType;
  origin: ORIGINS.PAGE | ORIGINS.EXTENSION;
  request: PolyRequestTypes[TMessageType];
}

interface PolyTransportResponseMessageNoSub<
  TMessageType extends PolyMessageTypesWithNoSubscriptions
> {
  error?: string;
  id: string;
  response?: PolyResponseTypes[TMessageType];
}

interface PolyTransportResponseMessageSub<
  TMessageType extends PolyMessageTypesWithSubscriptions
> {
  error?: string;
  id: string;
  response?: PolyResponseTypes[TMessageType];
  subscription?: PolySubscriptionMessageTypes[TMessageType];
}

export type PolyTransportResponseMessage<
  TMessageType extends PolyMessageTypes
> = TMessageType extends PolyMessageTypesWithNoSubscriptions
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
  '/account/create',
];

export declare type AllowedPath = typeof ALLOWED_PATH[number];

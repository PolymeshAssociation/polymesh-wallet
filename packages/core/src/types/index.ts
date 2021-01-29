import { Unsubcall } from '@polkadot/extension-inject/types';
import { Call } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';

export enum DidType {
  primary = 'primary',
  secondary = 'secondary'
}

export type AccountData = {
  address: string;
  didType?: DidType;
  balance?: string;
  name?: string;
}

export type IdentityData = {
  cdd?: CDD;
  uid?: UID;
  did: string;
  priKey: string;
  secKeys?: string[];
  alias?: string;
}

export type IdentifiedAccount = {
  name?: string;
  did?: string;
  keyType?: DidType;
  cdd?: CDD;
  uid?: UID;
  address: string;
  didType?: DidType;
  didAlias: string;
  balance?: string;
}

export type UnsubCallback = () => void;

export type ReversedDidList =
  Record<string, {did: string, keyType: DidType, cdd?: CDD, didAlias: string}>;

export enum NetworkName {
  pmf = 'pmf',
  alcyone = 'alcyone',
  pme = 'pme'
}

export enum LinkName {
  dashboard = 'dashboard',
  explorer = 'explorer'
}

export type CDD = null | {
  issuer: string,
  expiry?: number
}

export type UID = Uint8Array;

export type NetworkMeta = {
  name: NetworkName,
  label?: string,
  wssUrl: string
}

export interface InjectedNetwork {
  get: () => Promise<NetworkMeta>;
  subscribe: (cb: (network: NetworkMeta) => void) => Unsubcall;
}

export interface ProofRequestPayload {
  /**
   * @description The ticker
   */
  ticker: string;
}

export interface RequestPolyProvideUid {
  did: string;
  uid: string;
  network: NetworkName
}

export interface ProofResult {
  /**
   * @description The id for this request
   */
  id: number;
  /**
   * @description The resulting proof string
   */
  proof: string;
}

export interface InjectedUid {
  requestProof: (req: ProofRequestPayload) => Promise<ProofResult>;
  provide: (req: RequestPolyProvideUid) => Promise<boolean>;
}

export type KeyringAccountData = {
  address: string,
  name?: string,
}

export interface Decoded {
  args: AnyJson;
  method: Call;
}

export enum ErrorCodes {
  FatalError = 'Fatal Error',
  NonFatalError = 'Non-fatal Error',
  Offline = 'Offline'
}

export type Error = {
  code: ErrorCodes,
  msg: string
}

export type StoreStatus = {
  rehydrated: boolean,
  error: Error | null,
  ready: boolean
};

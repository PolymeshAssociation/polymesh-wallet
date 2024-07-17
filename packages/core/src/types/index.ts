import type { Unsubcall } from '@polkadot/extension-inject/types';
import type { Call } from '@polkadot/types/interfaces';
import type { AnyJson } from '@polkadot/types/types';

export enum DidType {
  primary = 'primary',
  secondary = 'secondary',
  multisig = 'multisig'
}

export interface AccountBalances {
  total: string;
  transferrable: string;
  locked: string;
}

export interface AccountData {
  address: string;
  didType?: DidType;
  name?: string;
  balance?: AccountBalances;
}

export interface IdentityData {
  cdd?: CDD;
  did: string;
  priKey: string;
  secKeys?: string[];
  msKeys?: string[];
  alias?: string;
}

export interface IdentifiedAccount {
  name?: string;
  did?: string;
  keyType?: DidType;
  cdd?: CDD;
  address: string;
  didType?: DidType;
  didAlias?: string;
  balance?: {
    total: string;
    transferrable: string;
    locked: string;
  };
}

export type UnsubCallback = () => void;

export type ReversedDidList = Record<
string,
{ did: string; keyType: DidType; cdd?: CDD; didAlias: string }
>;

export enum NetworkName {
  mainnet = 'mainnet',
  testnet = 'testnet',
  staging = 'staging',
  local = 'local',
  custom = 'custom'
}

export enum LinkName {
  dashboard = 'dashboard',
  explorer = 'explorer',
}

export type CDD = null | {
  issuer: string;
  expiry?: number;
};

export interface NetworkState {
  selected: NetworkName;
  ss58Format: number;
  isDeveloper: boolean;
  customNetworkUrl: string;
}

export interface NetworkMeta {
  name: NetworkName;
  label?: string;
  wssUrl: string;
}

export interface InjectedNetwork {
  get: () => Promise<NetworkMeta>;
  subscribe: (cb: (network: NetworkMeta) => void) => Unsubcall;
}

export interface KeyringAccountData {
  address: string;
  name?: string;
}

export interface Decoded {
  args: AnyJson;
  method: Call;
}

export enum ErrorCodes {
  FatalError = 'Fatal Error',
  NonFatalError = 'Non-fatal Error',
  Offline = 'Offline',
}

export interface Error {
  code: ErrorCodes;
  msg: string;
}

export interface StoreStatus {
  error: Error | null;
  apiStatus: 'ready' | 'connecting' | 'error';
  populated: Record<string, boolean>;
}

import { Unsubcall } from '@polkadot/extension-inject/types';
import { Call } from '@polkadot/types/interfaces';
import {
  AnyJson,
  DefinitionRpc,
  DefinitionRpcSub,
  RegistryTypes,
} from '@polkadot/types/types';

export enum DidType {
  primary = 'primary',
  secondary = 'secondary',
  multisig = 'multisig'
}

export type AccountBalances = {
  total: string;
  transferrable: string;
  locked: string;
};

export type AccountData = {
  address: string;
  didType?: DidType;
  name?: string;
  balance?: AccountBalances;
};

export type IdentityData = {
  cdd?: CDD;
  did: string;
  priKey: string;
  secKeys?: string[];
  msKeys?: string[];
  alias?: string;
};

export type IdentifiedAccount = {
  name?: string;
  did?: string;
  keyType?: DidType;
  cdd?: CDD;
  address: string;
  didType?: DidType;
  didAlias: string;
  balance?: {
    total: string;
    transferrable: string;
    locked: string;
  };
};

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
}

export enum LinkName {
  dashboard = 'dashboard',
  explorer = 'explorer',
}

export type CDD = null | {
  issuer: string;
  expiry?: number;
};

export type NetworkState = {
  selected: NetworkName;
  ss58Format: number;
  isDeveloper: boolean;
};

export type NetworkMeta = {
  name: NetworkName;
  label?: string;
  wssUrl: string;
};

export interface InjectedNetwork {
  get: () => Promise<NetworkMeta>;
  subscribe: (cb: (network: NetworkMeta) => void) => Unsubcall;
}

export type KeyringAccountData = {
  address: string;
  name?: string;
};

export interface Decoded {
  args: AnyJson;
  method: Call;
}

export enum ErrorCodes {
  FatalError = 'Fatal Error',
  NonFatalError = 'Non-fatal Error',
  Offline = 'Offline',
}

export type Error = {
  code: ErrorCodes;
  msg: string;
};

export type StoreStatus = {
  error: Error | null;
  apiStatus: 'ready' | 'connecting' | 'error';
  populated: Record<string, boolean>;
};

export type Schema = {
  rpc: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>;
  types: RegistryTypes;
};

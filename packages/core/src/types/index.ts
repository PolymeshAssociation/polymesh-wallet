import { Unsubcall } from '@polkadot/extension-inject/types';
import { Call } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';

import { RequestPolyReadUid } from '../background/types';

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
  uid?: UID;
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
  uid?: UID;
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

export type UID = Uint8Array;

export type NetworkState = {
  selected: NetworkName;
  ss58Format: number;
  isDeveloper: boolean;
  customNetworkUrl: string;
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

export interface ProofRequestPayload {
  /**
   * @description The ticker
   */
  ticker: string;
}

export interface RequestPolyProvideUid {
  did: string;
  uid: string;
  network: NetworkName;
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

export interface ReadUidResult {
  id: number;
  uid: string;
}

export interface InjectedUid {
  requestProof: (req: ProofRequestPayload) => Promise<ProofResult>;
  provide: (req: RequestPolyProvideUid) => Promise<boolean>;
  read: (req: RequestPolyReadUid) => Promise<ReadUidResult>;
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

export interface UidRecord {
  network: NetworkName;
  did: string;
}

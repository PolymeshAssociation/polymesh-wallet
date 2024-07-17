import type { LinkName, NetworkState } from './types';

import { NetworkName } from './types';

export const networkURLs: Record<NetworkName, string> = {
  custom: '',
  local: 'ws://localhost:9944/',
  mainnet: 'wss://mainnet-rpc.polymesh.network/',
  staging: 'wss://staging-rpc.polymesh.dev/',
  testnet: 'wss://testnet-rpc.polymesh.live/'
};

export const networkLabels: Record<NetworkName, string> = {
  custom: 'Custom',
  local: 'Local node',
  mainnet: 'Mainnet',
  staging: 'Staging',
  testnet: 'Testnet'
};

export const networkIsDev: Record<NetworkName, boolean> = {
  custom: true,
  local: true,
  mainnet: false,
  staging: true,
  testnet: false
};

export const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
  custom: {
    dashboard: 'https://portal.polymesh.live/',
    explorer: ''
  },
  local: {
    dashboard: 'http://localhost:3000/',
    explorer: ''
  },
  mainnet: {
    dashboard: 'https://portal.polymesh.network/',
    explorer: 'https://polymesh.subscan.io/'
  },
  staging: {
    dashboard: 'https://portal.polymesh.dev/',
    explorer: 'https://staging-app.polymesh.dev/#/explorer'
  },
  testnet: {
    dashboard: 'https://portal.polymesh.live/',
    explorer: 'https://polymesh-testnet.subscan.io/'
  }
};

export const defaultNetwork: NetworkName = NetworkName.mainnet;

export const messagePrefix = 'poly:';

export const testnetGenesisHash =
  '0x2ace05e703aa50b48c0ccccfc8b424f7aab9a1e2c424ed12e45d20b1e8ffd0d6';

export const messages = [
  'pub(accounts.list)',
  'pub(accounts.subscribe)',
  'pub(metadata.provide)',
  'pub(metadata.list)'
];

export const populatedDelay = 1000;

export const apiConnTimeout = 3500;

export const defaultSs58Format = 42;

export const defaultNetworkState: NetworkState = {
  customNetworkUrl: '',
  isDeveloper: false,
  selected: defaultNetwork,
  ss58Format: defaultSs58Format
};

import { LinkName, NetworkName, NetworkState } from './types';

export const networkURLs: Record<NetworkName, string> = {
  mainnet: 'wss://mainnet-rpc.polymesh.network',
  testnet: 'wss://testnet-rpc.polymesh.live',
  staging: 'wss://staging-rpc.polymesh.live',
  local: 'ws://localhost:9944',
};

export const networkLabels: Record<NetworkName, string> = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  staging: 'Staging',
  local: 'Local node',
};

export const networkIsDev: Record<NetworkName, boolean> = {
  mainnet: false,
  testnet: false,
  staging: true,
  local: true,
};

export const dynamicSchemaEnabled: Record<NetworkName, boolean> = {
  mainnet: true,
  testnet: true,
  staging: true,
  local: false,
};

export const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
  mainnet: {
    dashboard: 'https://portal.polymesh.network/',
    explorer: 'https://polymesh.subscan.io/',
  },
  testnet: {
    dashboard: 'https://portal.polymesh.live/',
    explorer: 'https://polymesh-testnet.subscan.io/',
  },
  staging: {
    dashboard: 'https://portal.polymesh.dev/',
    explorer: 'https://staging-app.polymesh.dev/#/explorer',
  },
  local: {
    dashboard: 'http://localhost:3000/',
    explorer: '',
  },
};

export const defaultNetwork: NetworkName = NetworkName.mainnet;

export const messagePrefix = 'poly:';

export const testnetGenesisHash =
  '0x2ace05e703aa50b48c0ccccfc8b424f7aab9a1e2c424ed12e45d20b1e8ffd0d6';

export const messages = [
  'pub(accounts.list)',
  'pub(accounts.subscribe)',
  'pub(metadata.provide)',
  'pub(metadata.list)',
];

export const polySchemaUrl = 'https://schema.polymesh.live/';

export const populatedDelay = 1000;

export const apiConnTimeout = 3500;

export const defaultSs58Format = 42;

export const defaultNetworkState: NetworkState = {
  selected: defaultNetwork,
  ss58Format: defaultSs58Format,
  isDeveloper: false,
};

export const uidProvidersWhitelist = [
  'https://testnet-onboarding.polymesh.network',
  'https://onboarding.polymesh.network',
  'http://localhost:3000',
];

export const uidReadersWhitelist = [
  'http://localhost:3000',
  'https://polymathnetwork.github.io/mock-uid-provider',
];

export const PORTS = {
  EXTENSION: 'polywallet_extension',
  CONTENT: 'polywallet_content',
};

export enum ORIGINS {
  EXTENSION = 'polywallet_extension',
  PAGE = 'polywallet_page',
}

export const PASSWORD_EXPIRY_MIN = 15;

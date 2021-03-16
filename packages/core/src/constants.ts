import { LinkName, NetworkName } from './types';

export const networkURLs: Record<NetworkName, string> = {
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network',
  pme: 'wss://pme.polymath.network',
  local: 'ws://localhost:9944'
};

export const networkLabels: Record<NetworkName, string> = {
  alcyone: 'Alcyone Testnet',
  pmf: 'PMF',
  pme: 'PME',
  local: 'Local node'
};

export const networkIsDev: Record<NetworkName, boolean> = {
  alcyone: false,
  pmf: true,
  pme: true,
  local: true
};

export const dynamicSchemaEnabled: Record <NetworkName, boolean> = {
  alcyone: true,
  pmf: true,
  pme: true,
  local: false
};

export const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
  alcyone: {
    dashboard: 'http://dashboard.polymesh.live/',
    explorer: 'http://18.223.97.65/'
  },
  pmf: {
    dashboard: 'https://polymesh-dashboard-beta.herokuapp.com/',
    explorer: 'http://18.224.67.149/'
  },
  pme: {
    dashboard: 'https://polymesh-dashboard-dev.herokuapp.com/',
    explorer: 'http://ec2-3-15-5-195.us-east-2.compute.amazonaws.com'
  },
  local: {
    dashboard: 'unknown',
    explorer: 'unknown'
  }
};

export const defaultNetwork: NetworkName = NetworkName.alcyone;

export const messagePrefix = 'poly:';

// @TODO switch to mainnet hash when launched.
// Alcyone genesis hash.
export const genesisHash = '0x12fddc9e2128b3fe571e4e5427addcb87fcaf08493867a68dd6ae44b406b39c7';

export const messages = [
  'pub(accounts.list)',
  'pub(accounts.subscribe)',
  'pub(metadata.provide)',
  'pub(metadata.list)'
];

export const polySchemaUrl = 'https://schema.polymesh.live/';

export const populatedDelay = 1000;

export const apiConnTimeout = 3500;

export const uidProvidersWhitelist = [
  'https://polymathnetwork.github.io/mock-uid-provider',
  'https://itn-polymesh.fractal.id/'
];

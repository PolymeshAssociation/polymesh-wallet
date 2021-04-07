import { LinkName, NetworkName, NetworkState } from './types';

export const networkURLs: Record<NetworkName, string> = {
  itn: 'wss://itn-rpc.polymesh.live',
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network',
  pme: 'wss://pme.polymath.network',
  local: 'ws://localhost:9944'
};

export const networkLabels: Record<NetworkName, string> = {
  alcyone: 'Alcyone Testnet',
  pmf: 'PMF',
  pme: 'PME',
  itn: 'PMI',
  local: 'Local node'
};

export const networkIsDev: Record<NetworkName, boolean> = {
  alcyone: false,
  pmf: true,
  pme: true,
  local: true,
  itn: true
};

export const dynamicSchemaEnabled: Record <NetworkName, boolean> = {
  alcyone: true,
  pmf: true,
  pme: true,
  local: false,
  itn: false
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
  },
  itn: {
    dashboard: 'unknown',
    explorer: 'https://itn-app.polymesh.live/#/explorer'
  }
};

export const defaultNetwork: NetworkName = NetworkName.alcyone;

export const messagePrefix = 'poly:';

// @TODO switch to ITN hash when launched
// 0x9deeb940c92ae02111c3bd5baca89970384f4c9849f02a1b2e53e66414d30f9f

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

export const defaultSs58Format = 42;

export const defaultNetworkState: NetworkState = {
  selected: defaultNetwork,
  ss58Format: defaultSs58Format,
  isDeveloper: false
};

export const uidProvidersWhitelist = [
  'https://polymathnetwork.github.io',
  'https://itn-polymesh.fractal.id',
  'https://staging.itn-polymesh.fractal.id'
];

export const PORTS = {
  EXTENSION: 'polywallet_extension',
  CONTENT: 'polywallet_content'
};

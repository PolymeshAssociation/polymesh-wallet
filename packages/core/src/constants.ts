import { LinkName, NetworkName, NetworkState } from './types';

export const networkURLs: Record<NetworkName, string> = {
  itn: 'wss://itn-rpc.polymesh.live',
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network',
  pme: 'wss://pme.polymath.network',
  local: 'ws://localhost:9944'
};

export const networkLabels: Record<NetworkName, string> = {
  itn: 'ITN',
  alcyone: 'Alcyone Testnet',
  pmf: 'Staging',
  pme: 'Tooling',
  local: 'Local node'
};

export const networkIsDev: Record<NetworkName, boolean> = {
  alcyone: false,
  pmf: true,
  pme: true,
  local: true,
  itn: false
};

export const dynamicSchemaEnabled: Record <NetworkName, boolean> = {
  alcyone: true,
  pmf: true,
  pme: true,
  local: false,
  itn: true
};

export const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
  alcyone: {
    dashboard: 'https://alcyone-dashboard.polymesh.live/',
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
    dashboard: 'https://itn-dashboard.polymesh.live/',
    explorer: 'https://itn-app.polymesh.live/#/explorer'
  }
};

export const defaultNetwork: NetworkName = NetworkName.itn;

export const messagePrefix = 'poly:';

// ITN genesis hash.
export const genesisHash = '0x9deeb940c92ae02111c3bd5baca89970384f4c9849f02a1b2e53e66414d30f9f';

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
  'https://staging.itn-polymesh.fractal.id',
  'https://alcyone-tokenstudio.polymesh.live',
  'https://alcyone-dashboard.polymesh.live',
  'https://itn-onboarding.polymesh.live',
  'http://localhost:3000'
];

export const uidReadersWhitelist = [
  'http://localhost:3000',
  'https://polymathnetwork.github.io/mock-uid-provider'
];

export const PORTS = {
  EXTENSION: 'polywallet_extension',
  CONTENT: 'polywallet_content'
};

export enum ORIGINS {
  EXTENSION = 'polywallet_extension',
  PAGE = 'polywallet_page'
}

export const PASSWORD_EXPIRY_MIN = 15;

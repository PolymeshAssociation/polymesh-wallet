import { LinkName, NetworkName, NetworkState } from './types';

export const networkURLs: Record<NetworkName, string> = {
  itn: 'wss://itn-rpc.polymesh.live',
  // alcyone: 'wss://alcyone-rpc.polymesh.live',
  testnet: 'wss://testnet-rpc.polymesh.live/',
  pmf: 'wss://pmf.polymath.network',
  pme: 'wss://pme.polymath.network',
  local: 'ws://localhost:9944'
};

export const networkLabels: Record<NetworkName, string> = {
  itn: 'ITN',
  testnet: 'Testnet',
  // alcyone: 'Alcyone Testnet',
  pmf: 'Staging',
  pme: 'Tooling',
  local: 'Local node'
};

export const networkIsDev: Record<NetworkName, boolean> = {
  itn: false,
  // alcyone: false,
  testnet: false,
  pmf: true,
  pme: true,
  local: true
};

export const dynamicSchemaEnabled: Record<NetworkName, boolean> = {
  itn: true,
  // alcyone: true,
  testnet: true,
  pmf: true,
  pme: true,
  local: false
};

export const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
  itn: {
    dashboard: 'https://itn-dashboard.polymesh.live/',
    explorer: 'https://itn-app.polymesh.live/#/explorer'
  },
  // alcyone: {
  //   dashboard: 'https://alcyone-dashboard.polymesh.live/',
  //   explorer: 'http://18.223.97.65/'
  // },
  testnet: {
    dashboard: 'https://testnet-dashboard.polymath.network/',
    explorer: 'https://polymesh-testnet.subscan.io/'
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

export const uidReadersWhitelist = ['http://localhost:3000', 'https://polymathnetwork.github.io/mock-uid-provider'];

export const PORTS = {
  EXTENSION: 'polywallet_extension',
  CONTENT: 'polywallet_content'
};

export enum ORIGINS {
  EXTENSION = 'polywallet_extension',
  PAGE = 'polywallet_page'
}

export const PASSWORD_EXPIRY_MIN = 15;

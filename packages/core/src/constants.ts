import { LinkName, NetworkName } from './types';

const networkURLs: Record<NetworkName, string> = {
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network',
  pme: 'wss://pme.polymath.network',
  local: 'ws://localhost:9944'
};

const networkLabels: Record<NetworkName, string> = {
  alcyone: 'Alcyone Testnet',
  pmf: 'PMF',
  pme: 'PME',
  local: 'Local node'
};

const networkIsDev: Record<NetworkName, boolean> = {
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

const networkLinks: Record<NetworkName, Record<LinkName, string>> = {
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

const defaultNetwork: NetworkName = NetworkName.alcyone;

const messagePrefix = 'poly:';

const messages = [
  'pub(accounts.list)',
  'pub(accounts.subscribe)',
  'pub(metadata.provide)',
  'pub(metadata.list)'
];

export const polySchemaUrl = 'https://schema.polymesh.live/';

export const populatedDelay = 1000;

export const uidProvidersWhitelist = [
  'https://polymathnetwork.github.io/mock-uid-provider',
  'https://itn-polymesh.fractal.id/'
];

export {
  networkURLs,
  networkLabels,
  networkLinks,
  defaultNetwork,
  messagePrefix,
  networkIsDev,
  messages
};

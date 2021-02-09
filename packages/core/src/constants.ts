import { LinkName, NetworkName } from './types';

export const networkURLs: Record<NetworkName, string> = {
  alcyone: 'wss://alcyone-rpc.polymesh.live',
  pmf: 'wss://pmf.polymath.network',
  pme: 'wss://pme.polymath.network'
};

export const networkLabels: Record<NetworkName, string> = {
  alcyone: 'Alcyone Testnet',
  pmf: 'PMF',
  pme: 'PME'
};

export const networkIsDev: Record<NetworkName, boolean> = {
  alcyone: false,
  pmf: true,
  pme: true
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

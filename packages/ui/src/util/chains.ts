import type { Network } from '@polkadot/networks/types';

import { allNetworks as polkadotNetworks } from '@polkadot/networks';

import { NetworkName } from '@polymeshassociation/extension-core/types';

const testnetTmp: Network = {
  decimals: [6],
  displayName: 'Polymesh',
  genesisHash: [],
  hasLedgerSupport: true,
  icon: 'substrate',
  isIgnored: false,
  isTestnet: true,
  network: 'polymesh',
  prefix: 12,
  slip44: 0x00000253,
  standardAccount: '*25519',
  symbols: ['POLYX'],
  website: 'https://polymesh.network/'
};

const polyGenesisHashes = [
  // Mainnet
  { displayName: 'Polymesh - Mainnet',
    genesisHash: [
      '0x6fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063'
    ],
    networkName: NetworkName.mainnet },
  // Testnet
  {
    displayName: 'Polymesh - Testnet',
    genesisHash: [
      '0x2ace05e703aa50b48c0ccccfc8b424f7aab9a1e2c424ed12e45d20b1e8ffd0d6'
    ],
    networkName: NetworkName.testnet
  }
];

const polymeshNetworks = polyGenesisHashes
  // Do not override a chain if it's already in the Polkadot list
  .filter(
    (chain) =>
      !polkadotNetworks.some(
        (network) => network.genesisHash[0] === chain.genesisHash[0]
      )
  )
  // Fill chain template with chain details from polyGenesisHashes
  .map((testnet) => ({ ...testnetTmp, ...testnet } as Network));

// Append Polymesh chains to the list
export const chains = polkadotNetworks.concat(polymeshNetworks);

export const ledgerChains = chains.filter(
  (network) => network.hasLedgerSupport
);

export function genesisToNetworkName (genesis: string): NetworkName | undefined {
  return polyGenesisHashes.find(({ genesisHash }) => genesisHash[0] === genesis)
    ?.networkName;
}

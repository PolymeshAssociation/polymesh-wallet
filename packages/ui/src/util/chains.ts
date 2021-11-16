import polkadotNetworks from '@polkadot/networks';
import { Network } from '@polkadot/networks/types';
import { NetworkName } from '@polymathnetwork/extension-core/types';

const testnetTmp: Network = {
  decimals: [6],
  displayName: 'Polymesh',
  genesisHash: [],
  hasLedgerSupport: true,
  network: 'polymesh',
  prefix: 12,
  slip44: 0x00000253,
  standardAccount: '*25519',
  symbols: ['POLYX'],
  website: 'https://polymath.network/',
  icon: 'substrate',
  isIgnored: false,
};

const polyGenesisHashes = [
  // Mainnet
  {
    genesisHash: [
      '0x6fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063',
    ],
    displayName: 'Polymesh - Mainnet',
    networkName: NetworkName.mainnet,
  },
  // Testnet
  {
    genesisHash: [
      '0x2ace05e703aa50b48c0ccccfc8b424f7aab9a1e2c424ed12e45d20b1e8ffd0d6',
    ],
    displayName: 'Polymesh - Testnet',
    networkName: NetworkName.testnet,
  },
  // Tooling
  {
    genesisHash: [
      '0x56fb854a431370af86de89a0003ca3eb500066ee66eb01a92810369b3dc435c3',
    ],
    displayName: 'Polymesh - Tooling testnet',
    networkName: NetworkName.pme,
  },
  // Staging
  {
    genesisHash: [
      '0xdeaafc11dcd5f779321e493b2a3f16ebee3725ffd398c0cb908e4b86e1b16245',
    ],
    displayName: 'Polymesh - Staging testnet',
    networkName: NetworkName.pmf,
  },
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

export function genesisToNetworkName(genesis: string): NetworkName | undefined {
  return polyGenesisHashes.find(({ genesisHash }) => genesisHash[0] === genesis)
    ?.networkName;
}

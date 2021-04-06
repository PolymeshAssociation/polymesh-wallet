import polkadotNetworks from '@polkadot/networks';
import { Network } from '@polkadot/networks/types';

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
  icon: 'substrate'
};

const testnets = [
  // PME
  {
    genesisHash: ['0x56fb854a431370af86de89a0003ca3eb500066ee66eb01a92810369b3dc435c3'],
    displayName: 'Polymesh - Development testnet'
  },
  // PMF
  {
    genesisHash: ['0xdeaafc11dcd5f779321e493b2a3f16ebee3725ffd398c0cb908e4b86e1b16245'],
    displayName: 'Polymesh - Staging testnet'
  }
];

// Append Polymesh testnets to the list
const networks = polkadotNetworks.concat(testnets.map((testnet) =>
  ({ ...testnetTmp, ...testnet } as Network)));

export default networks.filter((network) => network.hasLedgerSupport);

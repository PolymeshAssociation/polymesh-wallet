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
  icon: 'substrate',
  isIgnored: false
};

const polyGenesisHashes = [
  // ITN
  {
    genesisHash: ['0x9deeb940c92ae02111c3bd5baca89970384f4c9849f02a1b2e53e66414d30f9f'],
    displayName: 'Polymesh - ITN'
  },
  // Alcyone
  {
    genesisHash: ['0x12fddc9e2128b3fe571e4e5427addcb87fcaf08493867a68dd6ae44b406b39c7'],
    displayName: 'Polymesh - Development testnet'
  },
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

const polymeshNetworks = polyGenesisHashes
  // Do not override a chain if it's already in the Polkadot list
  .filter((chain) => !polkadotNetworks.some((network) => network.genesisHash[0] === chain.genesisHash[0]))
  // Fill chain template with chain details from polyGenesisHashes
  .map((testnet) => ({ ...testnetTmp, ...testnet } as Network));

// Append Polymesh chains to the list
const networks = polkadotNetworks.concat(polymeshNetworks);

export default networks.filter((network) => network.hasLedgerSupport);

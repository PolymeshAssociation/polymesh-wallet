import networks from '@polkadot/networks';

export default networks.filter((network) => network.hasLedgerSupport);

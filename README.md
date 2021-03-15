# Polymesh Wallet

A simple browser extension that facilitates managing your Polymesh accounts outside of dapps. Injects the accounts and allows signing transactions for a specific account.

With the Polymesh Wallet, you can: 
- Create and manage your keys, including organizing them by Polymesh ID, designating signing keys, and more. 
- Control transfers of POLYX and digital assets to and from your accounts to other accounts Securely sign transactions
- View and monitor the POLYX balance on each key.
- Select a chain to connect to such as Polymesh development networks, incentivized testnet, or the eventual mainnet.
- Connect to the Polymesh Dashboard and other Polymesh distributed apps (dApps) for enhanced benefits

## Architecture

For the time being, the extension wraps and extends [Polkadot{.js} extension](https://github.com/polkadot-js/extension). For instance, the extension would retrieves data from Polymesh chain in order enrich account metadata with user's balance, identity and KYC status.

Most notably, the extension establishes a connection to a chain via Polkadot.js [ApiPromise](https://github.com/polkadot-js/api). The connection is used to retrieve user accounts PolyX balance, Polymesh ID and CDD status. Fetched data stored in Redux and then serialized and stored in browser's localStorage.

Additionally, the wallet enables importing user's confidential identity from KYC providers, and then encrypts it with AES and stores in local storage. User must provide a password to decrypt the confidential identity for purpose of viewing, or to generate a uniqueness proof. 

## Installation

- On Chrome, install via [Chrome web store](https://chrome.google.com/webstore/detail/polymesh-wallet/jojhfeoedkpkglbfimdfabpdfjaoolaf).

## From source

Steps to build the extension and view your changes in a browser:

1. Clone repository `git clone git@github.com:PolymathNetwork/polymesh-wallet.git`
1. Build via `yarn build` or `yarn watch`
2. Install the extension
  - Chrome:
    - go to `chrome://extensions/`
    - ensure you have the Development flag set
    - "Load unpacked" and point to `packages/extension/build`
    - if developing, after making changes - refresh the extension

## Development

The repo is split into a number of packages -

- [extension](packages/extension/) - The main entry point that glues everything else together.
- [extension-ui](packages/ui/) - The UI components for the extension, to build up the popup.
- [extension-dapp](packages/core/) - Request handlers, API maintenance and chain data syncing and caching.

## Dapp developers

The extension is compatible with the convenience @polkadot/extension-dapp wrappers. They allows for any dapps to access the injected extension object for purpose of signing, amongst other things.

Besides the [API interface](https://github.com/polkadot-js/extension) of Polkadot.js extension that we inherit and the re-provide, Polymesh extension provides the few additional APIs highlighted below.

## API interface

```js
enum NetworkName {
  pmf = 'pmf',
  alcyone = 'alcyone',
  pme = 'pme',
  local = 'local'
}

type NetworkMeta = {
  name: NetworkName,
  label?: string,
  wssUrl: string
}

// An interface providing a confidential ID or requesting a uniqueness proof.
interface InjectedUid {
  requestProof: (req: ProofRequestPayload) => Promise<ProofResult>;
  provide: (req: RequestPolyProvideUid) => Promise<boolean>;
}

// An interface that exposes the currently selected network
interface InjectedNetwork {
  get: () => Promise<NetworkMeta>;
  subscribe: (cb: (network: NetworkMeta) => void) => Unsubcall;
}

interface PolymeshInjected extends Injected {
  readonly uid: InjectedUid;
  readonly network: InjectedNetwork;
}
```

### Examples

From a dapp, you can access the injected object in order to tap into additional APIs.

```js
web3Enable('A dapp').then((exts) => {
  // From the possibly multiple injected objects (eg if Polkadot.js extension is installed as well),
  // select Polymesh injected objects.
  const wallet = exts.filter(ext => ext.name === 'polywallet')[0]
  if (!wallet) {
    setError(new Error(`Please install Polymesh wallet extension from Chrome store`));
    return;
  }
```

Get or subscribe to the selected network

```js
wallet.network.get().then((network: NetworkMeta) => {
  // do something
});

wallet.network.subscribe((network) => {
  window.location.reload();
});
```

Provide a confidential ID or request uniqueness proof. Check out this [demo app](https://polymathnetwork.github.io/mock-uid-provider/) to learn more about utilizing uId features [code]( https://github.com/PolymathNetwork/mock-uid-provider/blob/master/src/App.tsx#L134).

```js
wallet.uid.provide({
  '8c7cfa4f-f81d-49d5-881f-g6b91cd0380f', // v4 uuid
  '0x5c62a0b1d68aa3e2026fi337b877466751c9fbe33a7723bcb779f736893f032a4',
  'alcyone'
}).then(console.log).catch(console.error);

wallet.uid.requestProof({ ticker: 'AMZN' })
  .then(console.log).catch(console.error)
```

# Directory structure

The main ingredients are all under `packages/` directory:

## extension

Glues the wallet extension together by providing Webpack config files, as well as
entry points for each [chrome extension script](https://developer.chrome.com/docs/extensions/mv2/getstarted/)

```
├── background.ts   // Entry point to background script, which is responsible for request handling and data fetching.
├── content.ts    // Script to be injected into web page.
├── creator.ts
├── extension.ts    // Pop UI
└── page.ts   // Message relayer
```

## core

Polymesh models and business logic.

```
├── background
│   ├── handlers:
│   │   ├── Extension.ts    // Handles requests from extension popup such as: account data queries, currently selected network and user, request approval or rejection...etc.
│   │   ├── Tabs.ts   // Handlers for dapp requests.
│   │   ├── index.ts
│   │   ├── subscriptions.ts
│   └── types.ts
├── constants.ts
├── external    // Data fetching data from chain
│   ├── apiPromise    // Api connection utilities
│   │   ├── index.ts
│   │   └── types.ts
│   ├── callDetails.ts
│   ├── index.ts
│   ├── polyNetworkGet.ts
│   ├── polyNetworkSubscribe.ts
├── index.ts
├── page    // API injected in browser page.
│   ├── Network.ts  // Network API methods
│   ├── index.ts
│   ├── injected.ts
│   └── types.ts
├── store   // Redux store of account transient data.
│   ├── features
│   │   ├── accounts.ts   // Accounts metadata
│   │   ├── identities.ts   // Polymesh identities associated with accounts
│   │   ├── network.ts    // The currently selected network
│   │   └── status.ts   // Application readiness and loading state
│   ├── getters.ts    // Utilities to read data from Redux store.
│   ├── index.ts
│   ├── reduxSubscribe.ts
│   ├── rootReducer.ts
│   ├── selectors.ts    // Memoised Redux selector
│   ├── setters.ts    // Redux data setters
│   ├── subscribers.ts    // Redux subscription
│   └── utils.ts
├── types
│   ├── index.ts
│   └── types.d.ts
└── utils.ts
```

## UI

React components and styles

```
├── Popup   // Higher level components
├── assets    // Static assets
├── components    // Sub-components or individual screens
├── createView.tsx
├── hooks   // Reusable React hooks
├── index.ts
├── messaging.test.ts
├── messaging.ts    // Message stubs for requests
├── styles
├── testHelpers.ts
├── types.ts
├── typings
├── ui
└── util
```

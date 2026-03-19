import type { MetadataDef } from '@polkadot/extension-inject/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { MetadataStore } from '@polkadot/extension-base/stores';
import { addMetadata } from '@polkadot/extension-chains';

import { typesBundle } from '@polymeshassociation/polymesh-types';
import polymeshSignedExtensions from '@polymeshassociation/polymesh-types/signedExtensions';

import { apiConnTimeout } from '../../constants';

let api: ApiPromise | null = null;
let provider: WsProvider;
let currentNetworkUrl: string;

const metaStore = new MetadataStore();
const metadata: Record<string, `0x${string}`> = {};
let metadataCacheInitialized = false;

// Load persisted metadata from chrome.storage into the in-memory caches.
// Called once before the first ApiPromise.create so that subsequent connections
// for the same chain/specVersion don't need to re-fetch metadata from the node.
async function initMetadataCache (): Promise<void> {
  if (metadataCacheInitialized) {
    return;
  }

  metadataCacheInitialized = true;

  await metaStore.all((_, def: MetadataDef) => {
    if (def?.rawMetadata) {
      const key = `${def.genesisHash}-${def.specVersion}`;

      metadata[key] = def.rawMetadata;
      addMetadata(def);
    }
  });
}

async function apiPromise (networkUrl: string): Promise<ApiPromise> {
  await initMetadataCache();

  const shouldReinitialize = currentNetworkUrl !== networkUrl;

  if (!shouldReinitialize && api && provider?.isConnected) {
    return api;
  }

  currentNetworkUrl = networkUrl;

  // 'false' means to not retry connection if it fails. We need to report
  // connection issues to the user instead of retrying connection for minutes.
  provider = new WsProvider(networkUrl, false);

  await provider.connect();

  let unsubscribe: () => void = () => {
    /**/
  };

  // Unfortunately, provider.connect() does NOT throw an error when connection fails,
  // so we have to handle that in the following awkward way.
  //
  // A) Wait until WS connection is successful.
  // B) A second later, if connection is not up, we throw an error.
  await new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(new Error(`Failed to connect to ${networkUrl}`));
    }, apiConnTimeout);

    unsubscribe = provider.on('connected', () => {
      clearTimeout(handle);
      resolve();
    });
  });

  unsubscribe();

  api = await ApiPromise.create({
    metadata,
    noInitWarn: true,
    provider,
    typesBundle
  });

  await api.isReadyOrError;

  const key = `${api.genesisHash.toHex()}-${api.runtimeVersion.specVersion.toString()}`;

  // Cache metadata to speed up following Api creations.
  if (!metadata[key]) {
    // Build and persist the MetadataDef so it survives extension restarts and
    // is available to pri(metadata.get) for Ledger generic app signing.
    const rawMetadata = api.runtimeMetadata.toHex();
    const def: MetadataDef = {
      chain: api.runtimeChain.toString(),
      genesisHash: api.genesisHash.toHex(),
      icon: 'substrate',
      rawMetadata,
      specVersion: api.runtimeVersion.specVersion.toNumber(),
      ss58Format: api.registry.chainSS58 ?? 42,
      tokenDecimals: api.registry.chainDecimals[0] ?? 6,
      tokenSymbol: api.registry.chainTokens[0] ?? 'POLYX',
      types: {},
      userExtensions: polymeshSignedExtensions
    };

    metadata[key] = rawMetadata;
    addMetadata(def);
    const genesisHash = api.genesisHash.toHex();

    await metaStore.set(genesisHash, def);
  }

  return api;
}

export async function disconnect (): Promise<void> {
  if (api) {
    try {
      await api.disconnect();
    } catch (error) {
      console.error(
        `Failed to close websocket connection: ${JSON.stringify(error)}`
      );
    }

    api = null;
  }
}

export default apiPromise;

import { ApiPromise, WsProvider } from '@polkadot/api';

import { networkURLs } from '../../constants';
import { NetworkName } from '../../types';
import SchemaService from '../schema';

let api: ApiPromise | null = null;

const metadata: Record<string, string> = {};

async function apiPromise (n: NetworkName): Promise<ApiPromise> {
  console.time('ApiReady');

  if (api) {
    try {
      await api.disconnect();
    } catch (error) {
      console.error(error);
    }

    api = null;
  }

  const provider = new WsProvider(networkURLs[n]);

  const { rpc, types } = SchemaService.get(n);

  api = await ApiPromise.create({
    provider,
    rpc,
    types,
    metadata
  });

  await api.isReadyOrError;

  const key = `${api.genesisHash.toHex()}-${api.runtimeVersion.specVersion.toString()}`;

  // Cache metadata to speed up following Api creations.
  metadata[key] = api.runtimeMetadata.toHex();

  console.timeEnd('ApiReady');

  return api;
}

export async function disconnect (): Promise<void> {
  if (api) {
    try {
      await api.disconnect();
    } catch (error) {
      console.error(`Failed to close websocket connection: ${JSON.stringify(error)}`);
    }

    api = null;
  }
}

export default apiPromise;

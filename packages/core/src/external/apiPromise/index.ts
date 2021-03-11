import { ApiPromise, WsProvider } from '@polkadot/api';

import { networkURLs } from '../../constants';
import { NetworkName } from '../../types';
import SchemaService from '../schema';

let api: ApiPromise | null = null;

const metadata: Record<string, string> = {};

async function apiPromise (n: NetworkName, reinitialize = true): Promise<ApiPromise> {
  console.time('ApiReady');

  if (!reinitialize && api) { return api; }

  if (api) {
    try {
      await api.disconnect();
    } catch (error) {
      console.error(error);
    }

    api = null;
  }

  // 'false' means to not retry connection if it fails. We need to report
  // connection issues to the user instead of retrying connection for minutes.
  const provider = new WsProvider(networkURLs[n], false);

  await provider.connect();

  let unsubscribe: () => void = () => {};

  // Unfortunately, provider.connect() does NOT throw an error when connection fails,
  // so we have to handle that in the following awkward way.
  //
  // A) Wait until WS connection is successful.
  // B) A second later, if connection is not up, we throw an error.
  await new Promise<void>((resolve, reject) => {
    const handle = setTimeout(() => reject(new Error(`Failed to connect to ${networkURLs[n]}`)), 2000);

    unsubscribe = provider.on('connected', () => {
      clearTimeout(handle);
      resolve();
    });
  });
  unsubscribe();

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

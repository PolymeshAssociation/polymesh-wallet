import { ApiPromise, WsProvider } from '@polkadot/api';

import { networkURLs } from '../../constants';
import { NetworkName } from '../../types';
import SchemaService from '../schema';

let api: ApiPromise | null = null;

async function apiPromise (n: NetworkName): Promise<ApiPromise> {
  console.time('isReady');

  if (api) {
    try {
      await api.disconnect();
    } catch (error) {
      console.error(error);
    }

    api = null;
  }

  const provider = new WsProvider(networkURLs[n]);

  const schema = SchemaService.get(n);

  api = await ApiPromise.create({
    provider,
    rpc: schema.rpc,
    types: schema.types
  });

  await api.isReadyOrError;

  console.timeEnd('isReady');

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

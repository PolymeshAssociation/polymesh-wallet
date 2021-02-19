import { ApiPromise, WsProvider } from '@polkadot/api';

import { networkURLs } from '../../constants';
import { NetworkName } from '../../types';
import SchemaService from './schema';

const cache = {} as Record<NetworkName, Promise<ApiPromise>>;

function apiPromise (n: NetworkName): Promise<ApiPromise> {
  if (!(n in cache)) {
    const provider = new WsProvider(networkURLs[n]);

    const schema = SchemaService.get(n);

    cache[n] = (new ApiPromise({
      provider,
      rpc: schema.rpc,
      types: schema.types
    })).isReadyOrError;
  }

  return cache[n];
}

export function destroy (n: NetworkName): void {
  if (n in cache) { delete cache[n]; }
}

export default apiPromise;

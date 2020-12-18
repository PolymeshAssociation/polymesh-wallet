import { ApiPromise, WsProvider } from '@polkadot/api';
import schema from './schema';
import { NetworkName } from '../../types';
import { networkURLs } from '../../constants';

const cache = {} as Record<NetworkName, Promise<ApiPromise>>;

function apiPromise (n: NetworkName): Promise<ApiPromise> {
  if (!(n in cache)) {
    const provider = new WsProvider(networkURLs[n]);

    cache[n] = (new ApiPromise({
      provider,
      rpc: schema[n].rpc,
      types: schema[n].types
    })).isReadyOrError;
  }

  return cache[n];
}

export function destroy (n: NetworkName): void {
  if (n in cache) { delete cache[n]; }
}

export default apiPromise;

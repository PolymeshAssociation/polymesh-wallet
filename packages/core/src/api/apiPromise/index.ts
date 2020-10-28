import { ApiPromise, WsProvider } from '@polkadot/api';
import schema from './schema';
import { NetworkName } from '../../types';
import { networkURLs } from '../../constants';

function apiPromise (n: NetworkName): Promise<ApiPromise> {
  const provider = new WsProvider(networkURLs[n]);

  return new ApiPromise({
    provider,
    rpc: schema[n].rpc,
    types: schema[n].types
  }).isReadyOrError;
}

export default apiPromise;

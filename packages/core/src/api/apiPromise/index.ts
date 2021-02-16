import { ApiPromise, WsProvider } from '@polkadot/api';

import { networkURLs } from '../../constants';
import { NetworkName } from '../../types';
import schema from './schema';

async function apiPromise (n: NetworkName): Promise<ApiPromise> {
  const provider = new WsProvider(networkURLs[n]);

  return (new ApiPromise({
    provider,
    rpc: schema[n].rpc,
    types: schema[n].types
  })).isReadyOrError;
}

export default apiPromise;

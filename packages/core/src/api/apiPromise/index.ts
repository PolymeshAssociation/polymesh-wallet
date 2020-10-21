import { ApiPromise, WsProvider } from '@polkadot/api';
import schema from './schema';
import { NetworkName } from '../../types';
import { networkURLs } from '../../constants';

const apiPromise: Record<NetworkName, Promise<ApiPromise>> =
  Object.keys(NetworkName).reduce((acc, network) => {
    const n = network as NetworkName;

    acc[n] = new ApiPromise({
      provider: new WsProvider(networkURLs[n]),
      rpc: schema[n].rpc,
      types: schema[n].types
    }).isReadyOrError;

    return acc;
  }, {} as Record<NetworkName, Promise<ApiPromise>>);

export default apiPromise;

import { ApiPromise, WsProvider } from '@polkadot/api';
import schema from './schema';
import { NetworkName } from '../../types';
import { networkURLs } from '../../constants';
import { fatalErrorHandler } from '@polymathnetwork/extension-core/utils';

const apiPromise: Record<NetworkName, Promise<ApiPromise>> =
  Object.keys(NetworkName).reduce((acc, network) => {
    const n = network as NetworkName;
    const provider = new WsProvider(networkURLs[n]);

    provider.on('error', fatalErrorHandler);

    acc[n] = new ApiPromise({
      provider,
      rpc: schema[n].rpc,
      types: schema[n].types
    }).isReadyOrError;

    return acc;
  }, {} as Record<NetworkName, Promise<ApiPromise>>);

export default apiPromise;

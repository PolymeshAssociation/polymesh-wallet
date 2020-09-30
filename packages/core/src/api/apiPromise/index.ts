// Copyright 2020-2021 @polymath-network authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import meshSchema from './schema';
import { NetworkName } from '../../types';
import { networkURLs } from '../../constants';

const apiPromise: Record<NetworkName, Promise<ApiPromise>> =
  Object.keys(NetworkName).reduce((acc, network) => {
    acc[network as NetworkName] = new Promise((resolve, reject) => {
      ApiPromise.create({
        provider: new WsProvider(networkURLs[network as NetworkName]),
        rpc: meshSchema.rpc,
        types: meshSchema.types
      }).then((api) => {
        api.isReady.then((api) => {
          resolve(api);
        }).catch((err) => reject(err));
      }).catch((err) => reject(err));
    });

    return acc;
  }, {} as Record<NetworkName, Promise<ApiPromise>>);

export default apiPromise;

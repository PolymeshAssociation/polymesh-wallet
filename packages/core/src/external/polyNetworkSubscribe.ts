import { Unsubscribe } from '@reduxjs/toolkit';

import { networkLabels, networkURLs } from '../constants';
import reduxSubscribe from '../store/reduxSubscribe';
import { selectedNetwork } from '../store/selectors';
import { NetworkMeta, NetworkName } from '../types';

export default function (cb: (networkMeta: NetworkMeta) => void): Unsubscribe {
  const innerCb = (networkName: NetworkName) => {
    const networkMeta = {
      name: networkName,
      label: networkLabels[networkName],
      wssUrl: networkURLs[networkName],
    };

    cb(networkMeta);
  };

  return reduxSubscribe(selectedNetwork, innerCb);
}

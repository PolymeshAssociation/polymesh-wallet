import { Unsubscribe } from '@reduxjs/toolkit';
import { networkURLs, networkLabels } from '../constants';
import reduxSubscribe from '../store/reduxSubscribe';
import { network } from '../store/selectors';
import { NetworkMeta, NetworkName } from '../types';

export default function (cb: (networkMeta: NetworkMeta) => void): Unsubscribe {
  const innerCb = (networkName: NetworkName) => {
    const networkMeta = {
      name: networkName,
      label: networkLabels[networkName],
      wssUrl: networkURLs[networkName]
    };

    cb(networkMeta);
  };

  return reduxSubscribe(network, innerCb);
}

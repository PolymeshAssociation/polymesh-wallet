import { Unsubscribe } from '@reduxjs/toolkit';

import { networkLabels } from '../constants';
import reduxSubscribe from '../store/reduxSubscribe';
import { customNetworkUrl, selectedNetwork } from '../store/selectors';
import { NetworkMeta, NetworkName } from '../types';
import { getNetwork, getNetworkUrl } from '../store/getters';

export default function (cb: (networkMeta: NetworkMeta) => void): Unsubscribe {
  let firstCall = true;

  const onNetworkNameUpdate = (networkName: NetworkName) => {
    const wssUrl = getNetworkUrl();

    const networkMeta = {
      name: networkName,
      label: networkLabels[networkName],
      wssUrl,
    };

    cb(networkMeta);
  };

  const onCustomUrlUpdate = () => {
    // Skip the first callback so the subscription doesn't return twice initially.
    if (firstCall) {
      firstCall = false;
      return;
    }
    const networkName = getNetwork();
    const wssUrl = getNetworkUrl();

    const networkMeta = {
      name: networkName,
      label: networkLabels[networkName],
      wssUrl,
    };

    cb(networkMeta);
  };

  const networkUnsub = reduxSubscribe(selectedNetwork, onNetworkNameUpdate);
  const customUrlUnsub = reduxSubscribe(customNetworkUrl, onCustomUrlUpdate);

  const unsubAll: Unsubscribe = () => {
    customUrlUnsub();
    networkUnsub();
  };

  return unsubAll;
}

import { networkLabels, networkURLs } from '../constants';
import { getNetwork, getCustomNetworkUrl } from '../store/getters';
import { NetworkMeta, NetworkName } from '../types';

export default function (): NetworkMeta {
  const network = getNetwork();
  let wssUrl = networkURLs[network];

  if (network === NetworkName.custom) {
    wssUrl = getCustomNetworkUrl();
  }

  return {
    name: network,
    label: networkLabels[network],
    wssUrl,
  };
}

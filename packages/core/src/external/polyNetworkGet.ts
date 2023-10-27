import { networkLabels } from '../constants';
import { getNetwork, getNetworkUrl } from '../store/getters';
import { NetworkMeta } from '../types';

export default function (): NetworkMeta {
  const network = getNetwork();
  const wssUrl = getNetworkUrl();

  return {
    name: network,
    label: networkLabels[network],
    wssUrl,
  };
}

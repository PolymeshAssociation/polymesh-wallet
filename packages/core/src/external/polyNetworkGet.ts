import type { NetworkMeta } from '../types';

import { networkLabels } from '../constants';
import { getNetwork, getNetworkUrl } from '../store/getters';

export default function (): NetworkMeta {
  const network = getNetwork();
  const wssUrl = getNetworkUrl();

  return {
    label: networkLabels[network],
    name: network,
    wssUrl
  };
}

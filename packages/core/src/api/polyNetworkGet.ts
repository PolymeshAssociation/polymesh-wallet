import { networkURLs, networkLabels } from '../constants';
import { getNetwork } from '../store/getters';
import { NetworkMeta } from '../types';

export default function (): NetworkMeta {
  const network = getNetwork();

  return {
    name: network,
    label: networkLabels[network],
    wssUrl: networkURLs[network]
  };
}

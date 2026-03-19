import type { Chain } from '@polkadot/extension-chains/types';

import { useEffect, useState } from 'react';

import { getMetadata } from '../messaging';

interface UseMetadataResult {
  chain: Chain | null;
  isLoading: boolean;
}

export default function useMetadata (genesisHash?: string | null, isPartial?: boolean): UseMetadataResult {
  const [chain, setChain] = useState<Chain | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (genesisHash) {
      setChain(null);
      setIsLoading(true);

      getMetadata(genesisHash, isPartial)
        .then((storedChain): void => {
          if (!isCancelled) {
            setChain(storedChain);
          }
        })
        .catch((error): void => {
          console.error(error);

          if (!isCancelled) {
            setChain(null);
          }
        })
        .finally((): void => {
          if (!isCancelled) {
            setIsLoading(false);
          }
        });
    } else {
      setChain(null);
      setIsLoading(false);
    }

    return (): void => {
      isCancelled = true;
    };
  }, [genesisHash, isPartial]);

  return { chain, isLoading };
}

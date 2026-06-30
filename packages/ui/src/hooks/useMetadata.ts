import type { Chain } from '@polkadot/extension-chains/types';

import { useEffect, useState } from 'react';

import { getMetadata, refreshMetadataFromChain } from '../messaging';

interface UseMetadataResult {
  chain: Chain | null;
  isLoading: boolean;
}

export default function useMetadata (genesisHash?: string | null, isPartial?: boolean, requestedSpecVersion?: number): UseMetadataResult {
  const [chain, setChain] = useState<Chain | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (genesisHash) {
      setChain(null);
      setIsLoading(true);

      const fetchChain = async (): Promise<Chain | null> => {
        const storedChain = await getMetadata(genesisHash, isPartial);

        // When a specVersion is provided and the stored metadata is outdated,
        // try refreshing directly from the connected chain before giving up.
        if (
          requestedSpecVersion !== undefined &&
          storedChain !== null &&
          storedChain.specVersion !== requestedSpecVersion
        ) {
          return refreshMetadataFromChain(genesisHash, isPartial);
        }

        return storedChain;
      };

      fetchChain()
        .then((resolvedChain): void => {
          if (!isCancelled) {
            setChain(resolvedChain);
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
  }, [genesisHash, isPartial, requestedSpecVersion]);

  return { chain, isLoading };
}

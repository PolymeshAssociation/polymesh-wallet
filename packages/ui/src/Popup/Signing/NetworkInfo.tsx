import React from 'react';

import { Box, Flex, Text } from '@polymeshassociation/extension-ui/ui';

interface Props {
  chainName?: string;
  genesisHash: string;
  hasMetadata: boolean;
  hasSpecMatch: boolean;
  isLoading?: boolean;
}

const NetworkInfo: React.FC<Props> = ({ chainName, genesisHash, hasMetadata, hasSpecMatch, isLoading = false }) => {
  const networkName = chainName || (isLoading ? 'Loading metadata...' : `Unknown (${genesisHash.slice(0, 10)}...)`);

  return (
    <Box mx='s'>
      {!isLoading && !hasMetadata && (
        <Box
          bg='yellow.5'
          mb='xs'
          mt='xs'
          p='xs'
          style={{ borderRadius: '4px' }}
        >
          <Text
            as='div'
            color='alert'
            variant='b3m'
          >
            Metadata not available
          </Text>
          <Text
            as='div'
            color='alert'
            variant='b3'
          >
            No stored metadata found for this chain in the extension.
          </Text>
        </Box>
      )}
      {!isLoading && hasMetadata && !hasSpecMatch && (
        <Box
          bg='yellow.5'
          mb='xs'
          mt='xs'
          p='xs'
          style={{ borderRadius: '4px' }}
        >
          <Text
            as='div'
            color='alert'
            variant='b3m'
          >
            Metadata is outdated
          </Text>
          <Text
            as='div'
            color='alert'
            variant='b3'
          >
            Stored metadata specVersion does not match this request.
          </Text>
        </Box>
      )}
      <Flex
        alignItems='center'
        justifyContent='space-between'
        py='xs'
      >
        <Text
          color='gray.2'
          variant='b3m'
        >
          Network
        </Text>
        <Text
          color='gray.1'
          variant='b3m'
        >
          {networkName}
        </Text>
      </Flex>
    </Box>
  );
};

export default NetworkInfo;

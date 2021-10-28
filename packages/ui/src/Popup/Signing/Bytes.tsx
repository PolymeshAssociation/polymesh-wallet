import { Box, Text } from '@polymathnetwork/extension-ui/ui';
import React from 'react';

interface Props {
  className?: string;
  bytes: string;
  url: string;
}

function Bytes ({ bytes, url }: Props): React.ReactElement<Props> {
  return (
    <Box
      mt='xs'
      mx='s'
    >
      <Box>
        <Text
          color='gray.2'
          variant='b2'
        >
          From
        </Text>
      </Box>
      <Box mt='xs'>
        <Text
          color='gray.1'
          variant='code'
        >
          {url}
        </Text>
      </Box>
      <Box mt='xs'>
        <Text
          color='gray.2'
          variant='b2'
        >
          Bytes
        </Text>
      </Box>
      <Box mt='xs'>
        <Text
          color='gray.1'
          variant='code'
        >
          {bytes}
        </Text>
      </Box>
    </Box>
  );
}

export default Bytes;

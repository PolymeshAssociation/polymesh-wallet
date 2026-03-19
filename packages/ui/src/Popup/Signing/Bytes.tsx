import { isAscii, u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import React, { useMemo } from 'react';

import { Box, Text } from '@polymeshassociation/extension-ui/ui';

interface Props {
  className?: string;
  bytes: string;
  url: string;
}

function Bytes ({ bytes, url }: Props): React.ReactElement<Props> {
  const ascii = useMemo(() => {
    try {
      const unwrapped = u8aUnwrapBytes(bytes);

      return isAscii(unwrapped)
        ? u8aToString(unwrapped)
        : null;
    } catch {
      return null;
    }
  }, [bytes]);

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
        <Box>
          <Text
            color='gray.2'
            variant='b2'
          >
            Raw Data
          </Text>
        </Box>
        <Box mt='xs'>
          <Text
            color='gray.1'
            style={{ wordBreak: 'break-word' }}
            variant='code'
          >
            {bytes}
          </Text>
        </Box>
        {!!ascii && (
          <>
            <Box mt='xs'>
              <Text
                color='gray.2'
                variant='b2'
              >
                Decoded Message
              </Text>
            </Box>
            <Box mt='xs'>
              <Text
                color='gray.1'
                style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                variant='code'
              >
                {ascii}
              </Text>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Bytes;

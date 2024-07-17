import type { FC } from 'react';
import type { FallbackProps } from 'react-error-boundary';

import React from 'react';

import { SvgCrossOutline } from '@polymeshassociation/extension-ui/assets/images/icons';

import { Box, Button, Heading, IconCircled, Text } from '../ui';

const ErrorBoundaryFallback: FC<FallbackProps> = ({ error,
  resetErrorBoundary }) => {
  return (
    <>
      <Box mt='xl'>
        <IconCircled
          Asset={SvgCrossOutline}
          bg='red.1'
          color='red.0'
          scale={0.7}
        />
      </Box>
      <Box pt='xl'>
        <Heading variant='h5'>An error occurred</Heading>
      </Box>
      {error && (
        <Box>
          <Box
            mb='xl'
            mt='m'
          >
            <Text
              color='gray.1'
              fontSize='1'
              variant='code'
            >
              {error.message ? error.message : JSON.stringify(error)}
            </Text>
          </Box>
          <Button onClick={resetErrorBoundary}>Reload</Button>
        </Box>
      )}
    </>
  );
};

export default ErrorBoundaryFallback;

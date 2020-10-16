import React, { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Box, IconCircled, Heading, Text, Button } from '../ui';
import { SvgCrossOutline } from '@polymathnetwork/extension-ui/assets/images/icons';

const ErrorBoundaryFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <>
      <Box mt='xl'>
        <IconCircled Asset={SvgCrossOutline}
          bg='red.1'
          color='red.0'
          scale={0.7} />
      </Box>
      <Box pt='xl'>
        <Heading variant='h5'>An error occurred</Heading>
      </Box>
      {error && (
        <Box>
          <Box mb='xl'
            mt='m'>
            <Text color='gray.1'
              fontSize='2'
              variant='b2'>
              {error.toString()}
            </Text>
          </Box>
          <Button onClick={resetErrorBoundary}>Go back</Button>
        </Box>
      )}
    </>
  );
};

export default ErrorBoundaryFallback;

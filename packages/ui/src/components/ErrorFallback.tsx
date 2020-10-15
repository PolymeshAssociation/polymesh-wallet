import React, { FC } from 'react';
import { FallbackProps } from 'react-error-boundary';
import {
  // Page,
  Box, IconCircled, Heading, Text, Button } from '../ui';
import { SvgCrossOutline } from '@polymathnetwork/extension-ui/assets/images/icons';

const ErrorBoundaryFallback: FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <>
      {/* <Page> */}
      <Box mt='xl'>
        <IconCircled Asset={SvgCrossOutline}
          bg='red.1'
          color='red.0'
          scale={0.7} />
      </Box>
      <Box mt='m'>
        <Text color='highlightText'
          fontSize='5'
          fontWeight='semiBold'>
            An error occurred
        </Text>
      </Box>
      {error && (
        <Box mt='l'>
          <Heading variant='h5'>Error details</Heading>
          <Box mt='m'>
            <Text>{error.toString()}</Text>
          </Box>
          <Button onClick={resetErrorBoundary}>Refresh</Button>
        </Box>
      )}
      {/* </Page> */}
    </>
  );
};

export default ErrorBoundaryFallback;

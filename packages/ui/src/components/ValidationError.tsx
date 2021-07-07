import { Box, Text } from '@polymathnetwork/polymesh-ui';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

function ValidationError ({ children }: Props): React.ReactElement<Props> {
  return (
    <Box >
      <Text className='validation-error'
        color='alert'
        variant='b3'>{children}</Text>
    </Box>
  );
}

export default ValidationError;

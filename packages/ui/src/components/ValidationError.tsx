import React from 'react';

import { Box, Text } from '../ui';

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

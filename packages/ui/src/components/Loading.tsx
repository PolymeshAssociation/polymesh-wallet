import React from 'react';

import { Flex, Loading as LoadingIndicator } from '../ui';

interface Props {
  children?: React.ReactNode;
}

export default function Loading ({ children }: Props): React.ReactElement<Props> {
  if (!children) {
    return (
      <Flex alignItems='center'
        flex={1}
        flexDirection='column'
        justifyContent='center'>
        <LoadingIndicator />
      </Flex>
    );
  }

  return (
    <>{children}</>
  );
}

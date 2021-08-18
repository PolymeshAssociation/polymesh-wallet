import React, { useMemo } from 'react';

import { Flex, Text } from '../ui';

type InitialAvatarProps = {
  name?: string;
};

export function InitialsAvatar ({ name }: InitialAvatarProps): JSX.Element {
  const initials = useMemo(() => {
    if (!name) return '';

    const nameArray = name.toUpperCase().split(' ');

    return `${nameArray[0][0]}${nameArray[1] ? nameArray[1][0] : ''}`;
  }, [name]);

  return (
    <Flex alignItems='center'
      backgroundColor='gray7'
      borderRadius='50%'
      height={40}
      justifyContent='center'
      style={{ flexShrink: 0 }}
      width={40}>
      <Text color='gray1'
        variant='b2m'>
        {initials}
      </Text>
    </Flex>
  );
}

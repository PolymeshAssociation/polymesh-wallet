import type { FC } from 'react';

import React from 'react';

import { Flex } from '../Flex';
import { Icon } from '../Icon';
import * as sc from './styles';

export interface GrowingButtonProps {
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  onClick: () => void;
}

export const GrowingButton: FC<GrowingButtonProps> = ({ icon, onClick }) => {
  return (
    <sc.Wrapper onClick={onClick}>
      <Flex mr='xs'>
        <Icon
          Asset={icon}
          height={24}
          width={24}
        />
      </Flex>
    </sc.Wrapper>
  );
};

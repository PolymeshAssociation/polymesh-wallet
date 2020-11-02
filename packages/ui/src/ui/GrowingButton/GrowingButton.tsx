import React, { FC } from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import * as sc from './styles';

export interface GrowingButtonProps {
  icon: React.ComponentType<React.SVGAttributes<SVGElement>>;
  onClick: () => void;
}

export const GrowingButton: FC<GrowingButtonProps> = ({ icon, onClick }) => {
  return (
    <sc.Wrapper onClick={onClick}>
      <Box mr='xs'>
        <Icon Asset={icon}
          height={24}
          width={24} />
      </Box>
      <sc.Content>
        Go to dashboard
      </sc.Content>
    </sc.Wrapper>
  );
};

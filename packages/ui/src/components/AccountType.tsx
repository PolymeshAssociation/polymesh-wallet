import { StatusBadge } from '@polymathnetwork/polymesh-ui';
import React, { FC } from 'react';

export interface Props {
  keyType?: string;
  large?: boolean;
  small?: boolean;
}

export const AccountType: FC<Props> = ({ keyType, large, small }) => {
  const color = keyType === 'primary' ? 'green' : 'blue';
  const text = keyType === 'primary' ? 'Primary' : 'Secondary';

  return (
    <StatusBadge
      small={small}
      variant={color}>{text}</StatusBadge>
  );
};

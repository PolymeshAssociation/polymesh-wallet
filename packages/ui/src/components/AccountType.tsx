import { StatusBadge } from '@polymathnetwork/polymesh-ui';
import React, { FC } from 'react';

export interface Props {
  keyType?: string;
  large?: boolean;
}

export const AccountType: FC<Props> = ({ keyType, large }) => {
  const color = keyType === 'primary' ? 'green' : 'blue';
  const text = keyType === 'primary' ? 'Primary' : 'Secondary';

  return (
    <StatusBadge
      variant={color}>{text}</StatusBadge>
  );
};

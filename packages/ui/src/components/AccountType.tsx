import React, { FC } from 'react';

import { StatusBadge } from '../ui';

export interface Props {
  keyType?: string;
  large?: boolean;
}

export const AccountType: FC<Props> = ({ keyType, large }) => {
  const color = keyType === 'primary' ? 'green' : 'blue';
  const text = keyType === 'primary' ? 'Primary' : 'Secondary';

  return (
    <StatusBadge large={large}
      variant={color}>{text}</StatusBadge>
  );
};

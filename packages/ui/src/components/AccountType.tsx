import type { FC } from 'react';

import React from 'react';

import { StatusBadge } from '../ui';

export interface Props {
  keyType?: string;
  large?: boolean;
}

export const AccountType: FC<Props> = ({ keyType, large }) => {
  const color = keyType === 'primary' ? 'red' : 'blue';
  const text = keyType === 'primary' ? 'Primary' : keyType === 'secondary' ? 'Secondary' : 'MultiSigSigner';

  return (
    <StatusBadge
      large={large}
      variant={color}
    >
      {text}
    </StatusBadge>
  );
};

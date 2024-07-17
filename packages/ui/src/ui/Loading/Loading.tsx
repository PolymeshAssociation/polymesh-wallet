import type { LoadingProps } from './types';

import React from 'react';

import * as sc from './styles';

export const Loading = (props: LoadingProps) => {
  return (
    <sc.Wrapper {...props}>
      <span />
      <span />
    </sc.Wrapper>
  );
};

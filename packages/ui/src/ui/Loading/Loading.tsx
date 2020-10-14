import React from 'react';
import * as sc from './styles';
import { LoadingProps } from './types';

export const Loading = (props: LoadingProps) => {
  return (
    <sc.Wrapper {...props}>
      <span />
      <span />
    </sc.Wrapper>
  );
};

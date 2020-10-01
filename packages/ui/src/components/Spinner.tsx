import { ThemeProps } from '../types';

import React from 'react';
import styled from 'styled-components';

import spinnerSrc from '../assets/spinner.png';

interface Props extends ThemeProps {
  className?: string;
  size?: 'normal';
}

function Spinner ({ className = '', size = 'normal' }: Props): React.ReactElement<Props> {
  return (
    <img
      className={`${className} ${size}Size`}
      src={spinnerSrc}
    />
  );
}

export default React.memo(styled(Spinner)`
  bottom: 0rem;
  height: 3rem;
  position: absolute;
  right: 0.75rem;
  width: 3rem;
  z-index:
`);

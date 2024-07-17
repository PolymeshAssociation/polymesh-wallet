import type { ThemeProps } from '../types';

import React from 'react';
import styled from 'styled-components';

import warningImageSrc from '../assets/warning.svg';
import Svg from './Svg';

interface Props extends ThemeProps {
  children: React.ReactNode;
  className?: string;
  isDanger?: boolean;
}

function Warning ({ children,
  className,
  ...props }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      {...props}
    >
      <div>
        <Svg
          className='warningImage'
          src={warningImageSrc}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default React.memo(
  styled(Warning)(
    ({ isDanger, theme }: Props) => `
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-left: ${isDanger ? '16px' : '20px'};
  color: ${theme.subTextColor};
  border-left: ${isDanger ? `4px solid ${theme.buttonBackgroundDanger}` : ''};
  width: 100%;

  .warningImage {
    width: 16px;
    height: 14px;
    margin: 5px 10px 5px 0;
    background: ${isDanger ? theme.iconDangerColor : theme.iconWarningColor};
  }
`
  )
);

import React from 'react';
import styled from 'styled-components';

import { ThemeProps } from '../../types';

interface Props {
  content: React.ReactChild;
  className?: string;
}

function Toast ({ className, content }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <p className='snackbar-content'>{content}</p>
    </div>
  );
}

export default styled(Toast)<{visible: boolean}>`
  position: fixed;
  display: ${({ visible }): string => visible ? 'block' : 'none'};
  height: 40px;
  text-align: center;
  vertical-align: middle;
  line-height: 7px;
  top: 460px;
  left: calc(50% - 50px);

  && {
    margin: auto;
    border-radius: 25px;
    background: ${({ theme }: ThemeProps): string => theme.highlightedAreaBackground};
  }
`;

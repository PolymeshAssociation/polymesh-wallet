import { ThemeProps } from '../types';

import styled from 'styled-components';
import Button from './Button';

export default styled.div(({ theme }: ThemeProps) => `
  display: flex;
  flex-direction: row;
  background: ${theme.highlightedAreaBackground};
  border-top: 1px solid ${theme.inputBorderColor};
  padding: 12px 24px;

  &&& {
    margin-left: 0;
    margin-right: 0;
  }

  & > ${Button}:not(:last-of-type) {
    margin-right: 8px;
  }
`);

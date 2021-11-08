import styled from 'styled-components';

import { ThemeProps } from '../types';

interface Props {
  src: string;
}

export default styled.span<Props>(
  ({ src, theme }: Props & ThemeProps) => `
  background: ${theme.textColor};
  display: inline-block;
  mask: url(${src});
  mask-size: cover;
`
);

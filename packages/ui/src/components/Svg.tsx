import { ThemeProps } from '../types';

import styled from 'styled-components';

interface Props {
  src: string;
}

export default styled.span<Props>(({ src, theme }: Props & ThemeProps) => `
  background: ${theme.textColor};
  display: inline-block;
  mask: url(${src});
  mask-size: cover;
`);

import type { ThemeProps } from '@polymeshassociation/extension-ui/types';

import styled from 'styled-components';

export const Label = styled.label`
  color: ${({ theme }: ThemeProps) => theme.colors.highlightText};
  font-size: ${({ theme }: ThemeProps) => theme.fontSizes.baseText};
`;

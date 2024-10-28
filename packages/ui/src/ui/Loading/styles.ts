import type { ThemeProps } from '@polymeshassociation/extension-ui/types';
import type { LoadingProps } from './types';

import styled, { keyframes } from 'styled-components';

const spin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`;

export const Wrapper = styled.div<LoadingProps>`
  position: relative;
  width: ${({ small }) => (small ? '18px' : '64px')};
  height: ${({ small }) => (small ? '18px' : '64px')};
  border: ${({ small }) => (small ? '2px' : '5px')} solid ${({ theme }: ThemeProps) => theme.colors.primary};
  border-radius: 50%;
  border-top-color: transparent;
  animation: ${spin} 1s cubic-bezier(0.255, 0.2, 0.315, 0.455) infinite;   
`;

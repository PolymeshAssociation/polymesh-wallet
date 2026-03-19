import type { ThemeProps } from '@polymeshassociation/extension-ui/types';

import { styled } from '@polymeshassociation/extension-ui/styles';

import { Flex } from '../Flex';

interface WrapperProps extends ThemeProps {
  $hoverLabel: string;
}

export const Wrapper = styled(Flex)<WrapperProps>`
  width: 24px;
  height: 24px;
  padding: 0 30px 0 0;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  color: ${({ theme }: ThemeProps) => theme.colors.polyIndigo};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
  &:hover {
    width: 150px;
  }
  &:hover:after {
    content: ${({ $hoverLabel }: WrapperProps) => JSON.stringify($hoverLabel)};
  }
`;

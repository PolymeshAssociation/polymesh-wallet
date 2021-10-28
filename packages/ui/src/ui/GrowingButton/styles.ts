import { styled } from '@polymathnetwork/extension-ui/styles';
import { ThemeProps } from '@polymathnetwork/extension-ui/types';

import { Flex } from '../Flex';

export const Wrapper = styled(Flex)<ThemeProps>`
  width: 24px;
  height: 24px;
  padding: 0 30px 0  0;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.polyIndigo};
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  white-space: nowrap;
  &:hover {
    width: 150px;
  }
  &:hover:after {
    content: 'Go to dashboard';
  }
`;

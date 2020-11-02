import { styled } from '@polymathnetwork/extension-ui/styles';
import { Flex } from '../Flex';
import { Box } from '../Box';

export const Wrapper = styled(Flex)`
  width: 24px;
  height: 24px;
  padding: 2px;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  color: #ffffff;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  &:hover {
    width: 150px;
    color: #6DC7F7;
  }
`;

export const Content = styled(Flex)`
  height: 24px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  opacity: 0;
  transition: opacity 0s ease-in;
  &:hover {
    opacity: 1;
  }
`;

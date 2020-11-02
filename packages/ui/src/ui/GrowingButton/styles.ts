import { styled } from '@polymathnetwork/extension-ui/styles';
import { Flex } from '../Flex';

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
  white-space: nowrap;
  &:hover {
    width: 150px;
    color: #6DC7F7;
  }
  &:hover:after {
    content: 'Go to dashboard';
  }
`;

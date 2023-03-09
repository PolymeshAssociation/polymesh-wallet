import { styled } from '@polymeshassociation/extension-ui/styles';

import { Box } from '../Box';

export const StatusText = styled(Box)<{
  copied: boolean;
  noIcon?: boolean;
}>`
  position: relative;
  &::after {
    content: 'Copied';
    position: absolute;
    top: -18px;
    right: -13px;
    margin: 0;
    padding-left: 5px;
    padding-right: 5px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffffff;
    border-radius: 8px;
    font-size: 9px;
    font-weight: bold;
    white-space: nowrap;
    pointer-events: none;
    opacity: ${(props) => (props.copied ? 1 : 0)};
  }
`;

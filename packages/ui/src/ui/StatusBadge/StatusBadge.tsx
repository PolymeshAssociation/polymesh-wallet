import styled from 'styled-components';

import { Box } from '../Box';

export interface StatusBadgeProps {
  large?: boolean;
  variant?: 'green' | 'red' | 'yellow' | 'gray' | 'blue';
}

export const StatusBadge = styled(Box)<StatusBadgeProps>`
  display: inline-block;
  margin: 0 0 0 0px;
  padding: ${({ large }) => large ? '4px 15px' : '0 15px'};
  height: ${({ large }) => large ? '24px' : '16px'};
  line-height: 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  background-color: ${({ theme, variant }) =>
    variant === 'green'
      ? theme.colors.green[2]
      : variant === 'red'
        ? theme.colors.polyPinkLight
        : variant === 'yellow'
          ? theme.colors.yellow[1]
          : variant === 'gray'
            ? theme.colors.gray[4]
            : variant === 'blue'
              ? theme.colors.polyNavyBlueLight2
              : theme.colors.gray[4]};
  color: ${({ theme, variant }) =>
    variant === 'green'
      ? theme.colors.green[0]
      : variant === 'red'
        ? theme.colors.polyPink
        : variant === 'yellow'
          ? theme.colors.yellow[2]
          : variant === 'gray'
            ? theme.colors.gray[2]
            : variant === 'blue'
              ? theme.colors.polyNavyBlue
              : theme.colors.gray[2]};
`;

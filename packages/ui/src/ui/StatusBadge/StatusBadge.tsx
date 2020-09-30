import styled from 'styled-components';
import { Box } from '../Box';

export interface StatusBadgeProps {
  variant?: 'green' | 'red' | 'yellow' | 'gray' | 'blue';
}

export const StatusBadge = styled(Box)<StatusBadgeProps>`
  display: inline-block;
  margin: 0 0 0 0px;
  padding: 0 15px;
  height: 16px;
  line-height: 16px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  background-color: ${({ theme, variant }) =>
    variant === 'green'
      ? theme.colors.green[2]
      : variant === 'red'
        ? theme.colors.red[1]
        : variant === 'yellow'
          ? theme.colors.yellow[1]
          : variant === 'gray'
            ? theme.colors.gray[4]
            : variant === 'blue'
              ? theme.colors.brandLightest
              : theme.colors.gray[4]};
  color: ${({ theme, variant }) =>
    variant === 'green'
      ? theme.colors.green[0]
      : variant === 'red'
        ? theme.colors.red[0]
        : variant === 'yellow'
          ? theme.colors.yellow[2]
          : variant === 'gray'
            ? theme.colors.gray[2]
            : variant === 'blue'
              ? theme.colors.brandMain
              : theme.colors.gray[2]};
`;

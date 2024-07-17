import type { ThemeProps } from '@polymeshassociation/extension-ui/types';

import styled from 'styled-components';

import { Box } from '../Box';

export interface StatusBadgeProps extends ThemeProps {
  large?: boolean;
  variant?: 'green' | 'red' | 'yellow' | 'gray' | 'blue';
}

export const StatusBadge = styled(Box)<StatusBadgeProps>`
  display: flex;
  align-items: center;
  border-radius: 100px;
  margin: 0;
  padding: 0 8px;
  height: ${({ large }) => (large ? '24px' : '16px')};

  ${({ theme }: StatusBadgeProps) => theme.texts.b3m}

  background-color: ${({ theme, variant }: StatusBadgeProps) =>
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

  color: ${({ theme, variant }: StatusBadgeProps) =>
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

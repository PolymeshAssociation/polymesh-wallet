/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ThemeProps } from '@polymathnetwork/extension-ui/types';
import { Box, BoxProps, css, styled } from '@polymathnetwork/polymesh-ui';
import { FC } from 'react';

import { CssPosition } from './types';

interface Props extends ThemeProps {
  cssPosition: CssPosition;
}

export const Options: FC<BoxProps> = styled(Box) <Props>`
  position: absolute;
  background: white;
  box-shadow: ${({ theme }: ThemeProps) => theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;
 
  ${({ cssPosition }) => cssPosition}

  // Only show options once it is positioned in place
  visibility: ${({ cssPosition }) => (Object.values(cssPosition).length ? 'visible' : 'hidden')};

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;

interface StyledOptionListItemProps extends ThemeProps {
  disabled?: boolean;
}

export const StyledOptionListItem = styled.li<StyledOptionListItemProps>`
  cursor: pointer;
  white-space: nowrap;


  ${({ disabled }) =>
    disabled &&
    css`
      cursor: default;

      .option-text {
        color: ${({ theme }: ThemeProps) => theme.colors.disabled};
      }
    `}

  ${({ disabled }) =>
    !disabled &&
    css`
      &:hover {
        background: ${({ theme }: ThemeProps) => theme.colors.gray[4]};
      }
    `}
`;

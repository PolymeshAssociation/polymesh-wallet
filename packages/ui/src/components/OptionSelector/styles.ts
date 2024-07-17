import type { ThemeProps } from '@polymeshassociation/extension-ui/types';
import type { CssPosition } from './types';

import { css } from 'styled-components';

import { styled } from '@polymeshassociation/extension-ui/styles';
import { Box } from '@polymeshassociation/extension-ui/ui';

export const Options = styled(Box)<{cssPosition: CssPosition}>`
  position: absolute;
  background: white;
  box-shadow: ${({ theme }: ThemeProps) => theme.shadows[3]};
  border-radius: 8px;
  padding: 8px 0;
  z-index: 1000;

  ${({ cssPosition }) => `
    ${cssPosition.top !== undefined ? `top: ${cssPosition.top}px;` : ''}
    ${cssPosition.right !== undefined ? `right: ${cssPosition.right}px;` : ''}
    ${cssPosition.bottom !== undefined ? `bottom: ${cssPosition.bottom}px;` : ''}
    ${cssPosition.left !== undefined ? `left: ${cssPosition.left}px;` : ''}
  `}

  // Only show options once it is positioned in place
  visibility: ${({ cssPosition }) =>
    Object.values(cssPosition).length ? 'visible' : 'hidden'};

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;

export const StyledOptionListItem = styled.li<{ disabled?: boolean }>`
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
        background: ${({ theme }: ThemeProps) => theme.colors.gray[5]};
      }
    `}
`;

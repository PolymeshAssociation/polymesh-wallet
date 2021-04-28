import { styled } from '@polymathnetwork/extension-ui/styles';
import { ThemeProps } from '@polymathnetwork/extension-ui/types';
import { Box } from '@polymathnetwork/extension-ui/ui';

import { CssPosition } from './types';

export const Options = styled(Box)<{ cssPosition: CssPosition }>`
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

    li {
      cursor: pointer;
      white-space: nowrap;

      &:hover {
        background: ${({ theme }: ThemeProps) => theme.colors.gray[4]};
      }
    }
  }
`;

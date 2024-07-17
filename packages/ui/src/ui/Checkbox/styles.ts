/* eslint-disable sort-keys */
import type { ThemeProps } from '@polymeshassociation/extension-ui/types';

import { styled } from '../../styles';
import { visuallyHidden } from '../../styles/utils';
import { Icon } from '../Icon';

export const Input = styled.input(visuallyHidden);

export const CheckStateIcon = styled(Icon)<ThemeProps>(({ theme }: ThemeProps) => ({
  display: 'block',
  left: '50%',
  margin: 'auto',
  opacity: 0,
  pointerEvents: 'none',
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  transition: `${theme.transitions.hover.ms}ms`,
  visibility: 'hidden'
}));

export const CheckboxInput = styled.div<ThemeProps>(({ theme }: ThemeProps) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: `${theme.transitions.hover.ms}ms`,
  boxSizing: 'border-box',
  border: `2px solid ${theme.colors.gray[3]}`,
  borderRadius: theme.radii[1],
  width: '18px',
  height: '18px',
  backgroundColor: '#fff',
  userSelect: 'none',
  flexShrink: 0,

  [`${Input}:focus + &`]: {
    borderColor: theme.colors.primary
  },

  [`${Input}:checked:focus + &`]: {
    borderColor: theme.colors.primary
  },

  [`${Input}:checked + &`]: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary
  },

  [`${Input}:checked + & .checkIcon`]: {
    visibility: 'visible',
    opacity: 1
  },

  '&.indeterminate': {
    borderColor: theme.colors.primary,

    '.minusIcon': {
      visibility: 'visible',
      opacity: 1
    },

    '.checkIcon': {
      visibility: 'hidden',
      opacity: 0
    }
  }
}));

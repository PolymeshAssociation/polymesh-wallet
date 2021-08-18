import { darken, transparentize } from 'polished';

import { Styles } from '../../styles/types';
import { ButtonDefaultProps, ButtonIconPosition, ButtonProps } from './definitions';

export const getVariant: Styles<ButtonProps> = ({ theme, variant = ButtonDefaultProps.variant }) =>
  ({
    primary: {
      backgroundColor: theme.colors.polyNavyBlue,
      color: '#fff',
      boxShadow: theme.shadows[2],
      height: '48px',
      '&:hover': {
        backgroundColor: theme.colors.polyNavyBlueDark,
        boxShadow: theme.shadows[3]
      },
      '&:active': {
        backgroundColor: transparentize(0.2, theme.colors.polyNavyBlueDark),
        boxShadow: theme.shadows[3]
      }
    },
    secondary: {
      backgroundColor: theme.colors.white,
      color: theme.colors.polyNavyBlue,
      border: `1px solid ${theme.colors.polyNavyBlue}`,
      height: '48px',
      '&:hover': {
        color: theme.colors.polyNavyBlue,
        backgroundColor: theme.colors.polyNavyBlueLight1
      },
      '&:active': {
        backgroundColor: darken(0.1, theme.colors.polyNavyBlueLight2)
      },
      '&:disabled': {
        border: `1px solid ${theme.colors.gray7}`,
        background: theme.colors.white
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.highlightText,
      '&:hover': {
        color: theme.colors.highlightText,
        backgroundColor: theme.colors.disabled
      },
      '&:disabled': {
        backgroundColor: 'transparent'
      }
    },
    ghostSecondary: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      color: 'currentColor',
      padding: 0,
      '&:hover': {
        backgroundColor: 'transparent',
        color: 'currentColor',
        opacity: 0.5
      },
      '&:disabled': {
        opacity: 1
      }
    },
    gray: {
      backgroundColor: theme.colors.gray[4],
      color: theme.colors.gray[1],
      '&:hover': {
        color: theme.colors.brandMain,
        backgroundColor: theme.colors.brandLightest
      },
      '&:active': {
        backgroundColor: darken(0.1, theme.colors.brandLightest)
      }
    },
    light: {
      backgroundColor: '#fff',
      color: theme.colors.gray[1],
      boxShadow: theme.shadows[2],
      '&:hover': {
        backgroundColor: theme.colors.gray[4]
      }
    },
    transparent: {
      backgroundColor: 'transparent'
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.gray[0],
      borderColor: theme.colors.gray[0],
      borderStyle: 'solid',
      borderRadius: 8
    },
    raw: {}
  }[variant]);

export const getIconStyle = (position: ButtonIconPosition) =>
  ({
    top: 'Bottom',
    bottom: 'Top',
    left: 'Right',
    right: 'Left'
  }[position]);

import type { ThemeProps } from '@polymeshassociation/extension-ui/types';
import type { Styles } from './themeTypes';

import { darken, getLuminance, lighten } from 'polished';
import { style } from 'styled-system';

export const MaxWidthScale = style({
  // key for theme values
  key: 'maxWidth',
  // React prop name
  prop: 'maxWidth'
});

export const ellipsis: Styles = () => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

export const FormFieldLabel: Styles = ({ theme }: ThemeProps) => ({
  color: theme.colors.highlightText,
  fontSize: theme.fontSizes[1],
  fontWeight: 600
});

export const FormFieldError: Styles = ({ theme }: ThemeProps) => ({
  color: theme.colors.red[0],
  fontSize: theme.fontSizes[0],
  fontWeight: 400
});

/* eslint-disable sort-keys */
export const textLinkInverted: Styles = () => ({
  textDecoration: 'none',

  '&:hover, &:focus': {
    textDecoration: 'underline'
  }
});
/* eslint-enable sort-keys */

export const ulReset: Styles = () => ({
  listStyle: 'none',
  margin: 0,
  padding: 0
});

export const buttonReset: Styles = ({ theme }: ThemeProps) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  letterSpacing: 'normal',
  padding: 0,
  textTransform: 'none',
  transitionDuration: `${theme.transitions.hover.ms}ms`,
  transitionProperty: 'background, color, box-shadow, opacity'
});

export const inputs: Styles = ({ theme }: ThemeProps) => ({
  backgroundColor: theme.colors.gray[1],
  borderRadius: theme.radii[1],
  height: 40 // this needs to be a number because it's being used in JS logic
});

export const getHoverColor = (color: string) =>
  getLuminance(color) > 0.5 ? darken(0.2, color) : lighten(0.2, color);

export const visuallyHidden: Styles = () => ({
  border: 0,
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px'
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasKey<O extends object, K extends keyof any> (
  obj: O,
  key: K
): key is K & keyof O {
  return key in obj;
}

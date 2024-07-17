import type { ButtonHTMLAttributes } from 'react';
import type React from 'react';
import type { WidthProps } from 'styled-system';

export type HtmlButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';
export type variants =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'ghostSecondary'
  | 'transparent'
  | 'raw'
  | 'light'
  | 'gray';

export type ButtonProps = HtmlButtonProps & {
  /**
   * Specify the variant of Button you want to create
   */
  variant?: variants;
  fluid?: boolean;
  minsize?: boolean;
  tight?: boolean;
  busy?: boolean;
  /**
   * Optionally specify an href for your Button
   */
  href?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouterLink?: React.ComponentType<any>;
  iconPosition?: ButtonIconPosition;
} & WidthProps;

export const ButtonDefaultProps = {
  busy: false,
  fluid: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onClick: (): void => {},
  tabIndex: 0,
  type: ('button' as HtmlButtonProps['type']),
  variant: ('primary' as variants)
};

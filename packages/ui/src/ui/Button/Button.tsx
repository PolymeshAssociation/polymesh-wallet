/* eslint-disable sort-keys */
import type { ForwardRefRenderFunction } from 'react';
import type { ThemeProps } from '@polymeshassociation/extension-ui/types';
import type { ButtonProps } from './definitions';

import React from 'react';

import { styled } from '../../styles';
import { Icon } from '../Icon';
import { Loading } from '../Loading';
import { ButtonDefaultProps } from './definitions';
import { getIconStyle, getVariant } from './styles';

const ButtonComponent: ForwardRefRenderFunction<
HTMLButtonElement,
React.PropsWithChildren<ButtonProps>
> = (
  { RouterLink, busy, children, disabled, href, onClick, ...otherProps },
  ref
) => {
  if (RouterLink) {
    return <RouterLink {...otherProps} />;
  } else {
    return (
      <button
        disabled={busy || disabled}
        onClick={onClick}
        ref={ref}
        role={href && 'button'}
        {...(href && { type: undefined })}
        {...otherProps}
      >
        {busy && <Loading small />}
        {!busy && children}
      </button>
    );
  }
};

const ButtonWithRef = React.forwardRef(ButtonComponent);

interface Props extends ThemeProps, ButtonProps{}

export const Button = styled(ButtonWithRef)<ButtonProps>(
  ({ fluid, iconPosition, minsize, theme, tight }: Props) => ({
    whiteSpace: 'nowrap',
    position: 'relative',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    textAlign: 'center',
    textDecoration: 'none',
    letterSpacing: '0.75px',
    border: 'none',
    padding: minsize ? '0.75rem 0.25rem' : '0.75rem 1.75rem',
    minHeight: '2.5rem',
    minWidth: minsize ? '2.5rem' : tight ? '100px' : '128px',
    lineHeight: theme.lineHeights.tight,
    fontFamily: theme.fontFamilies.baseText,
    fontSize: theme.fontSizes[1],
    fontWeight: theme.fontWeights.semiBold,
    borderRadius: '100px',
    ...(fluid && { width: '100%' }),

    '&:disabled, &:disabled:hover': {
      backgroundColor: theme.colors.disabled,
      color: theme.colors.inactive,
      boxShadow: 'none',
      cursor: 'not-allowed'
    },

    [Icon]: {
      ...(iconPosition && {
        [`margin${getIconStyle(iconPosition)}`]: theme.space.s
      })
    }
  }),
  getVariant
);

Button.defaultProps = ButtonDefaultProps;

/* eslint-disable sort-keys */
import type { StyledProps } from 'styled-components';
import type { ThemeProps } from '@polymeshassociation/extension-ui/types';
import type { Styles } from '../../styles/types';
import type { BaseInputProps } from './BaseInputProps';

import styled from 'styled-components';

import { Flex } from '../Flex';

const getInputStyles: Styles<BaseInputProps & { focused?: boolean }> = ({ disabled,
  focused,
  invalid,
  readOnly,
  theme }) => {
  if (disabled) {
    return {
      backgroundColor: theme.colors.disabled,
      borderColor: theme.colors.disabled
    };
  }

  if (readOnly) {
    return {
      backgroundColor: theme.colors.disabled,
      borderColor: theme.colors.disabled,
      color: theme.colors.baseText
    };
  }

  if (invalid) {
    if (focused) {
      return {
        borderColor: theme.colors.alert
      };
    }

    return {
      borderColor: theme.colors.alert
    };
  }

  if (focused) {
    return {
      borderColor: theme.colors.brandMain
    };
  }

  return {};
};

export const Wrapper = styled.label<StyledProps<BaseInputProps>>((props: ThemeProps) => ({
  ...{
    alignItems: 'center',
    backgroundColor: 'white',
    border: `1px solid ${props.theme.colors.gray5}`,
    borderRadius: props.theme.radii[3],
    color: props.theme.colors.highlightText,
    display: 'flex'
  },
  ...getInputStyles(props)
}));

export const BaseInputStyle: Styles<BaseInputProps> = ({ icon,
  theme,
  tight,
  unit }) => ({
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '1px solid transparent',
  boxSizing: 'border-box',
  color: 'inherit',
  display: 'block',
  flexGrow: 1,
  fontFamily: theme.fontFamilies.baseText,
  fontSize: theme.fontSizes[1],
  // height: '100%',
  marginLeft: '2px',
  marginRight: '2px',

  outline: 'none',
  padding: tight ? '1px 1px 1px 1px' : '8px 8px 8px 8px',
  ...(unit && { paddingRight: '50px' }),
  ...(icon && { paddingLeft: '40px' }),
  transition: `all ${theme.transitions.hover.ms}ms`,
  width: '100%',

  /* Remove ugly handles on Chrome/Mozilla for number inputs (until mouse hover) */
  /* Only on desktop */

  [`@media screen and (min-width: ${theme.breakpoints.sm})`]: {
    '-moz-appearance': 'textfield',
    '::-webkit-inner-spin-button, ::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none'
    }
  },

  '::placeholder': {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: theme.colors.placeholder,
    opacity: 1 /* Firefox */,
    fontFamily: theme.fontFamilies.baseText,
    fontStyle: 'normal',
    fontWeight: theme.fontWeights.normal,
    fontSize: '14px',
    lineHeight: '23px'
  },

  ':-ms-input-placeholder': {
    /* Internet Explorer 10-11 */
    color: theme.colors.placeholder,
    fontFamily: theme.fontFamilies.baseText,
    fontStyle: 'normal',
    fontWeight: theme.fontWeights.normal,
    fontSize: '14px',
    lineHeight: '23px'
  },

  '::-ms-input-placeholder': {
    /* Microsoft Edge */
    color: theme.colors.placeholder,
    fontFamily: theme.fontFamilies.baseText,
    fontStyle: 'normal',
    fontWeight: theme.fontWeights.normal,
    fontSize: '14px',
    lineHeight: '23px'
  },

  ':-webkit-autofill': {
    backgroundColor: 'transparent'
  },
  ':-webkit-autofill:hover': {
    backgroundColor: 'transparent'
  },
  ':-webkit-autofill:focus': {
    backgroundColor: 'transparent'
  },
  ':-webkit-autofill:active': {
    backgroundColor: 'transparent'
  }
});

export const Input = styled.input(BaseInputStyle);

export const Unit = styled(Flex)(({ theme }: ThemeProps) => ({
  alignItems: 'center',
  color: theme.colors.placeholder,
  fontSize: theme.fontSizes.baseText,
  fontFamily: theme.fontFamilies.baseText,
  flexShrink: 0,
  marginRight: '1rem'
}));

export const Icon = styled(Flex)(({ theme }: ThemeProps) => ({
  alignItems: 'center',
  color: theme.colors.placeholder,
  fontSize: theme.fontSizes.baseText,
  fontFamily: theme.fontFamilies.baseText,
  flexShrink: 0,
  marginLeft: '1rem'
}));

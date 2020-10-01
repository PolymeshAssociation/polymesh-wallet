import styled, { StyledProps } from 'styled-components';
import { Styles } from '../../styles/types';
import { Flex } from '../Flex';
import { BaseInputAreaProps } from './BaseInputAreaProps';

const getInputStyles: Styles<BaseInputAreaProps & { focused?: boolean }> = ({
  disabled,
  focused,
  invalid,
  readOnly,
  theme
}) => {
  if (disabled) {
    return {
      borderColor: theme.colors.disabled,
      backgroundColor: theme.colors.disabled
    };
  }

  if (readOnly) {
    return {
      borderColor: theme.colors.disabled,
      backgroundColor: theme.colors.disabled,
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

export const Wrapper = styled.label<StyledProps<BaseInputAreaProps>>((props) => ({
  ...{
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${props.theme.colors.placeholder}`,
    borderRadius: props.theme.radii[1],
    color: props.theme.colors.highlightText,
    backgroundColor: 'white'
  },
  ...getInputStyles(props)
}));

export const BaseInputStyle: Styles<BaseInputAreaProps> = ({ height, theme }) => ({
  display: 'block',
  width: '100%',
  flexGrow: 1,
  boxSizing: 'border-box',
  height: height,
  padding: '8px 8px 8px 8px',
  marginLeft: '2px',
  marginRight: '2px',
  backgroundColor: 'transparent',

  outline: 'none',
  color: 'inherit',
  fontSize: theme.fontSizes[1],
  fontFamily: theme.fontFamilies.baseText,
  border: 'none',
  borderBottom: '1px solid transparent',
  transition: `all ${theme.transitions.hover.ms}ms`,

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

export const Input = styled.textarea(BaseInputStyle);

export const Unit = styled(Flex)(({ theme }) => ({
  alignItems: 'center',
  color: theme.colors.placeholder,
  fontSize: theme.fontSizes.baseText,
  fontFamily: theme.fontFamilies.baseText,
  flexShrink: 0,
  marginRight: '1rem'
}));

export const Icon = styled(Flex)(({ theme }) => ({
  alignItems: 'center',
  color: theme.colors.placeholder,
  fontSize: theme.fontSizes.baseText,
  fontFamily: theme.fontFamilies.baseText,
  flexShrink: 0,
  marginLeft: '1rem'
}));

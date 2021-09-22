import styled, { DefaultTheme, StyledComponentProps } from 'styled-components';
import { color, ColorProps, fontFamily, FontFamilyProps, fontSize, FontSizeProps, fontWeight, FontWeightProps, letterSpacing, LetterSpacingProps, lineHeight, LineHeightProps, variant } from 'styled-system';

import { TFontWeightCustom, TTextVariant } from '../../components/themeDefinitions';
import { Box, BoxThemeProps } from '../Box';

const textStyle = variant({
  key: 'texts'
});

export type Props = {
  variant?: TTextVariant;
  fontWeight?: FontWeightProps['fontWeight'] | TFontWeightCustom;
  bold?: boolean;
} & BoxThemeProps &
ColorProps &
FontFamilyProps &
FontSizeProps &
LineHeightProps &
LetterSpacingProps;

export const TextComponent = styled(Box)<Props>(
  textStyle,
  color,
  fontFamily,
  fontWeight,
  lineHeight,
  fontSize,
  letterSpacing,
  (props) => ({
    ...(props.bold && fontWeight({ ...props, fontWeight: 'bold' })),
    overflowWrap: 'break-word'
  })
);

TextComponent.defaultProps = {
  as: 'span',
  variant: 'b1'
} as any;

export const Text = Object.assign(TextComponent, {
  defaultProps: TextComponent.defaultProps
});

export type TextProps = StyledComponentProps<
  typeof Text,
DefaultTheme,
Record<string, any>,
any
>;

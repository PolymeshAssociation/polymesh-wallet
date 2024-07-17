import type { CSSObject, DefaultTheme, StyledComponentProps } from 'styled-components';
import type { ColorProps, FontFamilyProps, FontSizeProps, FontWeightProps, LetterSpacingProps, LineHeightProps } from 'styled-system';
import type { TTextVariant } from '../../components/themeDefinitions';
import type { BoxThemeProps } from '../Box';

import styled from 'styled-components';
import { color, fontFamily, fontSize, fontWeight, letterSpacing, lineHeight, variant } from 'styled-system';

import { Box } from '../Box';

const textStyle = variant({
  key: 'texts'
});

export type Props = {
  variant?: TTextVariant;
  fontWeight?: FontWeightProps['fontWeight'];
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
    ...(props.bold && fontWeight({ ...props, fontWeight: 'bold' }) as CSSObject),
    overflowWrap: 'break-word'
  })
);

interface DefaultProps {
  as: string;
  variant: TTextVariant;
}

TextComponent.defaultProps = {
  as: 'span',
  variant: 'b1'
} as DefaultProps;

export const Text = Object.assign(TextComponent, {
  defaultProps: TextComponent.defaultProps
});

export type TextProps = StyledComponentProps<
  typeof TextComponent,
DefaultTheme,
Props,
keyof DefaultProps
>;

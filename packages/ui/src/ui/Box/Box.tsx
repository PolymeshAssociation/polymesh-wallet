import type { StyledComponentProps } from 'styled-components';
import type { BorderBottomProps, BorderColorProps, BorderLeftProps, BorderProps, BorderRadiusProps, BorderRightProps, BorderTopProps, BorderWidthProps, BoxShadowProps, ColorProps, HeightProps, LineHeightProps, MaxWidthProps, MinWidthProps, SpaceProps, TextAlignProps, WidthProps } from 'styled-system';
import type { ScaleProps } from '../../styles/themeTypes';
import type { Theme } from '../../types';

import { border, borderBottom, borderColor, borderLeft, borderRadius, borderRight, borderStyle, borderTop, borderWidth, boxShadow, color, height, lineHeight, minWidth, space, textAlign, width } from 'styled-system';

import { styled } from '../../styles';
import { MaxWidthScale } from '../../styles/utils';

export type BoxThemeProps = MinWidthProps &
MaxWidthProps &
WidthProps &
HeightProps &
LineHeightProps &
SpaceProps &
ColorProps &
BorderProps &
BorderTopProps &
BorderRightProps &
BorderBottomProps &
BorderLeftProps &
BorderColorProps &
BorderWidthProps &
BorderRadiusProps &
TextAlignProps &
BoxShadowProps &
ScaleProps;

export const Box = styled.div<BoxThemeProps>(
  minWidth,
  MaxWidthScale,
  width,
  height,
  lineHeight,
  textAlign,
  space,
  border,
  borderTop,
  borderRight,
  borderBottom,
  borderLeft,
  borderWidth,
  borderColor,
  borderRadius,
  borderStyle,
  color,
  boxShadow,
  {
    boxSizing: 'border-box'
  }
);

/* eslint-disable @typescript-eslint/no-explicit-any */
export type BoxProps = StyledComponentProps<
  typeof Box,
Theme,
Record<string, any>,
any
>;

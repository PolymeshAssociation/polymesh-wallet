import { StyledComponentProps } from 'styled-components';
import {
  border,
  borderBottom,
  BorderBottomProps,
  borderColor,
  BorderColorProps,
  borderLeft,
  BorderLeftProps,
  BorderProps,
  borderRadius,
  BorderRadiusProps,
  borderRight,
  BorderRightProps,
  borderStyle,
  borderTop,
  BorderTopProps,
  borderWidth,
  BorderWidthProps,
  boxShadow,
  BoxShadowProps,
  color,
  ColorProps,
  height,
  HeightProps,
  lineHeight,
  LineHeightProps,
  MaxWidthProps,
  minWidth,
  MinWidthProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  width,
  WidthProps,
} from 'styled-system';

import { styled } from '../../styles';
import { ScaleProps } from '../../styles/themeTypes';
import { MaxWidthScale } from '../../styles/utils';
import { Theme } from '../../types';

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
    boxSizing: 'border-box',
  }
);

export type BoxProps = StyledComponentProps<
  typeof Box,
  Theme,
  Record<string, any>,
  any
>;

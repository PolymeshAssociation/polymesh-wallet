import type { ColorProps, FontSizeProps, FontWeightProps, LetterSpacingProps, LineHeightProps } from 'styled-system';

import styled from 'styled-components';
import { color, fontSize, fontWeight, letterSpacing, lineHeight, variant } from 'styled-system';

import { Box } from '../Box';

const headingStyle = variant({
  key: 'headings'
});

export type HeadingProps = {
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
} & ColorProps &
FontWeightProps &
FontSizeProps &
LineHeightProps &
LetterSpacingProps;

const StyledHeading = styled(Box)<HeadingProps>`
  ${headingStyle};
  ${color};
  ${fontWeight};
  ${lineHeight};
  ${fontSize};
  ${letterSpacing}
`;

export const Heading = Object.assign(StyledHeading, {
  defaultProps: {
    as: 'h2',
    mb: 0,
    mt: 0,
    variant: 'h3'
  }
});

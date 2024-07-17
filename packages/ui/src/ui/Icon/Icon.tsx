/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
import type { CSSProperties, FC } from 'react';
import type { TLengthStyledSystem } from 'styled-system';
import type { BoxThemeProps } from '../Box';

import React from 'react';
import { color, height, width } from 'styled-system';

import { styled } from '../../styles';
import { Box } from '../Box';

export interface IconProps extends BoxThemeProps {
  Asset: React.ComponentType<React.SVGAttributes<SVGElement>>;
  width?: TLengthStyledSystem;
  height?: TLengthStyledSystem;
  scale?: number;
  rotate?: string;
  ariaLabel?: string;
  className?: string;
  onClick?: any;
  style?: CSSProperties;
  br?: any;
  id?: string;
}

const IconComponent: FC<IconProps> = ({ Asset,
  ariaLabel,
  bg,
  className,
  color,
  height,
  rotate, // Filter out prop coming from IconCircled component
  scale,
  width,
  ...props }) => {
  return (
    <Box
      as='span'
      className={className}
      {...props}
    >
      <Asset
        aria-label={ariaLabel}
        role='img'
      />
    </Box>
  );
};

export const Icon = styled(IconComponent)<IconProps>(
  color,
  width,
  height,
  ({ rotate, scale }) => ({
    display: 'inline-block',

    svg: {
      display: 'block',
      height: '100%',
      width: '100%',
      ...(scale && { padding: `${(1 - scale) * 100}%` }),
      ...(rotate && { transform: `rotateZ(${rotate})` })
    },
    verticalAlign: 'middle'

  })
);

Icon.defaultProps = {
  height: '1em',
  width: '1em'
};

import type React from 'react';

import styled from 'styled-components';

import { Icon } from '../Icon';

type IconProps = React.ComponentProps<typeof Icon>;

export const IconCircled = styled(Icon)<IconProps>({
  borderRadius: '50%'
});

IconCircled.defaultProps = {
  ...Icon.defaultProps,
  bg: 'brandLightest',
  height: 48,
  scale: 0.9,
  width: 48
};

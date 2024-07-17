import type { ComponentProps, FC } from 'react';

import React from 'react';
import styled from 'styled-components';

import { Text } from '@polymeshassociation/extension-ui/ui';

export const EllipsiedText = styled(Text)`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = { maxWidth?: number | string } & ComponentProps<typeof Text>;

export const TextOverflowEllipsis: FC<Props> = ({ children, ...textProps }) => (
  <EllipsiedText {...textProps}>{children}</EllipsiedText>
);

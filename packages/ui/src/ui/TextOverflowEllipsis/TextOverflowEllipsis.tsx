import { Text } from '@polymeshassociation/extension-ui/ui';
import React, { ComponentProps, FC } from 'react';
import styled from 'styled-components';

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

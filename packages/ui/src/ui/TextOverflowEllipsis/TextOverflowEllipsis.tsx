import { Text } from '@polymathnetwork/extension-ui/ui';
import React, { ComponentProps, PropsWithChildren } from 'react';
import styled from 'styled-components';

export const EllipsiedText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = PropsWithChildren<{ maxWidth: number | string }> &
ComponentProps<typeof Text>;

export function TextOverflowEllipsis (props: Props) {
  const { children, ...textProps } = props;

  return <EllipsiedText {...textProps}>{children}</EllipsiedText>;
}

import React from 'react';
import styled from 'styled-components';
import { alignItems, AlignItemsProps, alignSelf, AlignSelfProps, flex, flexDirection, FlexDirectionProps, FlexProps as CSSFlexProps, flexWrap, FlexWrapProps, justifyContent, JustifyContentProps } from 'styled-system';

import { Box, BoxProps } from '../Box';

export type FlexProps = BoxProps &
AlignItemsProps &
AlignSelfProps &
JustifyContentProps &
CSSFlexProps &
FlexDirectionProps &
FlexWrapProps;

export const Flex = styled(Box)<FlexProps>(flex, flexWrap, alignSelf, alignItems, flexDirection, justifyContent, {
  display: 'flex'
});

// TODO @grsmto: remove when https://github.com/pedronauck/docz/issues/337 is resolved
export const FlexDocz = (props: FlexProps) => {
  return <Flex {...props} />;
};

Flex.defaultProps = {
  alignItems: 'center'
};

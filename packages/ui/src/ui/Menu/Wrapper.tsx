import React from 'react';
import { Wrapper as ScWrapper } from 'react-aria-menubutton';
import { styled } from '@polymathnetwork/extension-ui/styles';

type Props = React.ComponentProps<typeof ScWrapper>;
export interface WrapperProps extends Props {
  onSelection: () => void;
}

// @ts-ignore
export const Wrapper: React.ReactElement<WrapperProps> = styled(ScWrapper)({
  position: 'relative',
  display: 'inline-block'
});

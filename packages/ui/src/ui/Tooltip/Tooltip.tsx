import Tippy from '@tippyjs/react';
import React, { FC } from 'react';

import { styled } from '../../styles';
import { TooltipDefaultProps, TooltipProps } from './definitions';
import { getVariant, TippyStyles, tooltipStyles } from './styles';

export const TooltipComponent: FC<TooltipProps> = ({ children, ...props }) => (
  <>
    <TippyStyles />
    <Tippy {...props}>
      <span>{children}</span>
    </Tippy>
  </>
);

TooltipComponent.defaultProps = TooltipDefaultProps;

export const Tooltip = styled(TooltipComponent)<TooltipProps>(
  tooltipStyles as any,
  getVariant
);

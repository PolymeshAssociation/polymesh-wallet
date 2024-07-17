import type { FC } from 'react';
import type { TooltipProps } from './definitions';

import Tippy from '@tippyjs/react';
import React from 'react';

import { styled } from '../../styles';
import { TooltipDefaultProps } from './definitions';
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
  tooltipStyles,
  getVariant
);

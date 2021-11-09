import { TippyProps } from '@tippyjs/react';
import { Ref } from 'react';

export type TooltipVariants = 'primary' | 'secondary' | 'raw';

export interface TooltipProps extends TippyProps {
  variant?: TooltipVariants;
  role?: string;
  className?: string;
  ref?: Ref<any>;
  children: any;
}

export const TooltipDefaultProps = {
  role: 'group',
  placement: 'top' as any,
  variant: 'primary' as TooltipVariants,
  animation: 'shift-away-subtle',
};

import { TippyProps } from '@tippyjs/react';
import { Ref } from 'react';

export type TooltipVariants = 'primary' | 'secondary' | 'raw';

export interface TooltipProps extends TippyProps {
  variant?: TooltipVariants;
  title?: string;
  role?: string;
  className?: string;
  ref?: Ref<any>;
  children: any;
}

export const TooltipDefaultProps = {
  role: 'group',
  placement: 'bottom' as any,
  variant: 'primary' as TooltipVariants,
};

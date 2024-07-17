import type { TippyProps } from '@tippyjs/react';
// import type { Ref } from 'react';

export type TooltipVariants = 'primary' | 'secondary' | 'raw';

export interface TooltipProps extends TippyProps {
  variant?: TooltipVariants;
  title?: string;
  role?: string;
}

export const TooltipDefaultProps = {
  animation: 'shift-away',
  placement: ('bottom' as TooltipProps['placement']),
  role: 'group',
  variant: ('primary' as TooltipVariants)
};

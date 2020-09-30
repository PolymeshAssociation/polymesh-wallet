import * as React from 'react';
export const SvgDot = (props: React.SVGProps<SVGSVGElement>) => (
  <svg height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}>
    <circle cx={12}
      cy={12}
      fill='currentColor'
      r={6} />
  </svg>
);

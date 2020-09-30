import * as React from 'react';
export const SvgArrowLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}>
    <path
      d='M20 11v2H8l5.5 5.5-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5 8 11h12z'
      fill='currentColor'
    />
  </svg>
);

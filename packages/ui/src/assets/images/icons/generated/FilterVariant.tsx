import * as React from 'react';
export const SvgFilterVariant = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}>
    <path
      d='M6 13h12v-2H6v2zM3 6v2h18V6H3zm7 12h4v-2h-4v2z'
      fill='currentColor'
    />
  </svg>
);

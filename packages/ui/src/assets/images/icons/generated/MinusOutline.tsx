import * as React from 'react';
export const SvgMinusOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}>
    <path
      clipRule='evenodd'
      d='M20 9v6H4V9h16zM6 11v2h12v-2H6z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </svg>
);

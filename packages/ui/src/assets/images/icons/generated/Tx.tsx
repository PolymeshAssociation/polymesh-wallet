import * as React from 'react';
export const SvgTx = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}>
    <path
      d='M5 7v2h2v8h2V9h2V7H5zM13 7l2 5-2 5h2l1-2.5 1 2.5h2l-2-5 2-5h-2l-1 2.5L15 7h-2z'
      fill='currentColor'
    />
  </svg>
);

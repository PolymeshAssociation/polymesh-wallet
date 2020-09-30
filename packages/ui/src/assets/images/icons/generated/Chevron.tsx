import * as React from 'react';
export const SvgChevron = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill='none'
    height='1em'
    viewBox='0 0 12 8'
    width='1em'
    {...props}>
    <path
      d='M1.41 7.41L6 2.83l4.59 4.58L12 6 6 0 0 6l1.41 1.41z'
      fill='currentColor'
    />
  </svg>
);

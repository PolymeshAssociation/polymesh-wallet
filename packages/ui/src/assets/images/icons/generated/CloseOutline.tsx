import * as React from 'react';

export const SvgCloseOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}
  >
    <path
      d='M3 16.74L7.76 12 3 7.26 7.26 3 12 7.76 16.74 3 21 7.26 16.24 12 21 16.74 16.74 21 12 16.24 7.26 21 3 16.74zm9-3.33l4.74 4.75 1.42-1.42L13.41 12l4.75-4.74-1.42-1.42L12 10.59 7.26 5.84 5.84 7.26 10.59 12l-4.75 4.74 1.42 1.42L12 13.41z'
      fill='currentColor'
    />
  </svg>
);

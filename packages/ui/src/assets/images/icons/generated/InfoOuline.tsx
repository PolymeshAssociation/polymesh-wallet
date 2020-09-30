import * as React from 'react';
export const SvgInfoOuline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}>
    <path
      clipRule='evenodd'
      d='M9 1h6v6H9V1zm2 2h2v2h-2V3zM6 15V9h9v8h3v6H6v-6h3v-2H6zm2-4h5v8h3v2H8v-2h3v-6H8v-2z'
      fill='currentColor'
      fillRule='evenodd'
    />
  </svg>
);

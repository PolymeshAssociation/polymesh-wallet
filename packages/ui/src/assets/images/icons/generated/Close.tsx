import * as React from 'react';
export const SvgClose = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-label='icon--close'
    fillRule='evenodd'
    height='1em'
    viewBox='0 0 10 10'
    width='1em'
    {...props}
  >
    <path
      d='M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z'
      fill='currentColor'
    />
  </svg>
);

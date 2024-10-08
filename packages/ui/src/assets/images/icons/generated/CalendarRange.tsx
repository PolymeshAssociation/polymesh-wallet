import * as React from 'react';

export const SvgCalendarRange = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}
  >
    <path
      d='M9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H5V8h14v11z'
      fill='currentColor'
    />
  </svg>
);

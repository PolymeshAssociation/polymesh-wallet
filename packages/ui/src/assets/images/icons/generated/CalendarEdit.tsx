import * as React from 'react';

export const SvgCalendarEdit = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    fill='none'
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    {...props}
  >
    <path
      d='M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h5v-2H5V8h14v1h2V5a2 2 0 00-2-2zm2.7 10.35l-1 1-2.05-2 1-1c.2-.21.54-.22.77 0l1.28 1.28c.19.2.19.52 0 .72zM12 18.94l6.07-6.06 2.05 2L14.06 21H12v-2.06z'
      fill='currentColor'
    />
  </svg>
);

import * as React from 'react';

export const SvgCog = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    height='1em'
    viewBox='0 0 16 16'
    width='1em'
    {...props}
  >
    <path
      d='M14.1 8c0-.3 0-.6-.1-1l2-1.7-1.7-2.7-2.3.8c-.6-.5-1.2-.9-1.9-1.1L9.6 0H6.4l-.5 2.2c-.7.3-1.4.7-1.9 1.2l-2.3-.8L0 5.3 1.9 7c0 .3-.1.6-.1 1s0 .6.1 1L0 10.7l1.7 2.7 2.3-.8c.6.5 1.2.9 1.9 1.1l.5 2.3h3.2l.5-2.2c.7-.3 1.3-.6 1.9-1.1l2.3.8 1.7-2.7L14.1 9V8zM8 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'
      fill='currentColor'
    />
  </svg>
);

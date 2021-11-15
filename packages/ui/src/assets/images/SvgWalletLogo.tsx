import * as React from 'react';

// eslint-disable-next-line
function SvgLogo(props: any) {
  return (
    <svg
      fill="none"
      height="1em"
      viewBox="0 0 80 80"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={40} cy={40} fill="#fff" r={40} />
      <g clipPath="url(#logo_svg__clip0)" fill="#EC4673">
        <path d="M40.001 72a32 32 0 1132-31.999A32.036 32.036 0 0140 72zm0-58.854a26.854 26.854 0 1026.853 26.855 26.885 26.885 0 00-26.853-26.855z" />
        <path d="M47.62 28.209c-1.978-1.306-4.44-1.717-7.91-1.717H32.66v2.089h6.904c3.134 0 5.074.299 6.639 1.307a5.05 5.05 0 012.387 4.514 5.151 5.151 0 01-2.2 4.404c-1.345.932-2.987 1.419-6.83 1.419h-6.9v13.282h2.277V42.24h4.365c3.695 0 6.418-.373 8.433-1.754a7.17 7.17 0 003.173-6.156 7.02 7.02 0 00-3.29-6.12z" />
      </g>
      <defs>
        <clipPath id="logo_svg__clip0">
          <path d="M0 0h64v64H0z" fill="#fff" transform="translate(8 8)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgLogo;

import * as React from "react";

export function SvgLedgerLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M20.08 0H9.125v14.781h14.781V3.828A3.82 3.82 0 0020.079 0zM5.711 0H3.828A3.82 3.82 0 000 3.828v1.884h5.712V0zM0 9.126h5.712v5.711H0V9.126zm18.256 14.781h1.884a3.82 3.82 0 003.827-3.828v-1.823h-5.711v5.651zm-9.13-5.651h5.711v5.711H9.126v-5.711zm-9.126 0v1.884a3.82 3.82 0 003.828 3.827h1.884v-5.711H0z"
        fill="currentColor"
      />
    </svg>
  );
}
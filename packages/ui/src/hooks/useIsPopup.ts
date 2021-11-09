import { useMemo } from 'react';

export default function useIsPopup(): boolean {
  return useMemo(() => {
    // @TODO adjust this whenever we readjust width.
    return window.innerWidth <= 400;
  }, []);
}

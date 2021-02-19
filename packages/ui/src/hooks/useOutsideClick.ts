import { RefObject, useCallback, useEffect } from 'react';

export default function useOutsideClick (ref: RefObject<HTMLDivElement>, callback: () => void): void {
  const handleClick = useCallback((e: MouseEvent): void => {
    if (ref.current && !ref.current.contains(e.target as HTMLInputElement)) {
      callback();
    }
  }, [callback, ref]);

  useEffect(() => {
    document.addEventListener('click', handleClick);

    return (): void => {
      document.removeEventListener('click', handleClick);
    };
  });
}

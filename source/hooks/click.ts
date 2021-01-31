import { RefObject, useEffect } from 'react';

export const useOnClickOutside = ({ current: element }: RefObject<any>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (element && !element.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [callback, element]);
};

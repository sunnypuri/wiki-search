import { useEffect, useRef } from 'react';

const useFocusOut = (onFocusOut: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFocusOut = (event: FocusEvent) => {
      if (ref.current && !ref.current.contains(event.relatedTarget as Node)) {
        setTimeout(onFocusOut, 100)
      }
    };

    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [onFocusOut]);

  return ref;
};

export default useFocusOut;

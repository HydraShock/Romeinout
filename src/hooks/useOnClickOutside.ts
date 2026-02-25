import { useEffect, type RefObject } from 'react';

type PointerEvent = MouseEvent | TouchEvent;

export default function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: (event: PointerEvent) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    const handleEvent = (event: PointerEvent) => {
      const node = ref.current;
      if (!node || node.contains(event.target as Node)) {
        return;
      }
      onClickOutside(event);
    };

    document.addEventListener('mousedown', handleEvent);
    document.addEventListener('touchstart', handleEvent, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleEvent);
      document.removeEventListener('touchstart', handleEvent);
    };
  }, [enabled, onClickOutside, ref]);
}

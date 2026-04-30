import { useCallback, useRef } from "react";

/**
 * Returns a ref callback that fires `onIntersect` when the observed
 * element enters the viewport. Disables itself while `disabled` is true.
 */
export function useIntersectionObserver(
  onIntersect: () => void,
  disabled: boolean,
) {
  const observer = useRef<IntersectionObserver | null>(null);

  return useCallback(
    (node: HTMLDivElement | null) => {
      if (disabled) return;
      observer.current?.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      });

      if (node) observer.current.observe(node);
    },
    [disabled, onIntersect],
  );
}

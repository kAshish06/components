import React, { type RefObject } from "react";

/**
 *
 * @param elementRef Origin element
 * @param handler - should be called when when a click happens outside the boundary of elementRef
 */
export default function useClickOutside(
  elementRef: RefObject<HTMLElement | null>,
  handler: (e: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    if (elementRef?.current) {
      const clickHandler = (e: MouseEvent | TouchEvent) => {
        if (
          typeof handler === "function" &&
          !elementRef.current?.contains(e?.target as Node)
        )
          handler(e);
      };
      window.addEventListener("click", clickHandler);
      return () => window.removeEventListener("click", clickHandler);
    }
  });
}

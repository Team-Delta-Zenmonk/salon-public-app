import { useEffect } from "react";

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (!lock || typeof document === "undefined") return;

    const docEl = document.documentElement;
    const body = document.body;

    const scrollbarWidth = window.innerWidth - docEl.clientWidth;
    const prevBodyOverflowY = body.style.overflowY;
    const prevBodyPaddingRight = body.style.paddingRight;
    const prevHtmlOverflowY = docEl.style.overflowY;

    body.style.overflowY = "hidden";
    docEl.style.overflowY = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflowY = prevBodyOverflowY;
      body.style.paddingRight = prevBodyPaddingRight;
      docEl.style.overflowY = prevHtmlOverflowY;
    };
  }, [lock]);
}

export default useScrollLock;

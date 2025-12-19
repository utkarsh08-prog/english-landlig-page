import { useEffect, useState } from "react";

export default function useStickyTimerBar(refId) {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    function onScroll() {
      const section = document.getElementById(refId);
      if (!section) return;

      const rect = section.getBoundingClientRect();
      if (rect.top < -20) setSticky(true);      // section screen से ऊपर चला गया
      else setSticky(false);                   // वापस दिख रहा है
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // call once to initialize
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [refId]);

  return sticky;
}

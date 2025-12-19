import React, { useEffect, useState } from "react";
import useSoldOutProgress from "../hooks/useSoldOutProgress";

export default function SoldOutBar() {
  const progress = Number(useSoldOutProgress());

  // Sticky behavior state
  const [isSticky, setSticky] = useState(false);

  // progress driven by useSoldOutProgress hook (stored in localStorage.soldOutPercent)

  // Scroll listener to toggle sticky on scroll up
  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastScroll = window.scrollY || 0;

    const onScroll = () => {
      const currentScroll = window.scrollY || 0;
      const delta = lastScroll - currentScroll; // positive if scrolling up

      // If user scrolled up more than 10px and is past threshold, show sticky
      if (delta > 10 && currentScroll > 150) {
        if (!isSticky) {
          // small debug log to help verify behavior during testing
          // eslint-disable-next-line no-console
          console.debug("SoldOutBar: activating sticky (scroll up)");
        }
        setSticky(true);
      } else if (delta < -10) {
        // user scrolled down significantly -> hide
        if (isSticky) {
          // eslint-disable-next-line no-console
          console.debug("SoldOutBar: deactivating sticky (scroll down)");
        }
        setSticky(false);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`soldout-bar-container transition-all duration-500 w-full bg-white py-3 border-b border-yellow-300 relative ${isSticky ? "fixed top-0 left-0 w-full z-[9999] shadow-lg" : ""}`}>

      <div className="text-center text-yellow-800 font-semibold text-sm md:text-base mb-1">
        <span className="blink-dot" aria-hidden="true" />
        Slots Filling Fast – Limited Seats
      </div>

      <div className="h-4 w-[85%] mx-auto bg-gray-200 rounded-full overflow-hidden border border-yellow-300 shadow-[inset_0_0_6px_rgba(0,0,0,0.2)]">
        <div
          className="h-full rounded-full soldProgress"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      <div className="text-center mt-1 text-xs font-medium text-yellow-700">
        {Number(progress).toFixed(1)}% Sold Out
      </div>
    </div>
  );
}
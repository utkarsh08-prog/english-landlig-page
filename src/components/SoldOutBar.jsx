import React, { useEffect, useState } from "react";
import useSoldOutProgress from "../hooks/useSoldOutProgress";

export default function SoldOutBar() {
  const progress = Number(useSoldOutProgress());

  // Sticky behavior state
  const [isSticky, setSticky] = useState(false);

  // Social proof bar data from backend
  const [barData, setBarData] = useState({
    noticeText: "Slots Filling Fast – Limited Seats",
    noticeTextColor: "#92400E",
    progressBarBg: "#FACC15",
    progressTrackBg: "#FEF3C7",
    progressLabel: "{progress}% Sold Out",
    progressLabelColor: "#92400E"
  });

  // progress driven by useSoldOutProgress hook (stored in localStorage.soldOutPercent)

  // Fetch social proof bar data from backend
  useEffect(() => {
    const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "http://localhost:5000";
    const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || "";

    const headers = { "Content-Type": "application/json" };
    if (ADMIN_API_KEY) headers["x-api-key"] = ADMIN_API_KEY;

    fetch(`${ADMIN_API_URL}/api/sections/social_proof_bar`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((section) => {
        if (!section || !section.extraData) return;
        const { noticeText, noticeTextColor, progressBarBg, progressTrackBg, progressLabel, progressLabelColor } = section.extraData;
        
        setBarData({
          noticeText: noticeText || "Slots Filling Fast – Limited Seats",
          noticeTextColor: noticeTextColor || "#92400E",
          progressBarBg: progressBarBg || "#FACC15",
          progressTrackBg: progressTrackBg || "#FEF3C7",
          progressLabel: progressLabel || "{progress}% Sold Out",
          progressLabelColor: progressLabelColor || "#92400E"
        });
      })
      .catch((err) => {
        console.warn("Failed to fetch social proof bar:", err.message || err);
      });
  }, []);

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

  const displayLabel = barData.progressLabel.replace(/\{progress\}/g, Number(progress).toFixed(1));

  return (
    <div className={`soldout-bar-container transition-all duration-500 w-full bg-white py-3 border-b border-yellow-300 relative ${isSticky ? "fixed top-0 left-0 w-full z-[9999] shadow-lg" : ""}`}>

      <div className="text-center font-semibold text-sm md:text-base mb-1" style={{ color: barData.noticeTextColor }}>
        <span className="blink-dot" aria-hidden="true" />
        {barData.noticeText}
      </div>

      <div className="h-4 w-[85%] mx-auto rounded-full overflow-hidden border border-yellow-300 shadow-[inset_0_0_6px_rgba(0,0,0,0.2)]" style={{ backgroundColor: barData.progressTrackBg }}>
        <div
          className="h-full rounded-full soldProgress"
          style={{ 
            width: `${Math.max(0, Math.min(100, progress))}%`,
            backgroundColor: barData.progressBarBg
          }}
        />
      </div>

      <div className="text-center mt-1 text-xs font-medium" style={{ color: barData.progressLabelColor }}>
        {displayLabel}
      </div>
    </div>
  );
}
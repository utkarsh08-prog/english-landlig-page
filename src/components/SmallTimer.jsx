import React from "react";

export default function SmallTimer({ visible, time }) {
  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-20 bg-black text-yellow-400 px-4 py-2 rounded-xl shadow-xl border border-yellow-500 z-[9999] animate-pulse">
      ⏳ Offer Ends In: <span className="font-bold">{time}</span>
    </div>
  );
}

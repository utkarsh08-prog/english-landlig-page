import React from "react";

export default function AppLoader({ loading }) {
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999]">
      <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

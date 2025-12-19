import React from "react";

const Loader = ({ text = "Please wait…" }) => (
  <div className="flex items-center gap-2">
    <div className="h-4 w-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-sm text-yellow-600 font-semibold">{text}</span>
  </div>
);

export default Loader;

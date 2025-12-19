import React, { useEffect } from "react";

export default function StickySoldTimer({ timeLeft, format, sold }) {
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 350) setShow(true);
      else setShow(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // initialize
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-black/95 text-white py-2 px-4 
                    flex justify-between items-center z-[9999] border-b border-yellow-500 shadow-lg">

      <div className="flex items-center gap-3">
        <div className="bg-red-600 px-3 py-1 rounded-full font-bold shadow-lg">
          Sold Out {sold}%
        </div>

        <div className="w-[140px] h-3 bg-gray-700 rounded-full overflow-hidden">
          <div style={{ width: sold + "%" }}
               className="h-full bg-gradient-to-r from-yellow-300 to-orange-500 rounded-full animate-pulse"/>
        </div>
      </div>

      <div className="text-yellow-300 font-semibold flex items-center gap-1">
        ⏳ {format(timeLeft)}
      </div>
    </div>
  );
}

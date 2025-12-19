import React from "react";

export default function GuaranteePopup({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[99999] animate-popupFade">
      <div className="bg-white w-[90%] max-w-md p-7 rounded-2xl text-center shadow-2xl border border-yellow-400 relative">

        <h2 className="text-xl font-bold text-yellow-700 mb-3">
          Try It Completely Risk-Free!
        </h2>

        <p className="text-zinc-700 font-medium leading-relaxed">
          There’s a full Money-Back Guarantee 🛡 <br />
          Take the trial<span className="text-yellow-600 font-semibold">—Zero risk, Full Value.</span> 🔥
        </p>

        <button
          onClick={onClose}
          className="mt-6 px-8 py-3 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-xl font-bold text-black shadow-lg hover:scale-105 transition-all duration-300"
        >
          Yes, I Want To Try!
        </button>

      </div>

      <style>{`
        @keyframes popupFade {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-popupFade {
          animation: popupFade .35s ease-out;
        }
      `}</style>
    </div>
  );
}

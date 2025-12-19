import React, { useState } from "react";
import Loader from "./components/Loader";

// expose a global helper that dispatches a CustomEvent used for a full-page loader
window.globalLoading = (status) => {
  const event = new CustomEvent("globalLoading", { detail: status });
  window.dispatchEvent(event);
};

// Helper to dynamically load Razorpay script
function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay script failed to load"));
    document.head.appendChild(script);
  });
}

const RegisterButton = ({ amount = 99, className = "btn", label = "Register Now At ₹99/- Only" }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    window.globalLoading(true);
    try {
      await loadRazorpayScript();

      // 1️⃣ Create order on backend
      const res = await fetch("https://main-backend-dzf5.onrender.com/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      // 2️⃣ Open Razorpay checkout (testing options)
      const options = {
        key: "rzp_test_RfEZA7cY0icEUx",
        amount: order.amount, // amount from backend (in paise)
        currency: "INR",
        name: "Arunn Guptaa",
        description: "1-on-1 Guidance Session",
        order_id: order.id,
        handler: async function (response) {
          // After successful payment, open the Calendly scheduler popup (can't access iframe internals)
          try {
            alert("Payment Successful! Opening Calendly to confirm your slot.");
            if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
              window.Calendly.initPopupWidget({ url: "https://calendly.com/linksvardha/60min" });
            } else {
              window.open("https://calendly.com/linksvardha/60min", "_blank");
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
            window.globalLoading(false);
          }
        },
        theme: { color: "#F6C84C" },
      };


      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Could not initiate payment: " + (err.message || err));
      setLoading(false);
      window.globalLoading(false);
    }
  };

  const disabledAttr = loading ? { disabled: true } : {};

  const baseBtnClasses = `relative text-black font-extrabold rounded-3xl bg-gradient-to-r from-[#FFD700] to-[#FFB300] shadow-[0_0_15px_rgba(255,200,0,0.8)] hover:shadow-[0_0_30px_rgba(255,200,0,1)] transition-all duration-300 hover:scale-105 animate-pulseGlow overflow-hidden`;
  const mergedClass = `${className ? className + ' ' : ''}${baseBtnClasses} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`;

  return (
    <>
      <button
        onClick={handlePayment}
        className={mergedClass}
        {...disabledAttr}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <>
            <span className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 rotate-12 animate-shine" />

            <span className="flex items-center gap-2 relative z-10">
              {label ?? `Register Now @ ₹${amount}`}
              <span className="text-sm font-semibold px-2 py-0.5 bg-red-600 text-yellow-300 rounded-md animate-priceBlink">Limited</span>
              <span className="text-xl animate-arrowMove">👈</span>
            </span>
          </>
        )}
      </button>

      <style>{`
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 12px rgba(255,200,0,0.35); }
          50% { box-shadow: 0 0 22px rgba(255,200,0,0.6); }
          100% { box-shadow: 0 0 12px rgba(255,200,0,0.35); }
        }
        .animate-pulseGlow { animation: pulseGlow 2.2s ease-in-out infinite; }

        @keyframes shine {
          0% { transform: translateX(-120%) rotate(12deg); opacity: 0; }
          50% { transform: translateX(120%) rotate(12deg); opacity: 0.7; }
          100% { transform: translateX(240%) rotate(12deg); opacity: 0; }
        }
        .animate-shine { animation: shine 1.8s linear infinite; }

        @keyframes priceBlink {
          0% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.6; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-priceBlink { animation: priceBlink 1.6s ease-in-out infinite; }

        @keyframes arrowMove {
          0% { transform: translateX(0); }
          50% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
        .animate-arrowMove { display: inline-block; animation: arrowMove 1s ease-in-out infinite; }
      `}</style>
    </>
  );
};

export default RegisterButton;
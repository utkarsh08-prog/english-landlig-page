import React, { useEffect, useState } from "react";

export default function SessionBooking() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure Calendly script is loaded once
    const src = "https://assets.calendly.com/assets/external/widget.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (!existing) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    }

    return () => {
      // nothing to cleanup for Calendly script; keep it if already loaded
    };
  }, []);

  async function openPayment() {
    try {
      setLoading(true);

      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://checkout.razorpay.com/v1/checkout.js";
          s.async = true;
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      const backend = import.meta.env.VITE_BACKEND_URL || "https://main-backend-dzf5.onrender.com";
      // amount in paise (₹99 => 9900)
      const res = await fetch(`${backend.replace(/\/$/,"")}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 9900 })
      });

      if (!res.ok) throw new Error("Failed to create order");
      const order = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_RfEZA7cY0icEUx",
        amount: order.amount,
        currency: "INR",
        name: import.meta.env.VITE_PRODUCT_NAME || "Session",
        description: "1-on-1 Guidance Session",
        order_id: order.id,
        handler: function (response) {
          try {
            // After successful payment, open Calendly popup to let user confirm the slot.
            alert("Payment successful — please confirm your slot in the Calendly popup.");
            if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
              window.Calendly.initPopupWidget({ url: "https://calendly.com/linksvardha/60min" });
            } else {
              window.open("https://calendly.com/linksvardha/60min", "_blank");
            }
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#F6C84C" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Payment failed. Try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-yellow-700">Book Your Session</h1>

        <div className="mb-4">
          <button
            onClick={openPayment}
            disabled={loading}
            className="w-full md:w-1/2 mx-auto block bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-6 rounded-lg shadow"
          >
            {loading ? "Processing…" : "Pay ₹99 to Confirm Session"}
          </button>
          <p className="text-center mt-2 text-zinc-600 text-sm">* Fees refundable if you aren't satisfied</p>
        </div>

        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/linksvardha/60min"
          style={{ minWidth: "100%", height: "700px" }}
        ></div>

        <p className="text-center mt-6 text-zinc-600 text-sm">If the scheduler above doesn't appear, open the Calendly link directly: <a className="text-yellow-700 underline" href="https://calendly.com/linksvardha/60min" target="_blank" rel="noreferrer">Calendly — 60min</a></p>
      </div>
    </div>
  );
}

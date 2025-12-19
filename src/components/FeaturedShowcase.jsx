import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/featured1.png",
  "/featured2.png",
  "/featured3.png",
  "/featured4.png",
  "/featured5.png",
  "/featured6.jpg",
  "/featured7.jpg",
  "/featured8.jpg",
];

export default function FeaturedShowcase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000); // ⏱ Change delay here (2000 = 2 seconds)

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 text-center bg-white border-t border-yellow-200">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-700">
        Featured In
      </h2>

      <div className="flex justify-center">
        <div className="w-[280px] md:w-[360px] h-[120px] md:h-[160px] relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={images[index]}
              alt="Featured Logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.7 }}
              className="object-contain max-h-full max-w-full"
            />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

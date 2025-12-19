import React, { useEffect, useRef, useState } from "react";

export default function FeaturedCarousel() {
  const images = [
    "/featured1.png",
    "/featured3.png",
    "/featured4.png",
    "/featured5.png",
    "/featured6.jpg",
    "/featured7.jpg",
    "/featured8.jpg",
    "/featured2.png"
  ];

  const [index, setIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2300); // 2.3 seconds premium delay
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white text-black text-center border-t border-yellow-200">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-yellow-700">
        Featured In
      </h2>

      {/* Full-width wrapper so slides can align exactly */}
      <div className="overflow-hidden w-full">
        {/* TRACK */}
           <div
             className="flex gap-2 transition-transform duration-[1300ms] ease-[cubic-bezier(0.65,0,0.35,1)] w-full"
          ref={containerRef}
          style={{
            transform: `translateX(-${index * (100 / 3)}%)`
          }}
        >
          {/* CLONE IMAGES TWICE FOR INFINITE LOOP */}
             {[...images, ...images].map((img, i) => (
              <div key={i} className="w-1/3 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={img}
                    className="max-w-full h-[200px] md:h-[260px] object-contain transition-all duration-300 mx-auto"
                    alt="featured"
                  />
              </div>
             ))}
        </div>
      </div>
    </section>
  );
}

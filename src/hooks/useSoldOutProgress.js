import { useEffect, useState } from "react";

export default function useSoldOutProgress() {
  const [percent, setPercent] = useState(90);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("soldOutPercent");
      const initial = saved ? Number(saved) : 91;
      setPercent(initial);
    } catch (e) {
      setPercent(91);
    }

    const MAX = 100;
    const inc = setInterval(() => {
      setPercent((p) => {
        // two-phase growth: faster under 98, then slow up to 100
        const delta = p < 98 ? Math.random() * 0.5 : Math.random() * 0.18;
        const np = Math.min(p + delta, MAX);
        try {
          localStorage.setItem("soldOutPercent", np.toFixed(2));
        } catch (e) {}
        return np;
      });
    }, 5000);

    return () => clearInterval(inc);
  }, []);

  return Number(percent.toFixed(2));
}

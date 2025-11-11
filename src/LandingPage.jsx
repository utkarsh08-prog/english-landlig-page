// Refactor: structured into reusable components, unified buttons, custom hooks, and clearer layout
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Target, Layers, TrendingUp, Users, Lightbulb, CheckCircle } from "lucide-react";

/*********************************
 * Shared UI
 *********************************/
function PrimaryButton({ label = "Register Now At ₹99/- Only", className = "", ...props }) {
  return (
    <button
      className={
        "px-8 py-3 md:px-12 md:py-4 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-semibold " +
        "text-sm md:text-base rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition " +
        className
      }
      {...props}
    >
      {label}
    </button>
  );
}

/*********************************
 * Utilities & Hooks
 *********************************/
const safeStorage = {
  get(key) {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
};

function useOfferTimer() {
  const DURATION = 15 * 60 * 1000; // 15 minutes in ms
  const [timeLeft, setTimeLeft] = useState(DURATION);

  useEffect(() => {
    // initialize stored end time if missing
    const now = Date.now();
    const stored = safeStorage.get("offerTimerEnd");
    if (!stored) safeStorage.set("offerTimerEnd", String(now + DURATION));

    const id = setInterval(() => {
      try {
        const storedNow = safeStorage.get("offerTimerEnd");
        const endTime = storedNow ? parseInt(storedNow, 10) : Date.now() + DURATION;
        const diff = endTime - Date.now();

        if (diff <= 0) {
          // timer ended — restart it by setting a new end time
          const newEnd = Date.now() + DURATION;
          safeStorage.set("offerTimerEnd", String(newEnd));
          setTimeLeft(DURATION);
        } else {
          setTimeLeft(diff);
        }
      } catch (e) {
        // fallback: just set remaining to DURATION
        setTimeLeft(DURATION);
      }
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const format = useCallback((ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }, []);

  const miniMinutes = String(Math.floor(timeLeft / 1000 / 60)).padStart(2, "0");
  const miniSeconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, "0");

  return { timeLeft, format, miniMinutes, miniSeconds };
}

function useProgressBar() {
  useEffect(() => {
    const bar = document.getElementById("progressBar");
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const scrolled = total > 0 ? (window.scrollY / total) * 100 : 0;
      if (bar) bar.style.width = scrolled + "%";
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}

function useLiveViewers(elementId) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(elementId);
    if (!el) return;

    const id = setInterval(() => {
      const num = Math.floor(Math.random() * (120 - 40 + 1)) + 40;
      el.textContent = String(num);
    }, 4000);

    return () => clearInterval(id);
  }, [elementId]);
}

/*********************************
 * Small Components
 *********************************/
function ProgressBar() {
  useProgressBar();
  return (
    <div
      id="progressBar"
      className="fixed top-0 left-0 h-1 bg-yellow-500 z-50 transition-all duration-300"
    />
  );
}

function ExitPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.clientY < 10) setOpen(true);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-yellow-300">
        <h3 className="text-2xl font-bold mb-4 text-yellow-700">Wait! Before You Leave</h3>
        <p className="text-zinc-700 mb-6">
          Your ₹99 Guidance session is still available. Don't miss this chance!
        </p>
        <PrimaryButton label="Continue" onClick={() => setOpen(false)} />
      </div>
    </div>
  );
}

function LiveTodayBanner() {
  useLiveViewers("liveViewers");

  return (
    <section className="w-full px-6 mt-6 mb-10 flex flex-col items-center text-center">
      <div className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded-2xl shadow-lg max-w-2xl w-full text-sm md:text-base font-semibold tracking-wide border border-yellow-300/40">
        <>
          <span className="flex justify-center items-center gap-2 mb-1">
            <span className="h-3 w-3 bg-red-500 rounded-full animate-ping" />
            <span className="text-red-600 font-bold">LIVE TODAY</span>
          </span>

          <span className="font-bold">1-on-1 Private Business Guidance Session</span>
          <br />
          <span className="opacity-90 text-sm">(Only a few slots left)</span>

          <div className="mt-1 text-xs text-red-600 font-semibold">
            👁️ <span id="liveViewers">57</span> people viewing right now
          </div>
        </>
      </div>
    </section>
  );
}

export { PrimaryButton };
/*********************************
 * Stats Strip
 *********************************/
function StatsStrip() {
  return (
    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-zinc-600 text-sm">
      <div className="p-6 rounded-2xl bg-white shadow-lg border border-yellow-200 text-black font-semibold">
        10k+ Founders Trained
      </div>
      <div className="p-6 rounded-2xl bg-white shadow-lg border border-yellow-200 text-black font-semibold">
        4.9★ Avg Rating
      </div>
      <div className="p-6 rounded-2xl bg-white shadow-lg border border-yellow-200 text-black font-semibold">
        200+ Case Studies
      </div>
      <div className="p-6 rounded-2xl bg-white shadow-lg border border-yellow-200 text-black font-semibold">
        ₹100Cr+ Results
      </div>
    </div>
  );
}

/*********************************
 * HERO SECTION
 *********************************/
function Hero({ parallaxY }) {
  return (
    <section
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-white relative overflow-hidden"
      data-testid="hero"
    >
      {/* Soft glow backgrounds */}
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full 
        bg-[radial-gradient(circle_at_center,rgba(255,221,87,0.35),transparent_60%)]"
      />
      <motion.div
        style={{ y: parallaxY }}
        className="pointer-events-none absolute -bottom-32 left-[-10%] h-[380px] w-[380px] rounded-full 
        bg-[radial-gradient(circle_at_center,rgba(255,187,0,0.18),transparent_60%)]"
      />

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-yellow-700 max-w-4xl leading-tight"
      >
        Transform Your Business With Personal 1-on-1 Guidance
      </motion.h1>

      {/* Subline */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg md:text-2xl text-zinc-700 mt-4 max-w-2xl"
      >
        Get clarity, strategy & direction tailored exactly for YOUR business.
      </motion.p>

      {/* Stats */}
      <StatsStrip />

      {/* CTA Button */}
      <PrimaryButton className="mt-12" />
    </section>
  );
}

/*********************************
 * SUCCESS MARQUEE
 *********************************/
function SuccessMarquee() {
  return (
    <div className="w-full bg-transparent py-3 text-center text-yellow-800 font-semibold text-sm md:text-base border-t border-yellow-300">
      🚀 47 Entrepreneurs Joined in the Last 2 Hours • 98% Satisfaction • Last Registration 3 Minutes Ago
    </div>
  );
}

/*********************************
 * SESSION EXPLAINER
 *********************************/
function SessionExplainer({ miniMinutes, miniSeconds }) {
  return (
    <section className="py-20 px-6 bg-white text-black" data-testid="coach-intro">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* Bullet Points */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-yellow-200">
          <h2 className="text-2xl font-bold mb-4">What Happens In Your 1-on-1 Session?</h2>

          <ul className="space-y-3 text-zinc-600 text-lg">
            <li>● You Get <span className="font-semibold text-yellow-800">Personal Attention</span> on your exact business challenges</li>
            <li>● You Receive a <span className="font-semibold text-yellow-800">Custom Growth Plan</span> designed only for your business</li>
            <li>● You Discover <span className="font-semibold text-yellow-800">specific action steps</span> for revenue, team & systems</li>
            <li>● You Walk Away With a <span className="font-semibold text-yellow-800">clear 30-day action roadmap</span></li>
            <li>● <span className="font-semibold text-yellow-800">1 Hour</span> That Can Change the Way You Run Your Business</li>
          </ul>
        </div>

        {/* Coach Image */}
        <div className="flex justify-center bg-white p-4 rounded-2xl shadow-lg">
          <img src="./coach.png" alt="Coach" className="rounded-2xl w-full max-w-sm shadow-2xl" />
        </div>
      </div>

      {/* Coach Info */}
      <div className="max-w-3xl mx-auto mt-12 text-center">
        <p className="text-zinc-600 mb-2">This is a Private 1-on-1 Guidance Session</p>

        <h2 className="text-4xl font-bold">Arunn Guptaa</h2>
        <p className="text-lg text-zinc-600 mt-2">India's Emerging Business Growth Coach</p>
        <p className="mt-4 text-zinc-600">Guided and Mentored Business Owners to Build Profitable & Scalable Enterprises</p>

        {/* Rating Block + Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-fit mb-8 mx-auto">
          <div className="flex items-center gap-4 bg-zinc-900 px-5 py-4 rounded-xl border border-zinc-800 shadow-lg w-full sm:w-auto">
            <span className="text-yellow-400 text-2xl sm:text-xl">★★★★★</span>
            <p className="text-zinc-300 text-base sm:text-sm text-center sm:text-left">
              70,000+ People Rated
              <br className="block sm:hidden" />
              <span className="block">My Programs with 4.96 Star</span>
            </p>
          </div>

          <PrimaryButton className="sm:ml-2 w-full sm:w-auto mt-2 sm:mt-0" />
        </div>

        {/* Timer */}
        <div className="mt-10">
          <p className="text-lg mb-4">Register in next</p>

          <div className="flex justify-center gap-6">
            <div className="bg-black text-white px-6 py-4 rounded-xl border border-white/40 shadow-xl text-center">
              <p className="text-4xl font-bold">{miniMinutes}</p>
              <span className="block text-sm mt-1">Minutes</span>
            </div>

            <div className="bg-black text-white px-6 py-4 rounded-xl border border-white/40 shadow-xl text-center">
              <p className="text-4xl font-bold">{miniSeconds}</p>
              <span className="block text-sm mt-1">Seconds</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { StatsStrip };
/*********************************
 * FEATURED LOGOS
 *********************************/
function FeaturedLogos() {
  return (
    <section
      className="py-16 text-center bg-black text-black border-t border-yellow-200"
      data-testid="featured"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-700">Featured In</h2>

      {/* Featured image */}
      <div className="flex flex-wrap justify-center gap-10 opacity-90 text-lg font-semibold tracking-wide">
        <img
          src="./featured.png"
          alt="Featured in"
          className="mx-auto w-full max-w-3xl h-auto object-contain"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    </section>
  );
}

/*********************************
 * BUSINESS TRANSFORMATION GRAPH
 *********************************/
function TransformGraph() {
  return (
    <section
      className="py-24 bg-white text-black text-center relative overflow-hidden border-t border-yellow-200"
      data-testid="business-transform"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.18 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,80,0.35),transparent_75%)]"
      />

      <h2 className="text-3xl md:text-4xl font-extrabold mb-14 relative z-10 text-yellow-700 drop-shadow">
        How Your Business Will Transform With 1-on-1 Guidance
      </h2>

      <div className="relative flex justify-center items-center w-full max-w-3xl mx-auto h-[380px] md:h-[420px] z-10">

        {/* Center bubble */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute w-44 h-44 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-full 
          flex items-center justify-center shadow-2xl border-4 border-yellow-600 text-black font-bold text-lg"
        >
          Business<br />Breakthrough
        </motion.div>

        {/* Top */}
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute -top-4 bg-white p-4 rounded-xl shadow-lg border border-yellow-300 font-semibold text-yellow-700"
        >
          Right Mindset
        </motion.div>

        {/* Left */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute left-0 md:-left-10 bg-white p-4 rounded-xl shadow-lg border border-yellow-300 font-semibold text-yellow-700"
        >
          <>Improved<br/>Systems</>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="absolute right-0 md:-right-10 bg-white p-4 rounded-xl shadow-lg border border-yellow-300 font-semibold text-yellow-700"
        >
          <>Better<br/>Strategies</>
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute -bottom-4 bg-white p-4 rounded-xl shadow-lg border border-yellow-300 font-semibold text-yellow-700"
        >
          High Team Performance
        </motion.div>

      </div>

      <PrimaryButton className="mt-14" />
    </section>
  );
}

/*********************************
 * WHAT YOU WILL LEARN (1 Hr)
 *********************************/
function LearnSection() {
  const list = [
    "How To Build A Growth-Focused, High-Performance Business.",
    "The Difference Between Growth Businesses & Survival Businesses.",
    "Why Most Business Owners Get Stuck — And How To Break Through.",
    "The Focus Areas Required To Build A Scalable Growth Machine.",
  ];

  return (
    <section
      className="py-20 bg-white text-black px-6 border-t border-yellow-200"
      data-testid="learn-1hr"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-yellow-700">
        What You Will Learn In<br />1 Hr
      </h2>

      <div className="w-20 h-1 bg-yellow-400 mx-auto mb-12 rounded-full" />

      <div className="space-y-6 max-w-3xl mx-auto">
        {list.map((text, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-200 flex flex-col items-start"
          >
            <div className="bg-yellow-100 text-yellow-700 font-bold px-4 py-2 rounded-lg mr-4 text-lg shadow-sm">
              {String(idx + 1).padStart(2, "0")}.
            </div>

            <p className="text-lg font-medium text-zinc-700">{text}</p>

            {idx === 3 && (
              <p className="text-zinc-600 text-base mt-3 ml-16">
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/*********************************
 * FEATURES GRID
 *********************************/
function FeaturesGrid() {
  const items = [
    { title: "Clarity", desc: "Get crystal-clear direction on what to focus on to grow faster.", icon: <Lightbulb className="h-6 w-6 text-yellow-700" /> },
    { title: "Systems", desc: "Build structured processes that make your business run smoothly.", icon: <Layers className="h-6 w-6 text-yellow-700" /> },
    { title: "Growth", desc: "Unlock strategies that help you scale without chaos or confusion.", icon: <TrendingUp className="h-6 w-6 text-yellow-700" /> },
    { title: "Leadership", desc: "Develop mindset & skills to lead your team with confidence.", icon: <Users className="h-6 w-6 text-yellow-700" /> },
    { title: "Strategy", desc: "Learn proven business strategies that actually move the needle.", icon: <Target className="h-6 w-6 text-yellow-700" /> },
    { title: "Execution", desc: "Implement action-driven plans that generate real business results.", icon: <CheckCircle className="h-6 w-6 text-yellow-700" /> },
  ];

  return (
    <section
      className="py-20 px-6 md:px-10 grid md:grid-cols-3 gap-10 bg-white border-t border-yellow-200"
      data-testid="features"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="mb-4 p-3 rounded-xl bg-yellow-100 border border-yellow-300 w-fit">{item.icon}</div>

          <h3 className="text-3xl font-semibold mb-4 text-yellow-700">{item.title}</h3>

          <p className="text-zinc-600 text-lg">{item.desc}</p>
        </motion.div>
      ))}
    </section>
  );
}

/*********************************
 * REVIEW MARQUEE
 *********************************/
function ReviewMarquee() {
  return (
    <section className="py-12 bg-transparent text-black px-6 border-t border-yellow-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-yellow-700">Real Strategies. Real Clarity. Real Business Growth.</h2>

      <div className="max-w-4xl mx-auto overflow-hidden">
        <div className="flex gap-10 whitespace-normal text-lg text-zinc-700">
          <div className="w-full text-center">“Entrepreneurs gain clarity within the first 15 minutes — guaranteed.”</div>
        </div>
      </div>
    </section>
  );
}

/*********************************
 * BONUSES
 *********************************/
function Bonuses() {
  return (
    <section
      className="py-20 bg-white px-6 border-t border-yellow-200"
      data-testid="bonuses"
    >
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-yellow-700">
        Additional Support You'll Receive
      </h2>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((b) => (
          <motion.div
            key={b}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-yellow-200 shadow-lg hover:scale-105 transition-all duration-300"
          >
            <div className="h-40 bg-yellow-100 border border-yellow-300 rounded-xl mb-4 shadow-inner" />

            <h3 className="text-2xl font-semibold mb-2 text-yellow-700">Premium Bonus #{b}</h3>

            <p className="text-zinc-600">
              High-value resource unlocked exclusively for committed action-takers.
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/*********************************
 * TRUST BADGES
 *********************************/
function TrustBadges() {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 py-6 sm:py-8 bg-white border-t border-yellow-200">
      <div className="px-4 py-2 sm:px-6 sm:py-4 bg-white border border-yellow-300 rounded-lg shadow text-yellow-800 font-semibold text-sm sm:text-base text-center">
        ✅ Secure Payment
      </div>

      <div className="px-4 py-2 sm:px-6 sm:py-4 bg-white border border-yellow-300 rounded-lg shadow text-yellow-800 font-semibold text-sm sm:text-base text-center">
        ✅ 100% Privacy Safe
      </div>

      <div className="px-4 py-2 sm:px-6 sm:py-4 bg-white border border-yellow-300 rounded-lg shadow text-yellow-800 font-semibold text-sm sm:text-base text-center">
        ✅ Money-Back Guarantee
      </div>
    </div>
  );
}

/*********************************
 * CTA SECTION
 *********************************/
function CTA() {
  return (
    <section className="py-28 text-center bg-white border-t border-yellow-200 px-6" data-testid="cta">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-6 text-yellow-700"
      >
        Start Your 1-on-1 Guidance Journey
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg md:text-2xl text-zinc-700 max-w-3xl mx-auto"
      >
        Book your 1-on-1 session and get personalised Guidance built only for your business.
      </motion.p>
    </section>
  );
}
/*********************************
 * OFFER SHOWCASE
 *********************************/
function OfferShowcase({ miniMinutes, miniSeconds }) {
  return (
    <section
      className="py-20 bg-white text-black px-6 text-center border-t border-yellow-200"
      data-testid="offer-showcase"
    >
      <div className="max-w-3xl mx-auto">
        <p className="line-through text-zinc-500 text-lg">Total Value ₹10,000/-</p>
        <p className="text-2xl font-semibold mt-2">Regular Price: ₹999/-</p>

        <div className="mt-6 bg-[#5c4642] text-white py-6 rounded-xl shadow-lg">
          <p className="text-xl font-semibold">Today's Price:</p>
          <p className="text-5xl font-extrabold text-yellow-300">₹99</p>
        </div>

        <p className="mt-6 text-lg">
          Grab your seat now & unlock bonuses worth ₹10,000/-
        </p>

        {/* Timer */}
        <div className="flex justify-center gap-6 mt-10">
          <div className="bg-black text-white px-6 py-4 rounded-xl border border-white/40 shadow-xl text-center">
            <p className="text-4xl font-bold">{miniMinutes}</p>
            <span className="block text-sm mt-1">Minutes</span>
          </div>
          <div className="bg-black text-white px-6 py-4 rounded-xl border border-white/40 shadow-xl text-center">
            <p className="text-4xl font-bold">{miniSeconds}</p>
            <span className="block text-sm mt-1">Seconds</span>
          </div>
        </div>

        <PrimaryButton className="mt-6" />
      </div>
    </section>
  );
}

/*********************************
 * COACH STATS
 *********************************/
function CoachStats() {
  const stats = [
    ["16", "Years of Experience"],
    ["50M", "Entrepreneurs Reached"],
    ["500+", "Seminars Conducted"],
    ["500K", "Social Followers"],
    ["700K", "Paid Customers"],
    ["18K+", "Entrepreneur Community"],
    ["2000+", "Guidance Clients"],
    ["190+", "Industries Worked With"],
  ];

  return (
    <section
      className="py-20 bg-white text-black px-6 text-center border-t border-yellow-200"
      data-testid="coach-stats"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-2">Meet Your Coach</h2>
      <div className="w-16 h-1 bg-orange-400 mx-auto mb-10" />

      <div className="flex flex-col items-center mb-10">
        <img
          src="./photo2.png"
          className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
        />
        <h3 className="text-2xl font-bold mt-4">Arunn Guptaa</h3>
        <p className="text-zinc-600 text-base mt-1">
          India's Leading Business Success Coach
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {stats.map(([num, label], i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-zinc-200">
            <p className="text-3xl font-bold text-orange-600">{num}</p>
            <p className="text-sm mt-1 text-zinc-600">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/*********************************
 * GUARANTEE SECTION
 *********************************/
function Guarantee() {
  return (
    <section
      className="py-20 px-6 bg-white text-black border-t border-yellow-200"
      data-testid="guarantee"
    >
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl border border-yellow-200 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-orange-500">
          Our Guarantee
        </h2>

        <p className="text-center text-zinc-600 max-w-2xl mx-auto mb-8">
          Join today for just ₹99 and experience a powerful business-growth
          session. If you feel it did not deliver value, we will give your
          money back — no questions asked. 100% satisfaction or full refund!
        </p>

        <h3 className="text-2xl font-bold text-center text-orange-400 mb-2">
          A Promise
        </h3>

        <div className="w-16 h-1 bg-orange-400 mx-auto mb-6" />

        <h4 className="text-xl font-bold text-center text-yellow-600 mb-6">
          No Questions Asked Money Back Guarantee
        </h4>

        <p className="text-zinc-600 leading-relaxed mb-4">Dear Participant,</p>

        <p className="text-zinc-600 leading-relaxed mb-4">
          I am here to guide you personally and share powerful business
          insights that can help you take your business to the next level.
        </p>

        <p className="text-zinc-600 leading-relaxed mb-6">
          If you feel the session did not deliver enough value, I offer a
          complete refund of your ₹99 fee — no questions asked. Simply email{" "}
          <span className="text-orange-300">refund@arunnguptaa.com</span>.
        </p>

        <p className="text-zinc-600 mb-6">
          Yours, <br />
          <span
            className="text-3xl text-yellow-600 italic font-semibold tracking-wide"
            style={{ fontFamily: "cursive" }}
          >
            Arunn Guptaa
          </span>
        </p>

        <div className="text-center mt-8">
          <PrimaryButton label="Register Now at ₹99/- Only" />
        </div>
      </div>
    </section>
  );
}

/*********************************
 * VIDEO TESTIMONIALS CAROUSEL
 *********************************/
function VideoTestimonials() {
  // Carousel: show 3 videos at once on md+ and 1 on mobile.
  // Play videos sequentially: when one finishes, the next starts; when group ends, advance to next group.
  const [isMdUp, setIsMdUp] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMdUp(mq.matches);
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const baseVideos = [
    "test1.mp4",
    "test2.mp4",
    "test3.mp4",
    "test4.mp4",
    "test5.mp4",
    "test6.mp4",
  ];

  const slidesCount = baseVideos.length;
  const slidesPerView = isMdUp ? 3 : 1;
  const groupCount = Math.max(1, Math.ceil(slidesCount / slidesPerView));

  const [groupIndex, setGroupIndex] = useState(0); // which group/page is visible
  const [playingIndex, setPlayingIndex] = useState(0); // absolute index of video currently playing
  const videoRefs = useRef([]);

  // helper: play a specific video index (muted) and pause others
  const playVideoAt = (idx) => {
    videoRefs.current.forEach((v, i) => {
      try {
        if (!v) return;
        if (i === idx) {
          // try to play; modern browsers return a promise
          v.muted = true;
          const p = v.play();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } else {
          v.pause();
          v.currentTime = 0;
        }
      } catch (e) {}
    });
  };

  // whenever groupIndex changes, set playingIndex to group's first item and start it after layout
  useEffect(() => {
    const start = groupIndex * slidesPerView;
    setPlayingIndex((_) => start);
    // give browser a tick to layout and then play
    const t = setTimeout(() => {
      playVideoAt(start);
    }, 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, slidesPerView]);

  // when playingIndex changes, play that video
  useEffect(() => {
    if (playingIndex == null) return;
    playVideoAt(playingIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingIndex]);

  const onEnded = (idx) => {
    const groupStart = groupIndex * slidesPerView;
    const groupEnd = Math.min(groupStart + slidesPerView - 1, slidesCount - 1);

    if (idx < groupEnd) {
      // play next within group
      setPlayingIndex(idx + 1);
    } else {
      // move to next group and play its first video
      const nextGroup = (groupIndex + 1) % groupCount;
      setGroupIndex(nextGroup);
      // playingIndex will be set by the groupIndex effect
    }
  };

  const nextGroup = () => setGroupIndex((g) => (g + 1) % groupCount);
  const prevGroup = () => setGroupIndex((g) => (g - 1 + groupCount) % groupCount);

  return (
    <section className="py-20 bg-black text-white px-6" data-testid="video-testimonials">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-10">Client Video Feedback</h2>

      <div className="relative max-w-5xl mx-auto overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${groupIndex * 100}%)` }}
        >
          {baseVideos.map((src, i) => (
            <div key={i} style={{ minWidth: `${100 / slidesPerView}%` }} className="px-2">
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={`/${src}`}
                className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover rounded-xl shadow-xl"
                muted
                playsInline
                preload="metadata"
                controls
                onEnded={() => onEnded(i)}
              />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prevGroup}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-2 rounded-full shadow-xl z-30"
        >
          ◀
        </button>
        <button
          onClick={nextGroup}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-2 rounded-full shadow-xl z-30"
        >
          ▶
        </button>
      </div>

      {/* Dots for groups */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: groupCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setGroupIndex(i)}
            className={`h-2 w-6 rounded-full ${i === groupIndex ? "bg-white" : "bg-zinc-600"}`}
          />
        ))}
      </div>
    </section>
  );
}

/*********************************
 * FAQ
 *********************************/
function FAQ() {
  const list = [
    { q: "Is this a 1-on-1 session?", a: "Yes. This is a personalised Guidance session where only you & the coach are present." },
    { q: "What happens in the session?", a: "You get personalised clarity, custom strategies, and a 30-day roadmap." },
    { q: "Do I need to prepare?", a: "Yes. After registration, you'll receive a short form for details." },
    { q: "Can I reschedule?", a: "Yes, once if informed 24 hours in advance." },
    { q: "Will you help with exact problems?", a: "Absolutely. Everything is business-specific." },
    { q: "Refund policy?", a: "If not satisfied, request a refund within 24 hours — no questions asked." },
    { q: "Is ₹99 the final price?", a: "Yes, limited-time offer for new clients only." },
    { q: "Will I get notes?", a: "Yes, you'll receive a written action roadmap after session." },
  ];

  return (
    <section className="py-20 bg-white px-6 text-black border-t border-yellow-200">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Frequently Asked Questions</h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {list.map((item, i) => (
          <details key={i} className="bg-white border border-yellow-200 p-6 rounded-xl shadow-md">
            <summary className="text-xl font-semibold cursor-pointer">{item.q}</summary>
            <p className="text-zinc-600 mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/*********************************
 * PRIVACY FOOTER
 *********************************/
function PrivacyFooter() {
  return (
    <section
      className="py-12 bg-white text-zinc-600 px-6 text-center border-t border-yellow-200"
      data-testid="privacy-footer"
    >
      <div className="flex flex-col items-center gap-4">
        <img src="./logo.png" alt="Company Logo" className="h-20 md:h-24 opacity-100" />

        <p className="text-sm max-w-xl">
          We value your privacy. All your details are securely encrypted and never shared with third parties.
        </p>

        <a href="#" className="underline text-zinc-600 hover:text-black transition">
          Privacy Policy
        </a>
      </div>
    </section>
  );
}

/*********************************
 * STICKY OFFER BAR
 *********************************/
function StickyOfferBar({ timeLeft, format }) {
  return (
    <div
      className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md text-black py-4 px-6 flex flex-col 
      sm:flex-row gap-3 sm:gap-6 sm:justify-between sm:items-center z-50 shadow-[0_0_20px_rgba(0,0,0,0.1)] border-t border-yellow-300"
    >
      <div className="flex items-center gap-3">
        <span className="text-base sm:text-lg font-bold text-yellow-700">Today's Price:</span>
        <span className="text-2xl font-extrabold text-yellow-600">₹99</span>
      </div>

      <div className="flex items-center gap-2 text-yellow-700 font-semibold">
        <span>Ends In:</span>
        <span className="text-xl font-bold">{format(timeLeft)}</span>
      </div>

      <PrimaryButton label="Register Now" />
    </div>
  );
}

/*********************************
 * MAIN LANDING PAGE
 *********************************/
export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const { timeLeft, format, miniMinutes, miniSeconds } = useOfferTimer();

  return (
    <>
      <ProgressBar />
      <ExitPopup />

  <div className="min-h-screen w-full bg-white text-black font-sans relative pt-12">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)] animate-pulse" />

        {/* Header Image */}
  <div className="w-full flex justify-center mt-4 mb-6 bg-transparent">
          <img
            src="./logo.png"
            alt="Session Banner"
            className="w-full max-w-md rounded-2xl bg-transparent"
            style={{ backgroundColor: 'transparent', objectFit: 'contain', maxHeight: '200px' }}
          />
        </div>

        <LiveTodayBanner />
        <Hero parallaxY={parallaxY} />
        <SuccessMarquee />
        <SessionExplainer miniMinutes={miniMinutes} miniSeconds={miniSeconds} />
        <FeaturedLogos />
        <TransformGraph />
        <LearnSection />
        <FeaturesGrid />
        <ReviewMarquee />
        <Bonuses />
        <TrustBadges />
        <CTA />
        <OfferShowcase miniMinutes={miniMinutes} miniSeconds={miniSeconds} />
        <CoachStats />
        <Guarantee />
        <VideoTestimonials />
        <FAQ />
        <PrivacyFooter />
        <StickyOfferBar timeLeft={timeLeft} format={format} />
      </div>

      {/* Inline styles */}
      <style>{`
        @keyframes marqueeMove {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marqueeMove 18s linear infinite;
          white-space: nowrap;
        }
        .animate-marquee2 {
          display: inline-flex;
          animation: marqueeMove 22s linear infinite;
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}

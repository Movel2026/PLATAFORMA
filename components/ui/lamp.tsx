"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * LampContainer — spotlight lamp effect for MOVEL hero.
 * • Beams are absolutely contained so they never clip the hero content.
 * • Fades the hero out as the user scrolls down (dissolve effect).
 * • Replays the beam expansion animation when the user scrolls back to top.
 */
export function LampContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { scrollY } = useScroll();
  const heroOpacity  = useTransform(scrollY, [0, 420], [1, 0]);
  const heroY        = useTransform(scrollY, [0, 420], [0, -60]);
  const heroScale    = useTransform(scrollY, [0, 420], [1, 0.97]);

  // Re-play beam animation when user scrolls back to top
  const [animKey, setAnimKey] = useState(0);
  const prevY = useRef(0);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (prevY.current > 60 && latest < 15) setAnimKey((k) => k + 1);
    prevY.current = latest;
  });

  return (
    <div
      className={`relative w-full ${className}`}
      style={{ minHeight: "100vh", backgroundColor: "#08101e" }}
    >
      {/* ── Lamp beams — scroll-faded, replayed on return to top ── */}
      <motion.div
        key={animKey}
        style={{ opacity: heroOpacity }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Left conic beam */}
        <motion.div
          initial={{ opacity: 0.3, width: "6rem" }}
          animate={{ opacity: 1, width: "34rem" }}
          transition={{ delay: 0.15, duration: 1.1, ease: "easeInOut" as const }}
          style={{
            position: "absolute", top: 0, right: "50%", height: "62%",
            backgroundImage: "conic-gradient(from 70deg at center top, #60a5fa, #1978e5 20%, transparent 40%)",
          }}
        >
          <div style={{ position: "absolute", width: "100%", left: 0, height: "45%", bottom: 0, background: "#08101e", maskImage: "linear-gradient(to top,white,transparent)", WebkitMaskImage: "linear-gradient(to top,white,transparent)" }} />
          <div style={{ position: "absolute", width: "11rem", height: "100%", left: 0, bottom: 0, background: "#08101e", maskImage: "linear-gradient(to right,white,transparent)", WebkitMaskImage: "linear-gradient(to right,white,transparent)" }} />
        </motion.div>

        {/* Right conic beam */}
        <motion.div
          initial={{ opacity: 0.3, width: "6rem" }}
          animate={{ opacity: 1, width: "34rem" }}
          transition={{ delay: 0.15, duration: 1.1, ease: "easeInOut" as const }}
          style={{
            position: "absolute", top: 0, left: "50%", height: "62%",
            backgroundImage: "conic-gradient(from 290deg at center top, transparent 60%, #1978e5 80%, #60a5fa)",
          }}
        >
          <div style={{ position: "absolute", width: "11rem", height: "100%", right: 0, bottom: 0, background: "#08101e", maskImage: "linear-gradient(to left,white,transparent)", WebkitMaskImage: "linear-gradient(to left,white,transparent)" }} />
          <div style={{ position: "absolute", width: "100%", right: 0, height: "45%", bottom: 0, background: "#08101e", maskImage: "linear-gradient(to top,white,transparent)", WebkitMaskImage: "linear-gradient(to top,white,transparent)" }} />
        </motion.div>

        <div style={{ position: "absolute", top: "38%", width: "100%", height: "28%", background: "#08101e", filter: "blur(24px)", transform: "scaleX(1.6)" }} />
        <div style={{ position: "absolute", top: "28%", left: "50%", transform: "translate(-50%,0)", width: "38rem", height: "18rem", borderRadius: "50%", background: "#1978e5", opacity: 0.13, filter: "blur(52px)" }} />

        <motion.div
          initial={{ width: "4rem" }}
          animate={{ width: "20rem" }}
          transition={{ delay: 0.15, duration: 1.1, ease: "easeInOut" as const }}
          style={{ position: "absolute", top: "33%", left: "50%", transform: "translate(-50%,0)", height: "7rem", borderRadius: "50%", background: "#1565c0", opacity: 0.75, filter: "blur(28px)" }}
        />

        <motion.div
          initial={{ width: "6rem", opacity: 0 }}
          animate={{ width: "36rem", opacity: 1 }}
          transition={{ delay: 0.15, duration: 1.1, ease: "easeInOut" as const }}
          style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,0)", height: "1px", background: "linear-gradient(to right,transparent,#60a5fa 30%,#93c5fd 50%,#60a5fa 70%,transparent)" }}
        />
        <div style={{ position: "absolute", top: 0, width: "100%", height: "7%", background: "#08101e" }} />
      </motion.div>

      {/* ── Hero content — fades and rises with scroll ── */}
      <motion.div
        style={{ opacity: heroOpacity, y: heroY, scale: heroScale, minHeight: "100vh" }}
        className="relative z-10 flex flex-col items-center justify-center w-full px-4"
      >
        {children}
      </motion.div>
    </div>
  );
}

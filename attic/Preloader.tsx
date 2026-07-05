"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * Stopwatch preloader: a mono counter runs 0 to 100 while the hero photo and
 * app screenshots actually preload, then the panel wipes up into the hero.
 * Skipped entirely on repeat views (sessionStorage) and for reduced motion.
 */

const PRELOAD = [
  "/hero-runner.jpg",
  "/app/analyze.png",
  "/app/metrics.png",
  "/app/coach.png",
];

export default function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const digits = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("gaita-loaded") || reduced) {
      setDone(true);
      document.documentElement.classList.add("gaita-ready");
      window.dispatchEvent(new Event("gaita:ready"));
      return;
    }

    let loaded = 0;
    const state = { shown: 0 };
    let target = 0;

    const render = () => {
      if (digits.current) {
        digits.current.textContent = String(Math.round(state.shown)).padStart(3, "0");
      }
    };

    const tween = gsap.to(state, {
      shown: 0,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: render,
      paused: true,
    });

    const bump = () => {
      loaded += 1;
      target = Math.round((loaded / PRELOAD.length) * 100);
      tween.vars.shown = target;
      tween.invalidate().restart();
    };

    PRELOAD.forEach((src) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });

    // Never trap the visitor: force completion by 2.2s even if the network lags
    const finish = setTimeout(() => {
      gsap.to(state, {
        shown: 100,
        duration: 0.5,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete: () => {
          sessionStorage.setItem("gaita-loaded", "1");
          document.documentElement.classList.add("gaita-ready");
          window.dispatchEvent(new Event("gaita:ready"));
          gsap
            .timeline({ onComplete: () => setDone(true) })
            .to(digits.current, { yPercent: -120, duration: 0.45, ease: "power3.in" })
            .to(root.current, {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.8,
              ease: "power4.inOut",
            });
        },
      });
    }, 1400);

    return () => clearTimeout(finish);
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex items-end justify-between bg-[#0b0d0f] px-6 pb-8 md:px-16"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden="true"
    >
      <p className="hud-label">Gaita / form analysis</p>
      <div className="overflow-hidden">
        <span
          ref={digits}
          className="numeral block text-[18vw] leading-none text-paper md:text-[9rem]"
        >
          000
        </span>
      </div>
    </div>
  );
}

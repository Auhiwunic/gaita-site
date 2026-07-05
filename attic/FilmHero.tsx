"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The film room. Five real frames of one stride, pulled from the CC BY
 * treadmill footage this app actually analyzed, stepped like game tape as
 * you scroll. The skeleton is the real MediaPipe detection for each frame.
 * At foot strike the coach's grease pencil circles the problem, then the
 * app's real readings for this footage stamp in.
 *
 * Frames 401-422 of SfEsHFexRis (626x360, 30fps). Landmarks are pixel
 * coords in that space; bones with a low-visibility endpoint are skipped
 * per frame, exactly as a tracker would drop an occluded joint.
 */

type Pt = [number, number, number];
type FramePts = Record<number, Pt>;

const FRAMES = [401, 406, 411, 418, 422];
const PHASES = ["strike", "stance", "toe off", "flight", "reach"];

const PTS: FramePts[] = [
  { 7: [162.2, 55.4, 1.0], 8: [170.3, 57.1, 1.0], 11: [126.3, 82.8, 1.0], 12: [172.5, 82.9, 1.0], 13: [108.9, 112.1, 0.05], 14: [181.9, 117.5, 0.76], 15: [117.4, 140.7, 0.05], 16: [185.6, 97.8, 0.25], 23: [133.5, 159.4, 1.0], 24: [144.6, 161.2, 1.0], 25: [170.5, 198.8, 0.88], 26: [123.9, 222.4, 1.0], 27: [186.0, 260.7, 0.98], 28: [64.7, 248.6, 1.0], 29: [182.5, 272.5, 0.99], 30: [49.8, 245.2, 0.98], 31: [213.0, 262.9, 0.96], 32: [65.9, 280.2, 0.99] },
  { 7: [155.0, 71.3, 1.0], 8: [156.3, 71.6, 1.0], 11: [142.0, 99.4, 1.0], 12: [140.3, 97.1, 1.0], 13: [140.1, 136.5, 0.02], 14: [128.8, 130.0, 0.99], 15: [144.4, 160.4, 0.06], 16: [145.5, 158.6, 0.97], 23: [125.5, 174.6, 1.0], 24: [131.4, 173.5, 1.0], 25: [128.6, 225.8, 0.64], 26: [171.3, 216.8, 0.99], 27: [115.5, 284.2, 0.97], 28: [115.8, 232.8, 0.99], 29: [106.6, 296.2, 0.98], 30: [103.5, 231.7, 0.96], 31: [140.6, 294.0, 0.97], 32: [117.9, 259.2, 0.98] },
  { 7: [148.0, 54.5, 1.0], 8: [149.3, 55.2, 1.0], 11: [130.2, 82.2, 1.0], 12: [136.6, 71.4, 1.0], 13: [142.3, 110.6, 0.06], 14: [98.9, 86.2, 0.97], 15: [162.8, 103.7, 0.25], 16: [93.3, 119.6, 0.94], 23: [117.2, 156.1, 1.0], 24: [133.4, 155.1, 1.0], 25: [104.6, 215.4, 0.78], 26: [168.2, 199.4, 0.74], 27: [45.5, 243.5, 0.74], 28: [186.5, 261.1, 0.72], 29: [31.6, 241.7, 0.88], 30: [182.7, 273.7, 0.81], 31: [43.8, 273.8, 0.79], 32: [212.4, 260.3, 0.64] },
  { 7: [134.1, 67.4, 1.0], 8: [138.3, 68.5, 1.0], 11: [97.0, 93.6, 1.0], 12: [136.5, 93.9, 1.0], 13: [77.0, 126.6, 0.25], 14: [143.6, 132.8, 0.94], 15: [83.0, 155.8, 0.21], 16: [162.7, 143.0, 0.93], 23: [103.0, 173.9, 1.0], 24: [119.9, 176.7, 1.0], 25: [153.7, 195.1, 0.34], 26: [103.0, 234.3, 0.98], 27: [121.0, 244.8, 0.65], 28: [75.9, 290.2, 0.98], 29: [111.8, 251.7, 0.86], 30: [63.9, 300.1, 0.93], 31: [140.6, 264.6, 0.59], 32: [100.8, 303.9, 0.93] },
  { 7: [127.0, 61.1, 1.0], 8: [133.3, 62.2, 1.0], 11: [88.8, 87.3, 1.0], 12: [137.2, 86.2, 1.0], 13: [74.2, 120.8, 0.13], 14: [152.9, 122.7, 0.42], 15: [82.0, 149.9, 0.1], 16: [153.3, 104.6, 0.11], 23: [99.2, 165.3, 1.0], 24: [112.9, 167.8, 1.0], 25: [137.8, 209.4, 0.66], 26: [98.4, 229.8, 1.0], 27: [161.0, 263.0, 0.92], 28: [38.0, 254.3, 0.99], 29: [158.4, 275.7, 0.95], 30: [24.3, 250.0, 0.95], 31: [187.1, 260.9, 0.87], 32: [34.6, 288.4, 0.96] },
];

const BONES: [number, number][] = [
  [11, 12], [11, 23], [12, 24], [23, 24],
  [11, 13], [13, 15], [12, 14], [14, 16],
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32],
];

// The app's real readings for this footage (Full Metrics sheet)
const READINGS = [
  { label: "CAD", value: "150", ok: false, note: "target 165 to 190" },
  { label: "TORSO", value: "6°", ok: true, note: "in range" },
  { label: "SHIN", value: "13°", ok: false, note: "target under 8°" },
  { label: "STRIKE", value: "FORE", ok: false, note: "target MID" },
];

function Skeleton({ pts, active }: { pts: FramePts; active: boolean }) {
  const head = pts[7] && pts[8]
    ? { x: (pts[7][0] + pts[8][0]) / 2, y: (pts[7][1] + pts[8][1]) / 2 }
    : null;
  const neck = pts[11] && pts[12]
    ? { x: (pts[11][0] + pts[12][0]) / 2, y: (pts[11][1] + pts[12][1]) / 2 }
    : null;
  return (
    <svg
      viewBox="0 0 626 360"
      className={`absolute inset-0 h-full w-full transition-opacity duration-150 ${
        active ? "opacity-100" : "opacity-0"
      }`}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#00e5ff" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.95">
        {BONES.map(([a, b], i) => {
          const A = pts[a];
          const B = pts[b];
          if (!A || !B || A[2] < 0.5 || B[2] < 0.5) return null;
          return <line key={i} x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} />;
        })}
        {head && neck && <line x1={head.x} y1={head.y} x2={neck.x} y2={neck.y} />}
      </g>
      {Object.entries(pts).map(([k, p]) =>
        p[2] >= 0.5 && !["7", "8"].includes(k) ? (
          <circle key={k} cx={p[0]} cy={p[1]} r="3.4" fill="#00e5ff" />
        ) : null
      )}
      {head && <circle cx={head.x} cy={head.y} r="7" stroke="#00e5ff" strokeWidth="2.2" />}
    </svg>
  );
}

export default function FilmHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const entrance = () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".fh-line", { yPercent: 112, duration: 1.0, stagger: 0.1 }, 0.1)
          .from(".fh-viewer", { y: 34, autoAlpha: 0, duration: 0.9 }, 0.35)
          .from(".fh-sub, .fh-cta", { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, "-=0.4");
      };
      if (document.documentElement.classList.contains("gaita-ready")) entrance();
      else window.addEventListener("gaita:ready", entrance, { once: true });

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const state = { i: 0 };
          const frames = gsap.utils.toArray<HTMLElement>(".fh-frame");
          const skels = gsap.utils.toArray<HTMLElement>(".fh-skel");
          const counter = root.current!.querySelector(".fh-counter")!;
          const phase = root.current!.querySelector(".fh-phase")!;

          const show = (i: number) => {
            frames.forEach((f, j) => f.style.setProperty("opacity", j === i ? "1" : "0"));
            skels.forEach((s, j) =>
              s.firstElementChild?.classList.toggle("opacity-100", j === i)
            );
            skels.forEach((s, j) =>
              s.firstElementChild?.classList.toggle("opacity-0", j !== i)
            );
            counter.textContent = `FR ${String(FRAMES[i]).padStart(4, "0")} / 3094`;
            phase.textContent = PHASES[i];
          };

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=230%",
              pin: true,
              scrub: 0.4,
              anticipatePin: 1,
            },
          });

          // Step the frames like tape: 5 hard cuts over the first 60%
          tl.to(state, {
            i: FRAMES.length - 1,
            duration: 0.6,
            snap: { i: 1 },
            onUpdate: () => show(Math.round(state.i)),
          }, 0)
            .to(".fh-playhead", { scaleX: 1, duration: 0.6 }, 0)
            // Grease pencil circles the strike foot on the last frame
            .fromTo(
              ".fh-ellipse",
              { strokeDashoffset: 1, strokeDasharray: 1, autoAlpha: 0 },
              { strokeDashoffset: 0, autoAlpha: 1, duration: 0.14, ease: "power2.out" },
              0.64
            )
            .from(".fh-mark-note", { autoAlpha: 0, y: 8, duration: 0.06 }, 0.74)
            // Then the app's readings stamp in
            .from(
              ".fh-reading",
              { autoAlpha: 0, y: 16, duration: 0.05, stagger: 0.045, ease: "power2.out" },
              0.8
            )
            .to({}, { duration: 0.02 });
        }
      );

      mm.add(
        "(max-width: 767px), (prefers-reduced-motion: reduce)",
        () => {
          // Static: last frame, skeleton on, marks and readings visible
          const frames = gsap.utils.toArray<HTMLElement>(".fh-frame");
          frames.forEach((f, j) => f.style.setProperty("opacity", j === FRAMES.length - 1 ? "1" : "0"));
          const skels = gsap.utils.toArray<HTMLElement>(".fh-skel");
          skels.forEach((s, j) => {
            s.firstElementChild?.classList.toggle("opacity-100", j === FRAMES.length - 1);
            s.firstElementChild?.classList.toggle("opacity-0", j !== FRAMES.length - 1);
          });
          gsap.set(".fh-ellipse", { strokeDasharray: 1, strokeDashoffset: 0 });
        }
      );
    },
    { scope: root }
  );

  return (
    <section ref={root} id="top" className="relative overflow-hidden">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] items-center gap-10 px-6 pb-16 pt-28 md:grid-cols-12 md:gap-6 md:px-12">
        {/* Copy — columns 1-5 */}
        <div className="md:col-span-5">
          <h1 className="font-serif-display text-[13vw] font-black leading-[0.92] text-paper sm:text-7xl lg:text-[5.4rem]">
            <span className="block overflow-hidden">
              <span className="fh-line block">Where</span>
            </span>
            <span className="block overflow-hidden pl-[8%]">
              <span className="fh-line coach-italic block font-bold">champions</span>
            </span>
            <span className="block overflow-hidden">
              <span className="fh-line block">are made</span>
            </span>
          </h1>

          <p className="fh-sub mt-8 max-w-md text-lg leading-relaxed text-n4">
            Point an iPhone at your run. Gaita measures eight angles per
            stride, grades your form, and coaches the fix in your ear.
          </p>

          <div className="fh-cta mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className="group rounded-full bg-accent px-7 py-3.5 font-medium text-ink transition-transform duration-200 active:scale-[0.97]"
            >
              Put me on the list
              <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#metrics"
              className="border-b border-white/25 pb-0.5 font-medium text-paper transition-colors hover:border-accent"
            >
              Watch a real analysis
            </a>
          </div>

          {/* The app's readings for this exact footage */}
          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
            {READINGS.map((r) => (
              <div key={r.label} className="fh-reading">
                <p className="font-mono text-[0.65rem] tracking-[0.14em] text-n3">
                  {r.label}
                </p>
                <p
                  className={`font-mono text-2xl font-bold tabular-nums ${
                    r.ok ? "text-accent" : "text-grease"
                  }`}
                >
                  {r.value}
                </p>
                <p className="font-mono text-[0.6rem] tracking-wide text-n3">
                  {r.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footage — columns 6-12 */}
        <div className="md:col-span-7">
          <div className="fh-viewer viewfinder relative -rotate-[1.2deg] overflow-hidden rounded-sm bg-black shadow-[10px_14px_0_rgba(0,0,0,0.4)]">
            <div className="relative aspect-[626/360]">
              {FRAMES.map((f, i) => (
                <div key={f} className="fh-frame absolute inset-0 transition-opacity duration-100" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <Image
                    src={`/gait/s${f}.webp`}
                    alt={i === 0 ? "Treadmill runner at a marathon expo, side view frame from real footage" : ""}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 92vw, 60vw"
                    className="object-cover"
                  />
                </div>
              ))}
              {FRAMES.map((f, i) => (
                <div key={f} className="fh-skel absolute inset-0">
                  <Skeleton pts={PTS[i]} active={i === 0} />
                </div>
              ))}

              {/* Grease pencil: rough double ellipse around the strike foot (frame 5 coords) */}
              <svg viewBox="0 0 626 360" className="pointer-events-none absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
                <path
                  className="fh-ellipse"
                  pathLength={1}
                  d="M 12 250 C 8 232, 52 222, 78 230 C 106 239, 104 272, 72 281 C 40 290, 6 275, 14 254 C 20 236, 48 226, 70 232"
                  stroke="#ff2d2d"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
              <p className="fh-mark-note absolute bottom-[30%] left-[13%] font-serif-display text-lg italic text-grease">
                lands out front
              </p>

              <span className="vf-corner vf-tl" />
              <span className="vf-corner vf-tr" />
              <span className="vf-corner vf-bl" />
              <span className="vf-corner vf-br" />

              {/* Timecode strip */}
              <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2.5 font-mono text-[0.62rem] tracking-[0.14em] text-paper/75">
                <span className="flex items-center gap-2">
                  <span className="rec-dot" /> REC
                </span>
                <span className="fh-counter">FR 0401 / 3094</span>
                <span>SIDE · 30 FPS</span>
              </div>
            </div>

            {/* Playhead */}
            <div className="h-[3px] w-full bg-white/10">
              <div className="fh-playhead h-full origin-left scale-x-0 bg-grease" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between px-1">
            <p className="font-mono text-[0.62rem] tracking-[0.14em] text-n3">
              REAL FOOTAGE · THIS BIG LAD RUNS, CC BY · ANALYZED IN GAITA
            </p>
            <p className="fh-phase font-serif-display text-base italic text-n4">strike</p>
          </div>
        </div>
      </div>
    </section>
  );
}

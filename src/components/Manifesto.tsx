"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * The statement. Big warm body type, one inline emoji, founder
 * attribution, and two numbered margin notes. Human, not pitchy.
 */

const NOTES = [
  {
    n: "01/",
    text: "Filmed on the phone you already carry. No lab, no wearables, no lace pods.",
  },
  {
    n: "02/",
    text: "Graded like game tape: eight angles a coach can see but never measure by eye.",
  },
];

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".man-reveal", {
          y: 34,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 72%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="px-5 py-24 md:px-10 md:py-36">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="man-reveal text-[1.65rem] font-medium leading-[1.3] tracking-[-0.01em] text-ink sm:text-[2.1rem] md:text-[2.5rem]">
            Every run you have ever done, you did blind. Gaita films your
            stride 🎥, measures what your eyes never could, and coaches the
            one fix that makes you faster.
          </p>

          <div className="man-reveal mt-10 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-[0.7rem] font-semibold text-bone">
              G
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-ink">The Gaita Team</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-8 md:col-span-3 md:col-start-10">
          {NOTES.map((note) => (
            <div key={note.n} className="man-reveal">
              <span className="meta block">{note.n}</span>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-mid">
                {note.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

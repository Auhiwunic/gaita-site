"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Photo band: motion smear, blue lanes, the panning runner.
 * Asymmetric widths, one shared height, tight gaps.
 */

const PHOTOS = [
  {
    src: "/photos/13636369.jpg",
    alt: "Runner motion blurred to a smear, black and white",
    span: "md:col-span-3",
  },
  {
    src: "/photos/332835.jpg",
    alt: "Blue athletics track with numbered lanes",
    span: "md:col-span-5",
  },
  {
    src: "/photos/33995240.jpg",
    alt: "Panning shot of a runner mid stride, streaked background",
    span: "md:col-span-4",
  },
];

export default function Triptych() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".trip-img").forEach((el, i) => {
          gsap.from(el, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.1,
            delay: i * 0.08,
            ease: "power3.inOut",
            scrollTrigger: { trigger: root.current, start: "top 78%" },
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="mt-10 px-5 md:mt-14 md:px-10">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-2 md:grid-cols-12">
        {PHOTOS.map((p) => (
          <div
            key={p.src}
            className={`trip-img ${p.span} relative h-[300px] md:h-[440px]`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 40vw, 576px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Launch-day capture: copy and an underline form on the left, the
 * pack panning shot on the right. Posts to Formspree.
 */
const FORM_ID = "mwvdwjlo";

export default function AccessCTA() {
  const root = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".cta-reveal", {
          y: 30,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
      });
    },
    { scope: root }
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      setState(res.ok ? "done" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section ref={root} id="access" className="px-5 pb-24 md:px-10 md:pb-36">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 border-t border-line pt-14 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="cta-reveal display-caps text-5xl text-ink md:text-6xl">
            Be first on the start line
          </h2>
          <p className="cta-reveal mt-6 max-w-md leading-relaxed text-mid">
            Gaita ships finished, for everyone, on the App Store. Leave your
            email and you get the link the minute it goes live.
          </p>

          <form
            onSubmit={onSubmit}
            className="cta-reveal mt-10 flex max-w-md items-end gap-4"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@email.com"
              className="flex-1 border-b border-ink/40 bg-transparent pb-2 text-ink placeholder:text-soft focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              disabled={state === "sending" || state === "done"}
              className="meta shrink-0 rounded-full bg-accent px-6 py-3 !text-accent-ink transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
            >
              {state === "done"
                ? "You are on the list"
                : state === "sending"
                  ? "Sending"
                  : "Send me the link"}
            </button>
          </form>
          {state === "error" && (
            <p className="mt-4 text-sm text-mid">
              That did not go through. Try again in a minute.
            </p>
          )}

          <p className="cta-reveal mt-8 text-sm text-mid">
            Running a shop, a club or a program?{" "}
            <a
              href="mailto:arjuncw2009@gmail.com?subject=Partnership"
              className="text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              Talk partnerships
            </a>
          </p>
        </div>

        <div className="cta-reveal md:col-span-5 md:col-start-8">
          <img
            src="/photos/28448694.jpg"
            alt="Runners blurred mid sprint, black and white"
            className="h-[320px] w-full object-cover md:h-[420px]"
          />
        </div>
      </div>
    </section>
  );
}

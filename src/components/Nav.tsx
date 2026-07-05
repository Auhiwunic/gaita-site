"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "The app", href: "/#app" },
  { label: "Reads", href: "/#reads" },
  { label: "Pricing", href: "/#pricing" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "border-b border-line bg-bone/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
        <a
          href="/"
          className="head-caps text-lg text-ink"
          style={{ fontWeight: 700 }}
        >
          Gaita
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="meta text-ink/70 transition-colors hover:text-accent"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="/#access"
          className="meta rounded-full bg-accent px-5 py-2.5 !text-accent-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          Early access
        </a>
      </nav>
    </header>
  );
}

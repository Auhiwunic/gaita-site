import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "Partner with Gaita: running stores, clubs, coaches and affiliate programs.",
  alternates: { canonical: "/partnerships" },
  openGraph: {
    title: "Partnerships — Gaita",
    description:
      "Partner with Gaita: running stores, clubs, coaches and affiliate programs.",
  },
};

const FITS = [
  {
    label: "Running stores",
    body: "Gait analysis at the wall of shoes. Gaita reads a customer's form and wear pattern in minutes, and your staff sells with data.",
  },
  {
    label: "Clubs and coaches",
    body: "Every athlete films one stride a week. You see form grades and focus lists across the roster without booking a lab.",
  },
  {
    label: "Affiliates and media",
    body: "Running content that converts. Early partners get first access, assets and a direct line to the team.",
  },
];

export default function PartnershipsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-36 md:px-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-n3">
          Partnerships
        </p>
        <h1 className="font-display max-w-3xl text-5xl font-semibold leading-[0.98] md:text-7xl">
          Put a gait lab in your pocket.
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-n4">
          Gaita turns any phone into running form analysis. If you work with
          runners, that is a tool worth having on your side of the counter.
        </p>

        <div className="mt-14 grid max-w-5xl gap-4 rounded-none md:grid-cols-3">
          {FITS.map((f) => (
            <div key={f.label} className="rounded-[22px] bg-card p-8 md:p-10">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em]">
                {f.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-n4">{f.body}</p>
            </div>
          ))}
        </div>

        <a
          href="mailto:solescanteam@gmail.com?subject=Partnership"
          className="mt-12 inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-ink transition-transform duration-300 hover:scale-[1.03]"
        >
          Start the conversation
        </a>
      </main>
      <Footer />
    </>
  );
}

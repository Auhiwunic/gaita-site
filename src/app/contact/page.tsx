import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Contact" };

const CHANNELS = [
  {
    label: "Support",
    body: "Something broken, something confusing, or a question about your data.",
    email: "arjuncw2009@gmail.com",
    subject: "Support",
  },
  {
    label: "Partnerships",
    body: "Shops, clubs, coaches and programs. Affiliate and wholesale included.",
    email: "arjuncw2009@gmail.com",
    subject: "Partnership",
  },
  {
    label: "Press",
    body: "Writing about running tech. We will get you screens, facts and quotes.",
    email: "arjuncw2009@gmail.com",
    subject: "Press",
  },
];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-36 md:px-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-n3">
          Contact
        </p>
        <h1 className="font-display max-w-2xl text-5xl font-semibold leading-[0.98] md:text-7xl">
          Talk to a human.
        </h1>
        <p className="mt-6 max-w-md leading-relaxed text-n4">
          One inbox, read every day. Tell us which hat we should put on.
        </p>

        <div className="mt-14 grid max-w-4xl gap-4 rounded-none md:grid-cols-3">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={`mailto:${c.email}?subject=${encodeURIComponent(c.subject)}`}
              className="group rounded-[22px] bg-card p-8 transition-colors hover:bg-raised md:p-10"
            >
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em]">
                {c.label}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-n4">{c.body}</p>
              <p className="mt-6 text-sm text-accent">
                {c.email}
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </p>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

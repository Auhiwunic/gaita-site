/**
 * Footer: full-width blue track banner with the wordmark over it,
 * then a quiet link row. Photo credits stay — sourcing honesty.
 */

const LINKS = [
  { label: "The app", href: "/#app" },
  { label: "Reads", href: "/#reads" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Early access", href: "/#access" },
];

const SMALL = [
  { label: "Partnerships", href: "/partnerships" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer>
      {/* Banner */}
      <div className="relative h-[300px] overflow-hidden md:h-[420px]">
        <img
          src="/photos/332835.jpg"
          alt="Blue athletics track, numbered lanes"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="display-caps text-[22vw] leading-none text-white md:text-[16vw]">
            Gaita
          </span>
        </div>
      </div>

      {/* Link rows */}
      <div className="px-5 py-12 md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
            <p className="max-w-xs text-sm leading-relaxed text-mid">
              The coach in your ear. Eight angles per stride, graded and
              fixed, from any phone.
            </p>
            <nav className="flex gap-10">
              <ul className="space-y-2">
                {LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="meta text-ink/70 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {SMALL.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="meta text-ink/70 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-2 border-t border-line pt-5 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="meta !text-soft">
              © {new Date().getFullYear()} Gaita. All rights reserved.
            </p>
            <p className="meta !text-soft">
              Photography via Pexels: M. Reding, D. Daltonik, Amorie Sam, M.
              Dach, S. Knop
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

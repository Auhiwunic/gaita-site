"use client";

export default function HeroBasic() {
  return (
    <section className="relative min-h-screen px-6 py-20 md:px-12 md:py-32">
      <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12 md:items-center">
        {/* Left: headline + copy */}
        <div className="md:col-span-5">
          <h1 className="text-5xl font-bold leading-tight text-paper sm:text-6xl">
            Where champions are made
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-n4">
            Point an iPhone at your run. Gaita measures eight angles per stride,
            grades your form, and coaches the fix in your ear.
          </p>
          <div className="mt-10 flex gap-4">
            <button className="rounded-full bg-accent px-8 py-3 font-semibold text-ink hover:bg-accent-dim">
              Get early access
            </button>
            <button className="rounded-full border border-paper/30 px-8 py-3 font-semibold text-paper hover:border-paper">
              Learn more
            </button>
          </div>
        </div>

        {/* Right: runner photo with skeleton */}
        <div className="md:col-span-7">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-card">
            <img
              src="/hero-runner.jpg"
              alt="Runner analyzed by Gaita"
              className="h-full w-full object-cover"
            />
            {/* Simple skeleton overlay */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Basic pose skeleton (simplified landmarks) */}
              <circle cx="200" cy="80" r="20" />
              <line x1="200" y1="100" x2="200" y2="180" />
              <line x1="200" y1="140" x2="140" y2="100" />
              <line x1="200" y1="140" x2="260" y2="100" />
              <line x1="200" y1="180" x2="180" y2="380" />
              <line x1="200" y1="180" x2="220" y2="380" />
              <line x1="180" y1="380" x2="160" y2="580" />
              <line x1="220" y1="380" x2="240" y2="580" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

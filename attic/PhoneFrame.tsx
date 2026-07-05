import Image from "next/image";

/**
 * Minimal device frame for real app screenshots (1206x2622 captures).
 * Monochrome chrome; the screenshot itself is the only color on the page,
 * which keeps the product as the hero.
 */
export default function PhoneFrame({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative aspect-[1206/2622] overflow-hidden rounded-[2.6rem] border border-white/12 bg-ink-2 shadow-[0_24px_80px_rgba(0,0,0,0.55)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 70vw, 340px"
        className="object-cover"
      />
      {/* subtle screen glass */}
      <div className="pointer-events-none absolute inset-0 rounded-[2.6rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}

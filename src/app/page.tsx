import Nav from "@/components/Nav";
import HeroSkeleton from "@/components/HeroSkeleton";
import Triptych from "@/components/Triptych";
import Manifesto from "@/components/Manifesto";
import Catalog from "@/components/Catalog";
import ReadsGrid from "@/components/ReadsGrid";
import Pricing from "@/components/Pricing";
import AccessCTA from "@/components/AccessCTA";
import Footer from "@/components/Footer";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Gaita",
    applicationCategory: "HealthApplication",
    operatingSystem: "iOS",
    description:
      "An all in one running trainer in your pocket. It reads your form, gait and power off one video, then coaches the fix in your ear.",
    offers: [
      { "@type": "Offer", price: "7.99", priceCurrency: "USD" },
      { "@type": "Offer", price: "59.99", priceCurrency: "USD" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escaping per the Next 16 JSON-LD guide to prevent XSS injection.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <main>
        <HeroSkeleton />
        <Triptych />
        <Manifesto />
        <Catalog />
        <ReadsGrid />
        <Pricing />
        <AccessCTA />
      </main>
      <Footer />
    </>
  );
}

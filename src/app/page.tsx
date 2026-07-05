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
  return (
    <>
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

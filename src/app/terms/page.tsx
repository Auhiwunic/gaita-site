import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern your use of the Gaita app and services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions — Gaita",
    description:
      "The terms that govern your use of the Gaita app and services.",
  },
};

export default function TermsPage() {
  return <LegalPage file="terms.md" />;
}

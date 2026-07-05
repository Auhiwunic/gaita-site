import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <LegalPage file="terms.md" />;
}

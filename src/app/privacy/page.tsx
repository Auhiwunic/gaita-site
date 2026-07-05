import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Gaita collects, uses and protects your data. Analysis runs on your device; you control what syncs.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy — Gaita",
    description:
      "How Gaita collects, uses and protects your data. Analysis runs on your device; you control what syncs.",
  },
};

export default function PrivacyPage() {
  return <LegalPage file="privacy.md" />;
}

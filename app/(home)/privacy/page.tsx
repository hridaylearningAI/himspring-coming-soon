import type { Metadata } from "next";
import LegalDoc from "../components/LegalDoc";
import { PRIVACY } from "../lib/legal";

/* Indexable, unlike /v1. A privacy policy that search engines cannot see is one
   a visitor cannot find when they go looking for it, and being findable is most
   of the point of publishing one. */
export const metadata: Metadata = {
  title: "Privacy Policy — Himspring",
  description:
    "What the Himspring website collects, who processes it, and how to ask us to correct or delete it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalDoc doc={PRIVACY} />;
}

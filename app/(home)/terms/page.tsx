import type { Metadata } from "next";
import LegalDoc from "../components/LegalDoc";
import { TERMS } from "../lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use · Himspring",
  description: "The terms on which the Himspring website is made available.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDoc doc={TERMS} />;
}

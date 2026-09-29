import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { TermsContent } from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Terms of Use | Charlton Bleecker",
  description:
    "Terms of Use for the Charlton Bleecker Group LLC website, including site access, submissions, and limitations of liability.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28">
        <LegalDoc title="Terms of Use" updated="September 29, 2026">
          <TermsContent />
        </LegalDoc>
      </div>
      <Footer />
    </>
  );
}

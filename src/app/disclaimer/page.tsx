import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { DisclaimerContent } from "@/components/legal/DisclaimerContent";

export const metadata: Metadata = {
  title: "Disclaimer | Charlton Bleecker",
  description:
    "Investment and informational disclaimers for Charlton Bleecker Group LLC website content, criteria, and materials.",
  robots: { index: true, follow: true },
};

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28">
        <LegalDoc title="Disclaimer" updated="September 29, 2026">
          <DisclaimerContent />
        </LegalDoc>
      </div>
      <Footer />
    </>
  );
}

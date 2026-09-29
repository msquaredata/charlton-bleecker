import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { LegalDoc } from "@/components/legal/LegalDoc";
import { PrivacyContent } from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy | Charlton Bleecker",
  description:
    "How Charlton Bleecker Group LLC collects, uses, and protects information submitted through our website and company intake forms.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="pt-24 md:pt-28">
        <LegalDoc title="Privacy Policy" updated="September 29, 2026">
          <PrivacyContent />
        </LegalDoc>
      </div>
      <Footer />
    </>
  );
}

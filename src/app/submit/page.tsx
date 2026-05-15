import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Submit from "@/components/sections/Submit";

export const metadata: Metadata = {
  title: "Submit Your Company | Charlton Bleecker",
  description:
    "Share a concise overview of your business. Estimates are fine — our team responds within one business day.",
};

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 md:pt-28">
        <Submit />
      </main>
      <Footer />
    </>
  );
}

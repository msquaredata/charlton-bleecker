import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Submit from "@/components/sections/Submit";
import { loadFormOptionsFromDisk } from "@/lib/intake/load-form-options-server";

export const metadata: Metadata = {
  title: "Submit Your Company | Charlton Bleecker",
  description:
    "Share a concise overview of your business. Estimates are fine; our team responds within one business day.",
};

export default function SubmitPage() {
  const formOptions = loadFormOptionsFromDisk();

  return (
    <>
      <Navbar />
      <main className="min-h-[100svh] bg-[var(--color-dark)] pt-24 text-white md:pt-28">
        <Submit initialOptions={formOptions} />
      </main>
      <Footer />
    </>
  );
}

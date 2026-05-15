import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.charltonbleecker.com"),
  title: "Charlton Bleecker | Private Holding Company",
  description:
    "Charlton Bleecker acquires and grows enduring B2B businesses — founder-friendly structures, permanent capital, operator-led value creation in Healthcare, Technology, Defense, Professional Services, and Industrials.",
  openGraph: {
    title: "Charlton Bleecker",
    description: "Acquiring and scaling enduring B2B businesses.",
    url: "https://www.charltonbleecker.com",
    siteName: "Charlton Bleecker",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charlton Bleecker",
    description: "Acquiring and scaling enduring B2B businesses.",
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Charlton Bleecker Group LLC",
  url: "https://www.charltonbleecker.com",
  email: "ContactUs@CharltonBleecker.com",
  description:
    "Private holding company acquiring and growing enduring B2B businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgJsonLd),
          }}
        />
        {children}
      </body>
    </html>
  );
}

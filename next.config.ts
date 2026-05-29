import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium-min"],
  outputFileTracingIncludes: {
    "/api/one-pagers/*/pdf": ["./node_modules/@sparticuz/chromium-min/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unavatar.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

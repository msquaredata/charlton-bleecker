import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import type { OnePagerSlug } from "@/lib/one-pagers/slugs";

function resolveSiteOrigin(): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function launchBrowser(): Promise<Browser> {
  const isServerless = Boolean(
    process.env.AWS_LAMBDA_FUNCTION_NAME ?? process.env.VERCEL,
  );

  if (isServerless) {
    const chromium = await import("@sparticuz/chromium");
    return puppeteer.launch({
      args: chromium.default.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: await chromium.default.executablePath(),
      headless: true,
    });
  }

  return puppeteer.launch({
    channel: "chrome",
    headless: true,
  });
}

export async function generateOnePagerPdf(slug: OnePagerSlug): Promise<Buffer> {
  const origin = resolveSiteOrigin();
  const url = `${origin}/one-pagers/${slug}`;
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      preferCSSPageSize: true,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

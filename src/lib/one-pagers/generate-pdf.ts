import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import { isSinglePagePdf, type OnePagerSlug } from "@/lib/one-pagers/slugs";

const LETTER_WIDTH_PX = 816;
const LETTER_HEIGHT_PX = 1056;
const PDF_MARGIN_IN = 0.35;

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
      defaultViewport: { width: LETTER_WIDTH_PX, height: LETTER_HEIGHT_PX },
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
  const singlePage = isSinglePagePdf(slug);
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: LETTER_WIDTH_PX, height: LETTER_HEIGHT_PX });
    await page.goto(url, { waitUntil: "networkidle0", timeout: 60_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    await page.evaluate(
      ({ onePagerSlug, fitSinglePage }) => {
        const shell = document.querySelector(".one-pagers-shell");
        shell?.classList.add("one-pager-pdf-export");
        shell?.setAttribute("data-one-pager", onePagerSlug);
        if (fitSinglePage) {
          shell?.classList.add("one-pager-single-page");
        } else {
          shell?.classList.add("one-pager-multi-page");
        }
      },
      { onePagerSlug: slug, fitSinglePage: singlePage },
    );

    await page.emulateMediaType("print");

    let scale = 1;

    if (singlePage) {
      const contentHeight = await page.evaluate(() => {
        const shell = document.querySelector(".one-pagers-shell");
        return shell ? shell.getBoundingClientRect().height : document.body.scrollHeight;
      });

      const marginPx = PDF_MARGIN_IN * 96 * 2;
      const usableHeight = LETTER_HEIGHT_PX - marginPx;
      const rawScale = usableHeight / contentHeight;
      const maxScale = slug === "model" ? 1.15 : 1;
      scale = Math.min(maxScale, rawScale);
    }

    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      margin: {
        top: `${PDF_MARGIN_IN}in`,
        right: `${PDF_MARGIN_IN}in`,
        bottom: `${PDF_MARGIN_IN}in`,
        left: `${PDF_MARGIN_IN}in`,
      },
      scale,
      preferCSSPageSize: false,
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

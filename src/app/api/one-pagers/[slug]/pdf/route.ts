import {
  generateOnePagerPdf,
  resolvePdfOrigin,
} from "@/lib/one-pagers/generate-pdf";
import { isOnePagerSlug, onePagerPdfFilename } from "@/lib/one-pagers/slugs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isOnePagerSlug(slug)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const origin = resolvePdfOrigin(request);
    const pdf = await generateOnePagerPdf(slug, origin);

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${onePagerPdfFilename(slug)}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[one-pager-pdf]", slug, message, error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}

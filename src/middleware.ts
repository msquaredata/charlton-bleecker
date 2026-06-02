import { NextRequest, NextResponse } from "next/server";
import { checkPublicLeadRateLimit } from "@/lib/public-lead-rate-limit";
import { isPublicLeadPostPath } from "@/lib/public-lead-post-paths";

export async function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  if (request.method !== "POST") {
    return NextResponse.next();
  }

  if (!isPublicLeadPostPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const limited = await checkPublicLeadRateLimit(request.headers);
  if (limited) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many submissions. Please try again in a minute.",
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfter) },
      },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/contact", "/api/lead-intake"],
};

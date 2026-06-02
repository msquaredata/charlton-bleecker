import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendViaResend } from "@/lib/intake/email.js";
import {
  omitSpamGuardFields,
  runPublicLeadSpamGuard,
} from "@/lib/public-lead-spam-guard";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  message: z.string().min(1).max(8000),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const guard = await runPublicLeadSpamGuard(
    request,
    body as Record<string, unknown>,
  );
  if (guard.shortCircuit) {
    return NextResponse.json(guard.body, { status: guard.status });
  }

  const clean = omitSpamGuardFields(body as Record<string, unknown>);
  const parsed = schema.safeParse(clean);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", fields: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  const to =
    process.env.CONTACT_NOTIFY_EMAIL ||
    process.env.INTERNAL_NOTIFY_EMAIL ||
    process.env.TEAM_NOTIFY_EMAIL;

  if (!to) {
    console.error("contact: set CONTACT_NOTIFY_EMAIL or INTERNAL_NOTIFY_EMAIL");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const subject = `Website contact: ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  const result = await sendViaResend({
    to,
    subject,
    text,
    replyTo: email,
  });

  if (result.skipped) {
    return NextResponse.json(
      { error: "Email not configured (RESEND_API_KEY)" },
      { status: 502 },
    );
  }
  if (!result.ok) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

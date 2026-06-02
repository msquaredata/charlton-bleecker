"use client";

import { Turnstile } from "@marsidev/react-turnstile";

type PublicLeadTurnstileProps = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  className?: string;
};

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export function isPublicLeadTurnstileEnabled(): boolean {
  return siteKey.length > 0;
}

export default function PublicLeadTurnstile({
  onToken,
  onExpire,
  className,
}: PublicLeadTurnstileProps) {
  if (!siteKey) return null;

  return (
    <div className={className}>
      <Turnstile
        siteKey={siteKey}
        onSuccess={onToken}
        onExpire={() => {
          onExpire?.();
        }}
      />
    </div>
  );
}

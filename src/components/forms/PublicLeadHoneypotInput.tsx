"use client";

import { forwardRef } from "react";
import { PUBLIC_LEAD_HONEYPOT_FIELD } from "@/lib/public-lead-spam-guard";

const honeypotStyle: React.CSSProperties = {
  position: "absolute",
  left: -9999,
  width: 1,
  height: 1,
  opacity: 0,
  pointerEvents: "none",
};

const PublicLeadHoneypotInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function PublicLeadHoneypotInput(props, ref) {
  return (
    <input
      ref={ref}
      type="text"
      id={PUBLIC_LEAD_HONEYPOT_FIELD}
      name={PUBLIC_LEAD_HONEYPOT_FIELD}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      defaultValue=""
      style={honeypotStyle}
      {...props}
    />
  );
});

export default PublicLeadHoneypotInput;

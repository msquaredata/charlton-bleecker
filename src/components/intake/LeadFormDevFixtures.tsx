"use client";

import { useSyncExternalStore, useState } from "react";

const TEST = {
  firstName: "Jane",
  lastName: "Tester",
  role: "Advisor",
  email: "jane.tester@example.com",
  phone: "555-123-4567",
  companyRepresented: "Test Advisors LLC",
  businessName: "Acme Demo Services Inc.",
  website: "www.acme-demo-services.com",
  industryValue: "FINANCIAL_SERVICES",
  hqCity: "Fort Lauderdale",
  hqState: "FL",
  yearFounded: "2012",
  ownership: "Private Company",
  transitionGoal: "Growth Capital",
  transitionTiming: "< 12 months",
  revenueRangeText: "$2–5M",
  ebitdaMargin: "10–20%",
  leverage: "Manageable",
  keyassets: ["Team", "Contracts", "Technology"],
  notableCustomers:
    "Multi-year agreements with regional utilities; preferred vendor status.",
  fitReason:
    "Recurring revenue, strong retention, succession-ready founder.",
  challenge: ["Succession Planning", "Operational Efficiency"],
  hasManagementTeam: true,
  referralSource: "Website",
  otherDetails: "Dev fixture data — not a real submission.",
} as const;

function showFixturesBar(): boolean {
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search);
  if (q.get("devFixtures") === "0") return false;
  if (q.get("devFixtures") === "1") return true;
  const h = window.location.hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1") return true;
  if (h === "charltonbleecker.com" || h === "www.charltonbleecker.com") return false;
  if (h === "lead-intake-form-cbg.vercel.app") return false;
  if (/\.vercel\.app$/i.test(h) && h.split(".").length > 3) return true;
  return false;
}

function setSelect(form: HTMLFormElement, name: string, value: string) {
  const el = form.elements.namedItem(name);
  if (!(el instanceof HTMLSelectElement)) return;
  el.value = value;
  if (el.value !== value) {
    const opt = Array.from(el.options).find(
      (o) => o.value === value || o.textContent.trim() === value,
    );
    if (opt) el.value = opt.value;
  }
}

function setInput(form: HTMLFormElement, name: string, value: string) {
  const el = form.elements.namedItem(name);
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.value = value;
  }
}

export type LeadFormDevFixturesProps = {
  formId?: string;
  industriesReady: boolean;
  onApplyKeyassets: (values: string[]) => void;
  onApplyChallenge: (values: string[]) => void;
  onClearMultiselects: () => void;
};

export default function LeadFormDevFixtures({
  formId = "leadForm",
  industriesReady,
  onApplyKeyassets,
  onApplyChallenge,
  onClearMultiselects,
}: LeadFormDevFixturesProps) {
  const visible = useSyncExternalStore(
    () => () => {},
    showFixturesBar,
    () => false,
  );
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  if (!visible) return null;

  const badge =
    typeof window !== "undefined" &&
    /\.vercel\.app$/i.test(window.location.hostname)
      ? "PREVIEW"
      : "DEV";

  async function applyTestData() {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;

    if (!industriesReady) {
      setStatus("Loading industries…");
      return;
    }

    setBusy(true);
    setStatus("Applying…");

    setInput(form, "firstName", TEST.firstName);
    setInput(form, "lastName", TEST.lastName);
    setSelect(form, "role", TEST.role);
    setInput(form, "email", TEST.email);
    setInput(form, "phone", TEST.phone);
    setInput(form, "companyRepresented", TEST.companyRepresented);
    setInput(form, "businessName", TEST.businessName);
    setInput(form, "website", TEST.website);
    setSelect(form, "industry", TEST.industryValue);
    setInput(form, "hqCity", TEST.hqCity);
    setSelect(form, "hqState", TEST.hqState);
    setInput(form, "yearFounded", TEST.yearFounded);
    setSelect(form, "ownership", TEST.ownership);
    setSelect(form, "transitionGoal", TEST.transitionGoal);
    setSelect(form, "transitionTiming", TEST.transitionTiming);
    setSelect(form, "revenueRangeText", TEST.revenueRangeText);
    setSelect(form, "ebitdaMargin", TEST.ebitdaMargin);
    setSelect(form, "leverage", TEST.leverage);
    onApplyKeyassets([...TEST.keyassets]);
    setInput(form, "notableCustomers", TEST.notableCustomers);
    setInput(form, "fitReason", TEST.fitReason);
    onApplyChallenge([...TEST.challenge]);
    const mgmt = form.elements.namedItem("hasManagementTeam");
    if (mgmt instanceof HTMLInputElement) mgmt.checked = TEST.hasManagementTeam;
    setSelect(form, "referralSource", TEST.referralSource);
    setInput(form, "otherDetails", TEST.otherDetails);

    setStatus("Test data applied.");
    setBusy(false);
  }

  function clearForm() {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    form.reset();
    onClearMultiselects();
    setStatus("Form cleared.");
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[99999] max-w-[min(420px,calc(100vw-2rem))] rounded-xl border border-white/20 bg-white text-sm text-[#1a1a1a] shadow-lg"
      role="region"
      aria-label="Test data loader"
    >
      <div className="flex flex-wrap items-center gap-2 p-3">
        <span className="rounded-md bg-[#ff4d3d] px-2 py-1 text-[10px] font-bold tracking-wider text-white">
          {badge}
        </span>
        <span className="min-h-[1.2em] flex-1 text-[#555]" aria-live="polite">
          {busy ? `${status} …` : status}
        </span>
        <button
          type="button"
          disabled={busy}
          onClick={() => void applyTestData()}
          className="rounded-lg bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          Load test data
        </button>
        <button
          type="button"
          onClick={clearForm}
          className="rounded-lg border border-[#ccc] bg-[#f5f5f5] px-3 py-1.5 text-xs"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

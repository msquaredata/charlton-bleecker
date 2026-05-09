import {
  mergeTokensPlain,
  buildFullEmailHtml,
  buildFullEmailText,
} from "./outreach-render.js";

const STORAGE_BODY_PREFIX = "outreach-editor-v1-body";
const STORAGE_ENVELOPE = "outreach-envelope-v1";

/** @type {{ ctaUrl: string, logoUrl: string, tagline: string, defaultFrom?: string, defaultReplyTo?: string, envelopeHint?: string, signatureLines: string[], mergeDefaults: Record<string, string>, templates: Array<{ id: string, label: string, group: string, closingPhrase: string, subjectSuggestion: string, defaultBody: string }> } | null} */
let meta = null;
let outreachSecret = "";

function storageKeyBody(templateId) {
  return `${STORAGE_BODY_PREFIX}:${templateId}`;
}

function formatDateLong(d) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function $(id) {
  return document.getElementById(id);
}

function getTemplate(id) {
  return meta?.templates?.find((t) => t.id === id) ?? null;
}

function collectVars() {
  const dateInput = $("dateField").value.trim();
  const date = dateInput || formatDateLong(new Date());
  return {
    recipientFullName: $("recipientFullName").value.trim(),
    companyName: $("companyName").value.trim(),
    sector: $("sector").value.trim(),
    senderName: $("senderName").value.trim(),
    senderTitleLine: $("senderTitleLine").value.trim(),
    senderAddress: $("senderAddress").value.trim(),
    officePhone: $("officePhone").value.trim(),
    date,
  };
}

function updatePreview() {
  if (!meta) return;
  const id = $("templateSelect").value;
  const tpl = getTemplate(id);
  if (!tpl) return;
  const vars = collectVars();
  const mergedPlain = mergeTokensPlain($("bodyEditor").value, vars);
  const html = buildFullEmailHtml({
    mergedBodyPlain: mergedPlain,
    ctaUrl: meta.ctaUrl,
    logoUrl: meta.logoUrl,
    tagline: meta.tagline,
    closingPhrase: tpl.closingPhrase,
    signatureLines: meta.signatureLines,
  });
  $("previewFrame").srcdoc = html;
}

function applyMergeDefaults() {
  if (!meta?.mergeDefaults) return;
  const d = meta.mergeDefaults;
  $("senderName").value = d.senderName ?? "";
  $("senderTitleLine").value = d.senderTitleLine ?? "";
  $("senderAddress").value = d.senderAddress ?? "";
  $("officePhone").value = d.officePhone ?? "";
  $("recipientFullName").value = d.recipientFullName ?? "";
  $("companyName").value = d.companyName ?? "";
  $("sector").value = d.sector ?? "";
}

function loadEnvelopeStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_ENVELOPE);
    if (!raw) return null;
    const o = JSON.parse(raw);
    if (typeof o !== "object" || !o) return null;
    return {
      from: typeof o.from === "string" ? o.from : "",
      replyTo: typeof o.replyTo === "string" ? o.replyTo : "",
    };
  } catch {
    return null;
  }
}

function applyEnvelopeFields() {
  if (!meta) return;
  const hintEl = $("envelopeHint");
  if (hintEl) {
    hintEl.textContent = meta.envelopeHint || "";
  }
  const stored = loadEnvelopeStorage();
  $("fromInput").value =
    stored?.from ?? meta.defaultFrom ?? "";
  $("replyToInput").value =
    stored?.replyTo ?? meta.defaultReplyTo ?? "";
}

function fillTemplateSelect() {
  const sel = $("templateSelect");
  sel.innerHTML = "";
  if (!meta?.templates?.length) return;

  const cold = meta.templates.filter((t) => t.group === "cold");
  const enquiry = meta.templates.filter((t) => t.group === "enquiry");

  function addGroup(label, items) {
    if (!items.length) return;
    const og = document.createElement("optgroup");
    og.label = label;
    for (const t of items) {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = t.label;
      og.appendChild(opt);
    }
    sel.appendChild(og);
  }

  addGroup("Cold outreach", cold);
  addGroup("Enquiry response", enquiry);
}

function persistCurrentBody() {
  const id = $("templateSelect").value;
  if (!id) return;
  localStorage.setItem(storageKeyBody(id), $("bodyEditor").value);
}

function loadBodyForTemplate(templateId) {
  const tpl = getTemplate(templateId);
  if (!tpl) return;
  const saved = localStorage.getItem(storageKeyBody(templateId));
  $("bodyEditor").value = saved !== null ? saved : tpl.defaultBody;
  const vars = collectVars();
  $("subjectInput").value = mergeTokensPlain(tpl.subjectSuggestion, vars);
  updatePreview();
}

function onTemplateChange() {
  loadBodyForTemplate($("templateSelect").value);
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

const debouncedPersist = debounce(() => persistCurrentBody(), 400);

const debouncedPersistEnvelope = debounce(() => {
  try {
    localStorage.setItem(
      STORAGE_ENVELOPE,
      JSON.stringify({
        from: $("fromInput").value,
        replyTo: $("replyToInput").value,
      })
    );
  } catch (_e) {
    /* ignore quota */
  }
}, 400);

async function connect() {
  const secret = $("secretInput").value.trim();
  const errEl = $("gateError");
  errEl.hidden = true;

  if (!secret) {
    errEl.textContent = "Enter the utility secret.";
    errEl.hidden = false;
    return;
  }

  let res;
  try {
    res = await fetch("/api/intro-email-meta", {
      headers: { Authorization: `Bearer ${secret}` },
    });
  } catch (e) {
    errEl.textContent = `Network error: ${e?.message || e}`;
    errEl.hidden = false;
    return;
  }

  if (!res.ok) {
    errEl.textContent =
      res.status === 401
        ? "Unauthorized — check OUTREACH_UTILITY_SECRET."
        : `Failed to load (${res.status}).`;
    errEl.hidden = false;
    return;
  }

  meta = await res.json();
  outreachSecret = secret;

  $("gatePanel").hidden = true;
  $("editorPanel").hidden = false;

  fillTemplateSelect();
  applyMergeDefaults();
  applyEnvelopeFields();

  if ($("templateSelect").options.length) {
    $("templateSelect").selectedIndex = 0;
    onTemplateChange();
  }
}

async function sendEmail() {
  const secret = outreachSecret;
  const statusEl = $("sendStatus");
  statusEl.textContent = "";

  const to = $("toInput").value.trim();
  const subject = $("subjectInput").value.trim();
  if (!to || !subject) {
    statusEl.textContent = "Fill in To and Subject.";
    return;
  }

  if (!meta) {
    statusEl.textContent = "Reload templates first.";
    return;
  }

  const tpl = getTemplate($("templateSelect").value);
  if (!tpl) {
    statusEl.textContent = "Choose a template.";
    return;
  }

  const vars = collectVars();
  const mergedPlain = mergeTokensPlain($("bodyEditor").value, vars);
  const html = buildFullEmailHtml({
    mergedBodyPlain: mergedPlain,
    ctaUrl: meta.ctaUrl,
    logoUrl: meta.logoUrl,
    tagline: meta.tagline,
    closingPhrase: tpl.closingPhrase,
    signatureLines: meta.signatureLines,
  });
  const text = buildFullEmailText({
    mergedBodyPlain: mergedPlain,
    ctaUrl: meta.ctaUrl,
    closingPhrase: tpl.closingPhrase,
    signatureLines: meta.signatureLines,
  });

  statusEl.textContent = "Sending…";

  let res;
  try {
    res = await fetch("/api/send-intro-email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
        from: $("fromInput").value.trim(),
        replyTo: $("replyToInput").value.trim(),
      }),
    });
  } catch (e) {
    statusEl.textContent = `Send failed: ${e?.message || e}`;
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    let msg = data.error || `Error ${res.status}`;
    if (data.detail) {
      msg += `: ${data.detail}`;
    }
    statusEl.textContent = msg;
    return;
  }

  statusEl.textContent = "Sent.";
}

function resetTemplate() {
  const id = $("templateSelect").value;
  const tpl = getTemplate(id);
  if (!tpl) return;
  localStorage.removeItem(storageKeyBody(id));
  $("bodyEditor").value = tpl.defaultBody;
  const vars = collectVars();
  $("subjectInput").value = mergeTokensPlain(tpl.subjectSuggestion, vars);
  updatePreview();
}

function exportJson() {
  if (!meta) return;
  const bodies = {};
  for (const t of meta.templates) {
    const v = localStorage.getItem(storageKeyBody(t.id));
    if (v !== null) bodies[t.id] = v;
  }
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    bodies,
    mergeFields: collectVars(),
    envelope: {
      from: $("fromInput").value,
      replyTo: $("replyToInput").value,
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "outreach-templates-backup.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      if (data.bodies && typeof data.bodies === "object") {
        for (const [id, text] of Object.entries(data.bodies)) {
          if (typeof text === "string") {
            localStorage.setItem(storageKeyBody(id), text);
          }
        }
      }
      if (data.mergeFields && typeof data.mergeFields === "object") {
        const m = data.mergeFields;
        if (m.recipientFullName != null)
          $("recipientFullName").value = String(m.recipientFullName);
        if (m.companyName != null) $("companyName").value = String(m.companyName);
        if (m.sector != null) $("sector").value = String(m.sector);
        if (m.senderName != null) $("senderName").value = String(m.senderName);
        if (m.senderTitleLine != null)
          $("senderTitleLine").value = String(m.senderTitleLine);
        if (m.senderAddress != null)
          $("senderAddress").value = String(m.senderAddress);
        if (m.officePhone != null) $("officePhone").value = String(m.officePhone);
        if (m.date != null) $("dateField").value = String(m.date);
      }
      if (data.envelope && typeof data.envelope === "object") {
        const env = data.envelope;
        if (env.from != null) $("fromInput").value = String(env.from);
        if (env.replyTo != null) $("replyToInput").value = String(env.replyTo);
        try {
          localStorage.setItem(
            STORAGE_ENVELOPE,
            JSON.stringify({
              from: $("fromInput").value,
              replyTo: $("replyToInput").value,
            })
          );
        } catch (_e) {
          /* ignore */
        }
      }
      onTemplateChange();
      $("sendStatus").textContent = "Import applied.";
    } catch (_e) {
      $("sendStatus").textContent = "Invalid JSON file.";
    }
  };
  reader.readAsText(file);
}

function wire() {
  $("btnConnect").addEventListener("click", () => connect());

  $("templateSelect").addEventListener("change", () => {
    onTemplateChange();
  });

  $("btnResetTemplate").addEventListener("click", () => resetTemplate());

  $("btnSend").addEventListener("click", () => sendEmail());

  $("btnExport").addEventListener("click", () => exportJson());

  $("importFile").addEventListener("change", (ev) => {
    const f = ev.target.files?.[0];
    if (f) importJson(f);
    ev.target.value = "";
  });

  const inputs = [
    "recipientFullName",
    "companyName",
    "sector",
    "senderName",
    "senderTitleLine",
    "senderAddress",
    "officePhone",
    "dateField",
    "bodyEditor",
  ];
  for (const id of inputs) {
    $(id).addEventListener("input", () => {
      updatePreview();
      if (id === "bodyEditor") debouncedPersist();
    });
  }

  $("fromInput").addEventListener("input", () => debouncedPersistEnvelope());
  $("replyToInput").addEventListener("input", () => debouncedPersistEnvelope());

  $("bodyEditor").addEventListener("blur", () => persistCurrentBody());
}

wire();

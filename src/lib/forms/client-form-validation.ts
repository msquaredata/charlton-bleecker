export const FORM_REQUIRED_FIELDS_MESSAGE =
  "Please complete all required fields marked with * before submitting.";

/** Returns false when the form has invalid required/pattern fields. Focuses the first invalid control. */
export function validateFormClient(form: HTMLFormElement): boolean {
  if (form.checkValidity()) return true;

  const first = form.querySelector<HTMLElement>(
    "input:not([type='hidden']):invalid, select:invalid, textarea:invalid",
  );
  first?.focus();

  return false;
}

export function scrollToFormFeedback(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
}

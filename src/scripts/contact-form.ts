import { submitContact } from "../lib/contact";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById(
    "contact-form",
  ) as HTMLFormElement | null;
  const success = document.getElementById("success");
  const submitBtn = document.getElementById(
    "submit-btn",
  ) as HTMLButtonElement | null;
  const formError = document.getElementById("cf-form-error");
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const fields = ["name", "email", "subject", "message"] as const;

  const getField = (name: string) =>
    form.elements.namedItem(name) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null;

  const getValue = (name: string): string => {
    const field = getField(name);
    return field ? field.value.trim() : "";
  };

  const showError = (name: string) => {
    form
      .querySelector<HTMLElement>(`[data-error-for="${name}"]`)
      ?.classList.remove("hidden");
    getField(name)?.setAttribute("aria-invalid", "true");
  };

  const clearError = (name: string) => {
    form
      .querySelector<HTMLElement>(`[data-error-for="${name}"]`)
      ?.classList.add("hidden");
    getField(name)?.removeAttribute("aria-invalid");
  };

  // Clear a field's error as the user edits it.
  fields.forEach((name) => {
    const field = getField(name);
    field?.addEventListener("input", () => clearError(name));
    field?.addEventListener("change", () => clearError(name));
  });

  const validate = (): boolean => {
    let firstInvalid: string | null = null;
    const fail = (name: string) => {
      showError(name);
      if (!firstInvalid) firstInvalid = name;
    };
    const name = getValue("name");
    const email = getValue("email");
    const subject = getValue("subject");
    const message = getValue("message");

    if (!name) fail("name");
    if (!email || !emailRe.test(email)) fail("email");
    if (!subject) fail("subject");
    if (!message) fail("message");

    // Move focus to the first invalid field so keyboard/AT users land on it.
    if (firstInvalid) getField(firstInvalid)?.focus();
    return firstInvalid === null;
  };

  const setLoading = (loading: boolean, label: string) => {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-disabled", String(loading));
    submitBtn.textContent = label;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    formError?.classList.add("hidden");
    if (!validate()) return;

    setLoading(true, "Sending…");
    let result: { ok: boolean; message: string };
    try {
      result = await submitContact({
        name: getValue("name"),
        email: getValue("email"),
        subject: getValue("subject"),
        message: getValue("message"),
      });
    } catch {
      result = { ok: false, message: "Something went wrong. Please try again." };
    }

    if (result.ok) {
      form.classList.add("hidden");
      success?.classList.remove("hidden");
      // Update the single step header in place (no duplicate Step 2 label).
      const indicator = document.getElementById("step-indicator");
      const title = document.getElementById("step-title");
      indicator?.classList.add("text-center");
      title?.classList.add("text-center");
      if (indicator) indicator.textContent = "Step 2 of 2";
      if (title)
        title.textContent =
          "A free quick call, we'll cover the points on the left.";
    } else {
      // Re-enable the form and surface the error inline.
      setLoading(false, "Continue to Book a Call");
      if (formError) {
        formError.textContent = result.message;
        formError.classList.remove("hidden");
      }
    }
  });
});

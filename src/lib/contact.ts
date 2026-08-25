export interface ContactPayload { name: string; email: string; subject: string; message: string; }

/**
 * Contact submit handler — STUB (intentionally not wired yet).
 *
 * The form currently shows the success state WITHOUT sending anything anywhere.
 * TODO(next-deploy): wire a real provider before relying on submissions —
 *   POST `payload` to Web3Forms / Formspree / a custom endpoint via fetch(),
 *   return { ok:false } on failure so the UI can surface an error, and revisit
 *   the Privacy Policy wording (it states form data is collected).
 */
export async function submitContact(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
  // TODO(next-deploy): POST payload to the chosen provider here.
  console.info('[contact] submit (stub, not sent):', payload);
  return { ok: true, message: 'Received (stub, not wired to a provider yet).' };
}

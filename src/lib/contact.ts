import { CONTACT_GATEWAY } from "../consts";

export interface ContactPayload { name: string; email: string; subject: string; message: string; }

// Escape user-supplied text before embedding it in the email HTML, so a lead
// can't break the layout or inject markup.
const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// Plain, neat HTML email for the lead notification. Neutral palette (near-black
// text on white, grey labels), simple aligned table, no cards/heavy colour —
// easy to read. Table layout + inline styles for email-client compatibility.
function buildLeadEmailHtml(p: ContactPayload): string {
  const name = esc(p.name);
  const email = esc(p.email);
  const subject = esc(p.subject);
  const message = esc(p.message).replace(/\n/g, "<br>");

  const row = (label: string, value: string): string => `
            <tr>
              <td style="padding:7px 0;font-size:14px;color:#6b7280;width:88px;vertical-align:top;">${label}</td>
              <td style="padding:7px 0;font-size:14px;color:#111827;">${value}</td>
            </tr>`;

  return `<div style="margin:0;padding:0;background:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:28px 20px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
        <tr><td style="padding-bottom:16px;border-bottom:1px solid #e5e7eb;">
          <p style="margin:0;font-size:17px;font-weight:700;color:#111827;">New portfolio enquiry</p>
        </td></tr>
        <tr><td style="padding-top:16px;">
          <p style="margin:0 0 6px;font-size:14px;color:#6b7280;">Enquirer Details</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row("Name", name)}${row("Email", `<a href="mailto:${email}" style="color:#111827;">${email}</a>`)}${row("Subject", subject)}
          </table>
        </td></tr>
        <tr><td style="padding-top:18px;">
          <p style="margin:0 0 6px;font-size:14px;color:#6b7280;">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#111827;">${message}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`;
}

// Contact submit handler — sends the lead as a formatted HTML email.
export async function submitContact(
  payload: ContactPayload
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch(`${CONTACT_GATEWAY.url}/send-public-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-public-key": CONTACT_GATEWAY.publicKey,
      },
      body: JSON.stringify({
        text: '',
        html: buildLeadEmailHtml(payload),
        subject: `Portfolio enquiry: ${payload.subject}`,
      }),
    });

    // Gateway returns { success: true, messageId } | { success: false, error }.
    const data = (await res.json().catch(() => null)) as {
      success?: boolean;
      error?: string;
    } | null;

    if (res.ok && data?.success) {
      return { ok: true, message: "Message sent." };
    }
    return {
      ok: false,
      message: data?.error || "Could not send your message. Please try again.",
    };
  } catch {
    return {
      ok: false,
      message: "Network error - please try again, or email me directly.",
    };
  }
}

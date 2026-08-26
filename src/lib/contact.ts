import { CONTACT_GATEWAY } from '../consts';

export interface ContactPayload { name: string; email: string; subject: string; message: string; }

// Contact submit handler — submits the enquiry
export async function submitContact(payload: ContactPayload): Promise<{ ok: boolean; message: string }> {
  const text = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Subject: ${payload.subject}`,
    '',
    payload.message,
  ].join('\n');

  try {
    const res = await fetch(`${CONTACT_GATEWAY.url}/send-public-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': CONTACT_GATEWAY.publicKey,
      },
      body: JSON.stringify({
        text,
        subject: `Portfolio enquiry: ${payload.subject}`,
      }),
    });

    // Gateway returns { success: true, messageId } | { success: false, error }.
    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; error?: string }
      | null;

    if (res.ok && data?.success) {
      return { ok: true, message: 'Message sent.' };
    }
    return {
      ok: false,
      message: data?.error || 'Could not send your message. Please try again.',
    };
  } catch {
    return {
      ok: false,
      message: 'Network error — please try again, or email me directly.',
    };
  }
}

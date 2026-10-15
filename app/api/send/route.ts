import { Resend } from 'resend';

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 5000;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json({ error: "Email service not configured" }, 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const { fullname, message, website } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: the "website" field is hidden from humans, so only bots fill it in.
  if (typeof website === 'string' && website.trim() !== '') {
    return json({ ok: true });
  }

  if (typeof fullname !== 'string' || typeof message !== 'string') {
    return json({ error: "Missing fields" }, 400);
  }

  const name = fullname.replace(/[\r\n]+/g, ' ').trim();
  const text = message.trim();

  if (!name || !text) {
    return json({ error: "Missing fields" }, 400);
  }

  if (name.length > MAX_NAME_LENGTH || text.length > MAX_MESSAGE_LENGTH) {
    return json({ error: "Message too long" }, 400);
  }

  try {
    const resend = new Resend(apiKey);
    // Отправляем через Resend API
    const { error } = await resend.emails.send({
      from: 'CircuitLabs <contact@circuitlabs.io>',
      to: ['lana@circuitlabs.io'], // массив адресов
      subject: `New message from ${name}`,
      text: `Name: ${name}\nMessage:\n${text}`,
      html: `
        <h3>New Message Form Website</h3>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return json({ error: "Failed to send message" }, 500);
    }

    return json({ ok: true });

  } catch (error) {
    console.error('Server error:', error);
    return json({ error: 'Internal server error' }, 500);
  }
}

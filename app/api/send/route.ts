import { Resend } from 'resend';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      { status: 503 }
    );
  }

  const { fullname, message } = await request.json();

  if (!fullname || !message) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 });
  }

  try {
    const resend = new Resend(apiKey);
    // Отправляем через Resend API
    const { data, error } = await resend.emails.send({
      from: 'CircuitLabs <contact@circuitlabs.io>',
      to: ['lana@circuitlabs.io'], // массив адресов
      subject: `New message from ${fullname}`,
      text: `Name: ${fullname}\nMessage:\n${message}`,
      html: `
        <h3>New Message Form Website</h3>
        <p><strong>Name:</strong> ${fullname}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, data }));

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
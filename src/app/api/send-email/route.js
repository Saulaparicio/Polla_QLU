import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function POST(request) {
  try {
    const { to, subject, html } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      return Response.json(
        { error: "Falta la API Key de Resend en el servidor. Configura RESEND_API_KEY." },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Polla Mundialista <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

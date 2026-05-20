import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;
  const { name, email, subject, message } = payload;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ ok: true, preview: true });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_TO_EMAIL ?? "hello@saransh.dev";
  const from = process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject: `Portfolio inquiry: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`
  });

  return NextResponse.json({ ok: true });
}

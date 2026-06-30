import { NextResponse } from "next/server";
import { Resend } from "resend";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// `from` must be on a domain verified in Resend — here the updates.himspring.com
// subdomain. The admin notification is delivered to the real inbox below.
// Both are overridable via env without a code change.
const FROM = process.env.RESEND_FROM || "Himspring <hello@updates.himspring.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@himspring.com";

function ackEmail() {
  const subject = "You're on the list — Himspring";
  const text =
    "Thank you for joining the Himspring list.\n\n" +
    "Something pure is on its way — the essence of elevation, reserved for the few. " +
    "We'll be in touch the moment we launch.\n\n— Himspring";
  const html = `
  <div style="margin:0;padding:32px 0;background:#03101f;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0"
               style="max-width:480px;width:100%;background:#061a33;border:1px solid rgba(202,191,114,0.18);border-radius:14px;overflow:hidden;">
          <tr><td style="padding:40px 40px 8px;">
            <p style="margin:0 0 18px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#cabf72;">Himspring</p>
            <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#ffffff;font-weight:400;">You're on the list.</h1>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#cdd7e3;">
              Thank you for joining us. Something pure is on its way — the essence of
              elevation, reserved for the few.
            </p>
            <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#cdd7e3;">
              We'll be in touch the moment we launch.
            </p>
            <p style="margin:0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#9fb0c2;">— Himspring</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
  return { subject, text, html };
}

function adminEmail(email) {
  const subject = `New Himspring signup: ${email}`;
  const text = `A new visitor joined the Himspring waitlist.\n\nEmail: ${email}\nTime: ${new Date().toISOString()}`;
  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;color:#0b1722;">
    <h2 style="margin:0 0 12px;font-size:18px;">New Himspring signup</h2>
    <p style="margin:0 0 6px;font-size:15px;"><strong>Email:</strong>
      <a href="mailto:${email}" style="color:#0b66c2;">${email}</a></p>
    <p style="margin:0;font-size:13px;color:#6b7785;">${new Date().toUTCString()}</p>
  </div>`;
  return { subject, text, html };
}

export async function POST(request) {
  let email = "";
  try {
    const body = await request.json();
    email = (body?.email || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  // The subscriber acknowledgement is the user-facing success — if it fails, the
  // request fails. The admin notification is best-effort: if it errors we log it
  // but still report success so the visitor isn't penalised for an internal issue.
  const ack = ackEmail();
  const { error: ackError } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: ack.subject,
    html: ack.html,
    text: ack.text,
  });

  if (ackError) {
    console.error("Acknowledgement email failed:", ackError);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 502 }
    );
  }

  const admin = adminEmail(email);
  const { error: adminError } = await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    replyTo: email,
    subject: admin.subject,
    html: admin.html,
    text: admin.text,
  });

  if (adminError) {
    console.error("Admin notification email failed:", adminError);
  }

  return NextResponse.json({ ok: true });
}

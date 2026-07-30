import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  CONTACT_BASE_FIELDS,
  CONTACT_EMAIL,
  CONTACT_TOPICS,
  CV_EXTENSIONS,
  CV_MAX_BYTES,
  type ContactField,
  type ContactTopic,
  type ContactTopicId,
} from "@/app/(home)/lib/content";

/* Contact enquiries. Multipart rather than JSON because Careers carries a CV.

   The topic definitions are imported rather than restated: the browser and this
   handler walk the same field list, so a field added to CONTACT_TOPICS is
   validated, formatted and delivered without touching this file. Importing from
   a route group is fine — (home) is a URL-shaping segment, not a boundary. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_FIELD = 2000;
const MAX_MESSAGE = 5000;

const FROM = process.env.RESEND_FROM || "Himspring <hello@updates.himspring.com>";
/* the address the footer publishes, so an enquiry sent before the four mailboxes
   are configured still lands where the site says to write */
const FALLBACK = process.env.CONTACT_EMAIL_DEFAULT || CONTACT_EMAIL;

/* One mailbox per queue, because the whole point of the four topics is that
   different people answer them. Each falls back to the general address, so an
   unset variable delays nobody's reply — it just lands in the shared inbox. */
const MAILBOX: Record<ContactTopicId, string> = {
  sales: process.env.CONTACT_EMAIL_SALES || FALLBACK,
  media: process.env.CONTACT_EMAIL_MEDIA || FALLBACK,
  careers: process.env.CONTACT_EMAIL_CAREERS || FALLBACK,
  support: process.env.CONTACT_EMAIL_SUPPORT || FALLBACK,
};

const SUBJECT: Record<ContactTopicId, string> = {
  sales: "Sales & distribution enquiry",
  media: "Media enquiry",
  careers: "Job application",
  support: "Support request",
};

/* Everything from the request is untrusted and both emails are HTML, so every
   interpolated value goes through this. The plain-text alternative needs no
   escaping but gets the raw value, never this one. */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* A header is one line by definition, so a newline in a value that reaches one
   is either a mistake or an injection attempt. */
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const extensionOf = (name: string) => name.slice(name.lastIndexOf(".") + 1).toLowerCase();

type Row = { label: string; value: string };

function rowsHtml(rows: readonly Row[]) {
  return rows
    .map(
      ({ label, value }) => `
      <tr>
        <td style="padding:8px 16px 8px 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8a94a0;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;font-size:15px;color:#16191c;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");
}

function adminEmail(topic: ContactTopic, rows: readonly Row[], message: string, hasCv: boolean) {
  const from = rows.find((r) => r.label === "Full name")?.value || "Someone";
  const subject = `${SUBJECT[topic.id]}: ${oneLine(from)}`;

  const text = [
    SUBJECT[topic.id],
    "",
    ...rows.map((r) => `${r.label}: ${r.value}`),
    "",
    `${topic.prompt}:`,
    message,
    hasCv ? "\nCV attached." : "",
  ].join("\n");

  const html = `
  <div style="font-family:Helvetica,Arial,sans-serif;color:#16191c;max-width:640px;">
    <p style="margin:0 0 4px;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#b8933f;">Himspring · ${escapeHtml(topic.label)}</p>
    <h2 style="margin:0 0 20px;font-size:20px;font-weight:400;">${escapeHtml(SUBJECT[topic.id])}</h2>
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border-top:1px solid #e5dac0;">
      ${rowsHtml(rows)}
    </table>
    <p style="margin:24px 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8a94a0;">${escapeHtml(topic.prompt)}</p>
    <p style="margin:0;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
    ${hasCv ? '<p style="margin:24px 0 0;font-size:13px;color:#5e656b;">CV attached.</p>' : ""}
  </div>`;

  return { subject, text, html };
}

function ackEmail(topic: ContactTopic, message: string) {
  const subject = "We have your message · Himspring";
  const text =
    `Thank you for writing to Himspring.\n\n${topic.reply}\n\n` +
    `For your records, this is what you sent:\n\n${message}\n\nHimspring`;
  const html = `
  <div style="margin:0;padding:32px 0;background:#03101f;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0"
               style="max-width:480px;width:100%;background:#061a33;border:1px solid rgba(202,191,114,0.18);border-radius:14px;overflow:hidden;">
          <tr><td style="padding:40px;">
            <p style="margin:0 0 18px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#cabf72;">Himspring</p>
            <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#ffffff;font-weight:400;">We have your message.</h1>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#cdd7e3;">${escapeHtml(topic.reply)}</p>
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8fa0b4;">What you sent</p>
            <p style="margin:0 0 28px;padding-left:14px;border-left:1px solid rgba(202,191,114,0.3);font-size:14px;line-height:1.6;color:#cdd7e3;white-space:pre-wrap;">${escapeHtml(message)}</p>
            <p style="margin:0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#9fb0c2;">Himspring</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>`;
  return { subject, text, html };
}

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Invalid request.");
  }

  const read = (key: string) => {
    const value = form.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  /* A filled honeypot is a bot, and telling a bot it was caught is how it learns
     to stop filling the field. It gets the same 200 a person gets. */
  if (read("company_website")) return NextResponse.json({ ok: true });

  const topic = CONTACT_TOPICS.find((t) => t.id === read("topic"));
  if (!topic) return bad("Unknown enquiry type.");

  const fields: readonly ContactField[] = [...CONTACT_BASE_FIELDS, ...topic.fields];
  const rows: Row[] = [];

  for (const field of fields) {
    const value = read(field.name);
    if (!value) {
      if (!field.optional) return bad(`${field.label} is required.`);
      continue;
    }
    if (value.length > MAX_FIELD) return bad(`${field.label} is too long.`);
    if (field.type === "email" && !EMAIL_RE.test(value)) return bad("Please enter a valid email address.");
    /* the client offers a fixed list, so anything else came from somewhere else */
    if (field.type === "select" && !field.options?.includes(value)) return bad(`${field.label} is not a valid choice.`);
    rows.push({ label: field.label, value });
  }

  const message = read("message");
  if (message.length < 10) return bad("Please tell us a little more.");
  if (message.length > MAX_MESSAGE) return bad("That message is longer than we can accept.");

  const replyTo = read("email");

  const cv = form.get("cv");
  const file = cv instanceof File && cv.size > 0 ? cv : null;
  if (topic.cv && !file) return bad("Please attach your CV.");
  if (file) {
    /* re-checked here, not only in the browser: the client validation is a
       courtesy and this is the boundary that actually holds */
    if (!topic.cv) return bad("This enquiry type does not take an attachment.");
    if (file.size > CV_MAX_BYTES) return bad("That file is larger than we can accept.");
    if (!(CV_EXTENSIONS as readonly string[]).includes(extensionOf(file.name))) {
      return bad("We can read PDF, DOC and DOCX.");
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return bad("Email service is not configured.", 500);
  }
  const resend = new Resend(apiKey);

  const attachments = file
    ? [{ filename: oneLine(file.name).slice(0, 120), content: Buffer.from(await file.arrayBuffer()) }]
    : undefined;

  /* The notification is the one that must land — it is the enquiry. Unlike the
     subscribe route the order is inverted for that reason: if this fails the
     visitor is told to try again, because otherwise they would be thanked for a
     message nobody received. */
  const admin = adminEmail(topic, rows, message, Boolean(file));
  const { error: adminError } = await resend.emails.send({
    from: FROM,
    to: MAILBOX[topic.id],
    replyTo,
    subject: admin.subject,
    html: admin.html,
    text: admin.text,
    attachments,
  });

  if (adminError) {
    console.error("Contact notification failed:", adminError);
    return bad("Something went wrong. Please try again.", 502);
  }

  /* Best-effort: the enquiry is already safely with the team, so a bounced
     acknowledgement is not the visitor's problem to solve by resending. */
  const ack = ackEmail(topic, message);
  const { error: ackError } = await resend.emails.send({
    from: FROM,
    to: replyTo,
    subject: ack.subject,
    html: ack.html,
    text: ack.text,
  });

  if (ackError) console.error("Contact acknowledgement failed:", ackError);

  return NextResponse.json({ ok: true });
}

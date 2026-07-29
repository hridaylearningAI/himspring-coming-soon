"use client";

import { useState } from "react";
import { Icon } from "./icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | done

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !EMAIL_RE.test(form.email) || !form.message.trim())
      return;
    setStatus("submitting");
    // Simulate network latency — swap for a real API call when backend is ready
    await new Promise((r) => setTimeout(r, 900));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="cform__success">
        <span className="cform__success-icon" aria-hidden="true">
          {Icon.check}
        </span>
        <h3>Thank you for reaching out.</h3>
        <p>
          We&rsquo;ve received your message and will reply within 24&nbsp;hours.
        </p>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form className="cform" onSubmit={handleSubmit} noValidate>
      <div className="cform__row">
        <input
          className="cform__input"
          type="text"
          name="name"
          placeholder="Your Name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="cform__input"
          type="email"
          name="email"
          placeholder="Your Email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="cform__field">
        <input
          className="cform__input"
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
        />
      </div>
      <div className="cform__field">
        <textarea
          className="cform__textarea"
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>
      <div className="cform__footer">
        <button
          className="btn btn--ink"
          type="submit"
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? (
            "Sending…"
          ) : (
            <>
              Send Message{" "}
              <span className="btn__arrow">{Icon.arrow}</span>
            </>
          )}
        </button>
        <span className="cform__privacy">
          <span aria-hidden="true">{Icon.lock}</span>
          Your information is safe with us.
        </span>
      </div>
    </form>
  );
}

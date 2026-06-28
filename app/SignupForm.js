"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | error | done

  function submit() {
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    // → here is where a real backend / Mailchimp / API call would go
  }

  const note =
    status === "error"
      ? "Please enter a valid email address."
      : "You're on the list — we'll be in touch the moment we launch.";

  const className =
    "signup" +
    (status === "done" ? " is-done" : "") +
    (status === "error" ? " is-error" : "");

  return (
    <div className={className}>
      <span className="signup__label">Be the first to know</span>
      <div className="field">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email address"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
        />
        <button type="button" aria-label="Notify me" onClick={submit}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="18" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
      <p className="signup__note" role="status">
        {note}
      </p>
    </div>
  );
}

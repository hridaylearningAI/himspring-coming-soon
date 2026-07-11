"use client";

import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NotifyForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error | done
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email address.");

  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  const note =
    status === "error"
      ? errorMsg
      : status === "sending"
        ? "Sending…"
        : status === "done"
          ? "You're on the list. We'll be in touch the moment we launch."
          : "";

  return (
    <form
      className={`notify${status === "done" ? " is-done" : ""}${status === "error" ? " is-error" : ""}`}
      onSubmit={submit}
      noValidate
    >
      <div className="notify__field">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Enter your email address"
          aria-label="Email address"
          value={email}
          disabled={status === "sending" || status === "done"}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn--ink" type="submit" disabled={status === "sending" || status === "done"}>
          Notify Me
        </button>
      </div>
      <p className="notify__note" role={status === "error" ? "alert" : "status"}>
        {note}
      </p>
    </form>
  );
}

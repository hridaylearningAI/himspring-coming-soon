"use client";

import { useState, useRef, useEffect } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* variant="card" (default): the membership card above the email form —
   the homepage CTA band. variant="compact": the plain pill form for the footer
   and other quiet placements. */
export default function NotifyForm({ variant = "card" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | error | done
  const [errorMsg, setErrorMsg] = useState("Please enter a valid email address.");
  const [serialNumber, setSerialNumber] = useState("");
  const cardRef = useRef(null);
  const tiltOn = useRef(false);

  // membership number is client-only decoration; set after mount so SSR markup matches
  useEffect(() => {
    if (variant !== "card") return;
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const dateCode = new Date().toISOString().slice(2, 7).replace("-", "");
    setSerialNumber(`Nº HS-${dateCode}-${randomHex}`);
    tiltOn.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, [variant]);

  // gentle 3D tilt toward the cursor — desktop pointers only, never reduced motion
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || !tiltOn.current) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
    card.style.setProperty("--sheen-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--sheen-y", `${(y / rect.height) * 100}%`);
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
    card.style.setProperty("--sheen-x", `50%`);
    card.style.setProperty("--sheen-y", `50%`);
  };

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
        ? "One moment…"
        : status === "done"
          ? "Your place is held. We'll write the moment we launch."
          : "";

  const form = (
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
          {variant === "card" ? "Join the Few" : "Notify Me"}
        </button>
      </div>
      <p className="notify__note" role={status === "error" ? "alert" : "status"}>
        {note}
      </p>
    </form>
  );

  if (variant !== "card") return form;

  return (
    <div className="waitlist">
      {/* The membership card — turns over once a place is reserved */}
      <div
        className={`elite-card-wrap ${status === "done" ? "is-flipped" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={cardRef} className="elite-card">
          <div className="elite-card__front">
            <div className="elite-card__noise"></div>
            <div className="elite-card__sheen"></div>
            <div className="elite-card__logo-wrap">
              <div className="elite-card__monogram">hs</div>
              <div className="elite-card__brand">HIMSPRING</div>
            </div>

            <div className="elite-card__details">
              <div className="elite-card__row">
                <span className="elite-card__label">Member</span>
                <span className="elite-card__val elite-card__val--email truncate">
                  {email.trim() ? email.trim() : "Reserved for you"}
                </span>
              </div>
              <div className="elite-card__row">
                <span className="elite-card__label">Standing</span>
                <span className="elite-card__val elite-card__val--gold">
                  {status === "done" ? "Among the first" : "Awaiting launch"}
                </span>
              </div>
            </div>

            <div className="elite-card__footer">
              <span className="elite-card__serial">{serialNumber}</span>
              <span className="elite-card__club">Reserved for the Few</span>
            </div>
          </div>

          <div className="elite-card__back">
            <div className="elite-card__noise"></div>
            <div className="elite-card__back-content">
              <div className="elite-card__back-emblem">hs</div>
              <h4 className="elite-card__back-title">Your place is held</h4>
              <p className="elite-card__back-text">
                You are among the first. Launch news and the first allocation will reach you by
                email — quietly, and before anyone else.
              </p>
              <div className="elite-card__back-stamp">Reserved for the Few</div>
            </div>
          </div>
        </div>
      </div>

      {form}
    </div>
  );
}

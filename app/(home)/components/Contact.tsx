"use client";

import { useId, useRef, useState } from "react";
import {
  CONTACT_BASE_FIELDS,
  CONTACT_TOPICS,
  CV_ACCEPT,
  CV_EXTENSIONS,
  CV_MAX_BYTES,
  type ContactField,
  type ContactTopic,
} from "../lib/content";
import Reveal from "./Reveal";

/* [09b] contact.

   Replaces the single-field launch list. Four queues — trade, press, careers,
   support — chosen with a radio group that reshapes the fields under it.

   Native radios rather than buttons with role="radio": the group then gets
   arrow-key navigation, a single tab stop and the right announcement for free,
   and the visible card is a <label>, so the whole card is the hit area. The
   input is only visually hidden, never display:none, or it would stop being
   focusable.

   The fields themselves are read from CONTACT_TOPICS, which the route handler
   also walks — one declaration, so nothing can be collected here and dropped on
   the way out. */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE = "message";
const CONSENT = "consent";
/* the bot trap. Named like a field a naive autofiller would want to complete and
   left out of the visible flow entirely; anything in it means the submission was
   not typed by a person. */
const TRAP = "company_website";

type Values = Record<string, string>;
type Errors = Record<string, string>;

const fieldsFor = (topic: ContactTopic): readonly ContactField[] => [
  ...CONTACT_BASE_FIELDS,
  ...topic.fields,
];

/* A select shows its first option the moment it renders, so that option is
   already the answer — state has to say so too, or validation reads an empty
   string and rejects a field the visitor can see is filled in. */
const selectDefaults = (topic: ContactTopic): Values =>
  Object.fromEntries(
    fieldsFor(topic).flatMap((f) => {
      const first = f.type === "select" ? f.options?.[0] : undefined;
      return first ? [[f.name, first] as const] : [];
    }),
  );

const without = (values: Errors, key: string): Errors => {
  const { [key]: _dropped, ...rest } = values;
  return rest;
};

const prettyBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / (1024 * 1024)).toFixed(1)} MB`;

const extensionOf = (name: string) => name.slice(name.lastIndexOf(".") + 1).toLowerCase();

export default function Contact() {
  const [topicId, setTopicId] = useState<ContactTopic["id"]>("sales");
  /* Keyed by field name. Only the shared block carries across a topic switch —
     someone reading all four before deciding should not retype their name and
     email each time — while the topic's own fields are dropped and reseeded.
     They have to be: `role` means "your job title" under Sales and "the job you
     want" under Careers, so carrying values by name alone would put one topic's
     answer under another topic's question. */
  const [values, setValues] = useState<Values>(() => selectDefaults(CONTACT_TOPICS[0]));
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [failure, setFailure] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const topic = CONTACT_TOPICS.find((t) => t.id === topicId) ?? CONTACT_TOPICS[0];
  const fields = fieldsFor(topic);
  const fieldId = (name: string) => `${uid}-${name}`;
  const set = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    /* clear this field's error as soon as it is touched, but never re-run the
       whole validation on keystroke — flagging a half-typed email as malformed
       is the thing that makes inline validation feel adversarial */
    setErrors((e) => without(e, name));
  };

  const pickFile = (chosen: File | null) => {
    if (!chosen) return;
    if (!(CV_EXTENSIONS as readonly string[]).includes(extensionOf(chosen.name))) {
      setErrors((e) => ({ ...e, cv: "We can read PDF, DOC and DOCX." }));
      return;
    }
    if (chosen.size > CV_MAX_BYTES) {
      setErrors((e) => ({ ...e, cv: `That file is ${prettyBytes(chosen.size)}. The limit is ${prettyBytes(CV_MAX_BYTES)}.` }));
      return;
    }
    setErrors((e) => without(e, "cv"));
    setFile(chosen);
  };

  const clearFile = () => {
    setFile(null);
    /* the input keeps its FileList after a React re-render, so re-picking the
       same file would not fire change again without this */
    if (fileRef.current) fileRef.current.value = "";
  };

  const changeTopic = (next: ContactTopic) => {
    setTopicId(next.id);
    setValues((v) => {
      const kept: Values = { [MESSAGE]: v[MESSAGE] ?? "", [CONSENT]: v[CONSENT] ?? "" };
      for (const field of CONTACT_BASE_FIELDS) kept[field.name] = v[field.name] ?? "";
      return { ...kept, ...selectDefaults(next) };
    });
    /* an attachment picked under Careers has nowhere to go under the other three,
       and would be sent with a Support ticket if it survived the switch */
    if (!next.cv) clearFile();
    setErrors({});
    setFailure("");
  };

  const validate = (): Errors => {
    const found: Errors = {};
    for (const field of fields) {
      const value = (values[field.name] ?? "").trim();
      if (!value) {
        if (!field.optional) found[field.name] = "Required.";
        continue;
      }
      if (field.type === "email" && !EMAIL.test(value)) {
        found[field.name] = "That address does not look complete.";
      }
      if (field.type === "url" && !/^https?:\/\/\S+\.\S+/.test(value)) {
        found[field.name] = "Include the full address, starting with https://";
      }
    }
    if ((values[MESSAGE] ?? "").trim().length < 10) {
      found[MESSAGE] = "A sentence or two, so we can point this at the right person.";
    }
    if (topic.cv && !file) found.cv = "Please attach your CV.";
    if (values[CONSENT] !== "yes") found[CONSENT] = "Please agree before sending.";
    return found;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) {
      /* land the caret on the first problem rather than leaving someone to hunt
         for the red text — in source order, which is reading order */
      const first = [...fields.map((f) => f.name), MESSAGE, "cv", CONSENT].find((n) => found[n]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    setFailure("");
    setStatus("sending");

    const body = new FormData();
    body.set("topic", topic.id);
    for (const field of fields) body.set(field.name, (values[field.name] ?? "").trim());
    body.set(MESSAGE, (values[MESSAGE] ?? "").trim());
    body.set(TRAP, values[TRAP] ?? "");
    if (file) body.set("cv", file);

    try {
      const res = await fetch("/api/contact", { method: "POST", body });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setFailure(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="hs-band hs-contact" id="contact" aria-labelledby="contact-t">
      <div className="hs-shell">
        <div className="hs-contact__head">
          <Reveal as="p" className="hs-eyebrow">
            Contact
          </Reveal>
          <Reveal as="h2" className="hs-h2" id="contact-t">
            Start a conversation.
          </Reveal>
          <Reveal as="p" className="hs-body hs-contact__lede" delay={90}>
            Four ways to reach us, each read by the people who can actually answer. Choose the
            one that fits and we will come back to you by name.
          </Reveal>
        </div>

        {status === "sent" ? (
          <div className="hs-contact__panel hs-contact__panel--done" role="status">
            <p className="hs-contact__doneMark" aria-hidden="true">
              <svg viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14.5" />
                <path d="M10 16.5 14.5 21 22.5 12" />
              </svg>
            </p>
            <h3>Thank you — your message is with us.</h3>
            <p>{topic.reply}</p>
            <p className="hs-contact__doneNote">
              A copy is on its way to {values.email}. If it is not there in a few minutes, check
              the spam folder before writing again.
            </p>
          </div>
        ) : (
          <Reveal className="hs-contact__panel" delay={150}>
            {/* Stays outside the <form>, which is keyed on the topic: inside it,
                choosing a queue would remount the control that was just used and
                throw focus back to the top of the panel. */}
            <div className="hs-contact__field hs-contact__pick">
              <label htmlFor={`${uid}-topic`}>What is this about?</label>
              <select
                id={`${uid}-topic`}
                value={topicId}
                onChange={(e) => {
                  const next = CONTACT_TOPICS.find((t) => t.id === e.target.value);
                  if (next) changeTopic(next);
                }}
              >
                {CONTACT_TOPICS.map((t) => (
                  <option value={t.id} key={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              {/* the blurb the cards used to carry. Collapsed to the selected one,
                  it still answers "am I in the right queue?" without printing all
                  four — and it is the only part of a card worth the height. */}
              <p className="hs-contact__pickBlurb">{topic.blurb}</p>
            </div>

            {/* keyed on the topic so switching queues remounts the fields: React
                would otherwise reuse the DOM node position-for-position and carry
                one topic's typed value into the field that replaced it */}
            <form className="hs-contact__form" key={topic.id} ref={formRef} onSubmit={submit} noValidate>
              <div className="hs-contact__grid">
                {fields.map((field) => (
                  <Field
                    key={field.name}
                    field={field}
                    id={fieldId(field.name)}
                    value={values[field.name] ?? ""}
                    error={errors[field.name]}
                    onChange={(v) => set(field.name, v)}
                  />
                ))}

                <div className="hs-contact__field hs-contact__field--full">
                  <label htmlFor={fieldId(MESSAGE)}>{topic.prompt}</label>
                  <textarea
                    id={fieldId(MESSAGE)}
                    data-field={MESSAGE}
                    rows={5}
                    placeholder={topic.placeholder}
                    value={values[MESSAGE] ?? ""}
                    aria-invalid={Boolean(errors[MESSAGE])}
                    aria-describedby={errors[MESSAGE] ? `${fieldId(MESSAGE)}-err` : undefined}
                    onChange={(e) => set(MESSAGE, e.target.value)}
                  />
                  {errors[MESSAGE] ? (
                    <p className="hs-contact__err" id={`${fieldId(MESSAGE)}-err`}>
                      {errors[MESSAGE]}
                    </p>
                  ) : null}
                </div>

                {topic.cv ? (
                  <div className="hs-contact__field hs-contact__field--full">
                    <label htmlFor={fieldId("cv")}>Your CV</label>
                    <input
                      className="hs-vh"
                      type="file"
                      id={fieldId("cv")}
                      data-field="cv"
                      ref={fileRef}
                      accept={CV_ACCEPT}
                      aria-invalid={Boolean(errors.cv)}
                      aria-describedby={errors.cv ? `${fieldId("cv")}-err` : `${fieldId("cv")}-hint`}
                      onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                    />
                    <div className={`hs-contact__drop${file ? " is-filled" : ""}`}>
                      {file ? (
                        <>
                          <span className="hs-contact__fileName">{file.name}</span>
                          <span className="hs-contact__fileSize">{prettyBytes(file.size)}</span>
                          <button type="button" onClick={clearFile}>
                            Remove
                          </button>
                        </>
                      ) : (
                        <>
                          {/* the label is the button: clicking it opens the picker
                              without any JS, and it stays keyboard-reachable
                              through the visually hidden input it points at */}
                          <label className="hs-contact__choose" htmlFor={fieldId("cv")}>
                            Choose a file
                          </label>
                          <span className="hs-contact__fileSize" id={`${fieldId("cv")}-hint`}>
                            PDF, DOC or DOCX, up to {prettyBytes(CV_MAX_BYTES)}
                          </span>
                        </>
                      )}
                    </div>
                    {errors.cv ? (
                      <p className="hs-contact__err" id={`${fieldId("cv")}-err`}>
                        {errors.cv}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* out of the tab order and hidden from assistive tech, so the only
                  thing that fills it is a script filling every input it finds */}
              <div className="hs-vh" aria-hidden="true">
                <label htmlFor={fieldId(TRAP)}>Company website</label>
                <input
                  id={fieldId(TRAP)}
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values[TRAP] ?? ""}
                  onChange={(e) => set(TRAP, e.target.value)}
                />
              </div>

              <div className="hs-contact__foot">
                <div className={`hs-contact__consent${errors[CONSENT] ? " is-error" : ""}`}>
                  <input
                    type="checkbox"
                    id={fieldId(CONSENT)}
                    data-field={CONSENT}
                    checked={values[CONSENT] === "yes"}
                    aria-invalid={Boolean(errors[CONSENT])}
                    onChange={(e) => set(CONSENT, e.target.checked ? "yes" : "")}
                  />
                  <label htmlFor={fieldId(CONSENT)}>
                    I agree to Himspring holding these details in order to answer my enquiry.
                  </label>
                </div>

                <button className="hs-btn hs-contact__send" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send enquiry"}
                </button>
              </div>

              {/* one live region for the whole form: per-field errors are already
                  announced on focus, and this is for the failure a screen reader
                  would otherwise never hear about */}
              <p className="hs-contact__status" role="status" aria-live="polite">
                {failure}
              </p>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function Field({
  field,
  id,
  value,
  error,
  onChange,
}: {
  field: ContactField;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const describedBy = error ? `${id}-err` : undefined;
  const shared = {
    id,
    "data-field": field.name,
    value,
    "aria-invalid": Boolean(error),
    "aria-describedby": describedBy,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(e.target.value),
  };

  return (
    <div className={`hs-contact__field${field.half ? "" : " hs-contact__field--full"}`}>
      <label htmlFor={id}>
        {field.label}
        {field.optional ? <span className="hs-contact__opt"> (optional)</span> : null}
      </label>

      {field.type === "select" ? (
        /* no blank first option: a select that opens on "Please choose" gets
           submitted on its default more often than it gets read, and every one of
           these lists has a real answer that fits most people */
        <select {...shared}>
          {field.options?.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...shared}
          type={field.type ?? "text"}
          autoComplete={field.autoComplete}
          placeholder={field.placeholder}
        />
      )}

      {error ? (
        <p className="hs-contact__err" id={`${id}-err`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

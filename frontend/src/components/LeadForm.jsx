import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadForm({ source = "contact_form", projectSlug, projectName, initialMessage = "" }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: initialMessage });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = t("form.required");
    if (!emailRe.test(form.email.trim())) e.email = t("form.invalidEmail");
    if (form.phone.trim().length < 10) e.phone = t("form.invalidPhone");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setStatus("submitting");
    try {
      await api.submitLead({ ...form, source, projectSlug });
      setStatus("success");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-[color:var(--color-success)]/30 bg-green-50 p-6 text-sm text-[color:var(--color-success)]">
        {t("form.success")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {projectName && (
        <p className="text-sm text-[color:var(--color-text-muted)]">
          {t("form.enquiringAbout")} <span className="font-semibold text-navy-800">{projectName}</span>
        </p>
      )}
      <div>
        <label className="form-label" htmlFor="lead-name">{t("form.name")}</label>
        <div className="input-icon-wrap">
          <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" />
          </svg>
          <input
            id="lead-name"
            className="form-input"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            aria-invalid={Boolean(errors.name)}
          />
        </div>
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>
      <div>
        <label className="form-label" htmlFor="lead-email">{t("form.email")}</label>
        <div className="input-icon-wrap">
          <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            id="lead-email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            aria-invalid={Boolean(errors.email)}
          />
        </div>
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>
      <div>
        <label className="form-label" htmlFor="lead-phone">{t("form.phone")}</label>
        <div className="input-icon-wrap">
          <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 5c0 8.5 6.5 15 15 15l2-4-5-2-2 2c-2-1-4-3-5-5l2-2-2-5-4 1z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            id="lead-phone"
            type="tel"
            className="form-input"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            aria-invalid={Boolean(errors.phone)}
          />
        </div>
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </div>
      <div>
        <label className="form-label" htmlFor="lead-message">{t("form.message")}</label>
        <div className="input-icon-wrap">
          <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <textarea
            id="lead-message"
            rows={4}
            className="form-input"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          />
        </div>
      </div>
      {serverError && <p className="form-error">{serverError}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full sm:w-auto">
        {status === "submitting" ? t("form.submitting") : t("buttons.send")}
      </button>
    </form>
  );
}

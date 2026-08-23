import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import Reveal from "../components/Reveal.jsx";
import PageHero, { splitGold } from "../components/PageHero.jsx";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BENEFIT_KEYS = ["benefit1", "benefit2", "benefit3"];
const BENEFIT_ICONS = {
  benefit1: "M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z",
  benefit2: "M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  benefit3: "M4 19h16M4 19V7l8-4 8 4v12M9 19v-6h6v6",
};

export default function BrokerRegistration() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", agencyName: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 2) e.fullName = t("form.required");
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
      await api.submitBroker(form);
      setStatus("success");
      setForm({ fullName: "", phone: "", email: "", agencyName: "" });
    } catch (err) {
      setStatus("error");
      setServerError(err.message);
    }
  };

  return (
    <div>
      <PageHero
        eyebrow={t("nav.broker")}
        heading={splitGold(t("brokerPage.heroTitle"), 2)}
        subtitle={t("brokerPage.heroSubtitle")}
        bgWord={t("bgWord.broker")}
        bgImage="/media/brand/broker-hero.jpg"
        heroVariant="showcase"
        bgImageZoom="1.55"
        bgImageFocus="78% 64%"
      />

      {/* Benefits as a vertical numbered rail with one continuous
          connecting line — reads as a partnership "path" rather than a
          plain stacked icon+text list — paired with the form set as a
          raised panel with a decorative corner frame. */}
      <section className="relative overflow-hidden section-pad">
        <div className="gold-atmosphere gold-atmosphere-light-b" />
        <div className="container-content relative grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-10">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-6 bottom-6 hidden w-px bg-gradient-to-b from-gold-400 via-[color:var(--color-border)] to-transparent sm:block"
            />
            <div className="space-y-10">
              {BENEFIT_KEYS.map((key, i) => (
                <Reveal key={key} delay={i * 110} className="group relative flex gap-6 sm:pl-2">
                  <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-navy-600 to-navy-800 font-display text-base font-bold text-gold-300 shadow-[var(--shadow-sm)] transition-transform duration-300 group-hover:scale-110">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1.5">
                    <div className="mb-2 inline-flex items-center gap-2 text-gold-600">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d={BENEFIT_ICONS[key]} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-navy-800">{t(`brokerPage.${key}Title`)}</h3>
                    <p className="max-w-sm text-sm leading-relaxed text-[color:var(--color-text-muted)]">
                      {t(`brokerPage.${key}Body`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={150} variant="right" className="relative">
            <span className="entry-corner entry-corner--tl !border-gold-400/70" aria-hidden="true" />
            <span className="entry-corner entry-corner--br !border-gold-400/70" aria-hidden="true" />
            {status === "success" ? (
              <div className="rounded-[var(--radius-card)] border border-[color:var(--color-success)]/30 bg-green-50 p-6 text-sm text-[color:var(--color-success)]">
                {t("form.success")}
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="card space-y-4 p-8 sm:p-9">
                <div>
                  <label className="form-label" htmlFor="broker-name">{t("form.fullName")}</label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" />
                    </svg>
                    <input
                      id="broker-name"
                      className="form-input"
                      value={form.fullName}
                      onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                    />
                  </div>
                  {errors.fullName && <p className="form-error">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="broker-phone">{t("form.phone")}</label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 5c0 8.5 6.5 15 15 15l2-4-5-2-2 2c-2-1-4-3-5-5l2-2-2-5-4 1z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      id="broker-phone"
                      type="tel"
                      className="form-input"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    />
                  </div>
                  {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="broker-email">{t("form.email")}</label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      id="broker-email"
                      type="email"
                      className="form-input"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <div>
                  <label className="form-label" htmlFor="broker-agency">{t("form.agencyName")}</label>
                  <div className="input-icon-wrap">
                    <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6M4 12h16" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <input
                      id="broker-agency"
                      className="form-input"
                      value={form.agencyName}
                      onChange={(e) => setForm((f) => ({ ...f, agencyName: e.target.value }))}
                    />
                  </div>
                </div>
                {serverError && <p className="form-error">{serverError}</p>}
                <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
                  {status === "submitting" ? t("form.submitting") : t("buttons.submit")}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}

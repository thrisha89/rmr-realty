import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError(t("form.passwordMismatch", "Passwords do not match."));
      return;
    }
    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      // Account is created as Pending — no session is issued. Show a
      // confirmation state instead of redirecting into the account area.
      setPending(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (pending) {
    return (
      <div className="relative overflow-hidden section-pad container-content flex justify-center">
        <div className="gold-atmosphere gold-atmosphere-light-c" />
        <div className="card relative w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold-600" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-navy-800">
            {t("register.pendingTitle", "Registration received")}
          </h1>
          <p className="text-[color:var(--color-text-muted)]">
            {t(
              "register.pendingBody",
              "Your account has been created and is now awaiting admin approval. We'll let you know once you're approved — you can then log in as usual."
            )}
          </p>
          <Link to="/login" className="btn-secondary mt-6 inline-block">
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden section-pad container-content flex justify-center">
      <div className="gold-atmosphere gold-atmosphere-light-c" />
      <div className="card relative w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-navy-800">{t("nav.register")}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="reg-name">{t("form.fullName")}</label>
            <input id="reg-name" required className="form-input" value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
          </div>
          <div>
            <label className="form-label" htmlFor="reg-email">{t("form.email")}</label>
            <input id="reg-email" type="email" required className="form-input" value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="form-label" htmlFor="reg-phone">{t("form.phone")}</label>
            <input id="reg-phone" type="tel" className="form-input" value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="form-label" htmlFor="reg-password">{t("form.password")}</label>
            <input id="reg-password" type="password" required minLength={8} className="form-input" value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
          <div>
            <label className="form-label" htmlFor="reg-confirm">{t("form.confirmPassword")}</label>
            <input id="reg-confirm" type="password" required className="form-input" value={form.confirm}
              onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? t("form.submitting") : t("nav.register")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
          {t("register.alreadyHaveAccount")}{" "}
          <Link to="/login" className="font-semibold text-navy-700 hover:text-gold-600">
            {t("nav.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}

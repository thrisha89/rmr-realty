import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/account");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden section-pad container-content flex justify-center">
      <div className="gold-atmosphere gold-atmosphere-light-c" />
      <div className="card relative w-full max-w-md p-8">
        <h1 className="mb-6 text-2xl font-bold text-navy-800">{t("nav.login")}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="login-email">{t("form.email")}</label>
            <div className="input-icon-wrap">
              <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input
                id="login-email"
                type="email"
                required
                className="form-input"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="form-label" htmlFor="login-password">{t("form.password")}</label>
            <div className="input-icon-wrap">
              <svg viewBox="0 0 24 24" className="input-icon" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 118 0v4" strokeLinecap="round" />
              </svg>
              <input
                id="login-password"
                type="password"
                required
                className="form-input"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? t("form.submitting") : t("nav.login")}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[color:var(--color-text-muted)]">
          {t("register.newHere")}{" "}
          <Link to="/register" className="font-semibold text-navy-700 hover:text-gold-600">
            {t("nav.register")}
          </Link>
        </p>
      </div>
    </div>
  );
}

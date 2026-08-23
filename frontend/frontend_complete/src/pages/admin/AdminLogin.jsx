import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-navy-900 px-4">
      {/* Ambient light, consistent with the rest of the site's premium treatment */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold-400/[0.08] blur-3xl" />

      <div className="relative w-full max-w-sm animate-[fadeInUp_0.6s_var(--ease-premium)_both]">
        <div className="rounded-[1.25rem] border border-white/10 bg-navy-800/80 p-8 shadow-[0_30px_60px_-20px_rgba(0,10,30,0.6)] backdrop-blur-sm">
          <div className="mx-auto mb-7 w-fit rounded-lg bg-white p-2.5 shadow-[0_10px_24px_-10px_rgba(0,0,0,0.4)]">
            <img src="/media/brand/logo.png" alt="RMR Realty" className="h-14 w-auto" />
          </div>
          <p className="mb-1 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-gold-400">
            RMR Realty
          </p>
          <h1 className="mb-7 text-center text-xl font-semibold text-white">Admin Portal</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-navy-100" htmlFor="admin-username">
                Username
              </label>
              <input
                id="admin-username"
                required
                autoFocus
                className="w-full rounded-lg border border-white/15 bg-navy-900/70 px-4 py-2.5 text-sm text-white transition-colors duration-200 placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-navy-100" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                className="w-full rounded-lg border border-white/15 bg-navy-900/70 px-4 py-2.5 text-sm text-white transition-colors duration-200 placeholder:text-navy-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full !py-3 transition-transform duration-200 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-navy-400">Authorized personnel only</p>
      </div>
    </div>
  );
}

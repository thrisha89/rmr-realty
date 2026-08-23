import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "../i18n/index.js";
import { LANGUAGES } from "../lib/constants.js";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/projects", key: "projects" },
  { to: "/amenities", key: "amenities" },
  { to: "/calculator", key: "calculator" },
  { to: "/gallery", key: "gallery" },
  { to: "/contact", key: "contact" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }) =>
    `link-underline text-sm font-medium tracking-wide transition-colors ${
      isActive ? "text-gold-600" : "text-navy-700 hover:text-gold-600"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "border-[color:var(--color-border)] shadow-[var(--shadow-sm)]"
          : "border-transparent"
      }`}
    >
      <div className="container-content flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 transition-transform duration-300 hover:scale-[1.02]">
          <img src="/media/brand/logo.png" alt="RMR Realty" className="h-14 w-auto" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.key} to={item.to} className={linkClass} end={item.to === "/"}>
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
          <NavLink to="/broker-registration" className={linkClass}>
            {t("nav.broker")}
          </NavLink>
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <select
            aria-label={t("language.select")}
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-sm text-navy-700 transition focus:outline-none focus:ring-1 focus:ring-navy-500"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>

          {user ? (
            <Link to="/account" className="btn-secondary !px-4 !py-2.5 text-xs">
              {t("nav.myAccount")}
            </Link>
          ) : (
            <Link to="/login" className="btn-primary !px-4 !py-2.5 text-xs">
              {t("nav.login")}
            </Link>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--color-border)] transition-colors hover:border-gold-400 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="sr-only">{t("a11y.toggleMenu")}</span>
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-navy-700 transition-transform duration-300 ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-navy-700 transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-navy-700 transition-transform duration-300 ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-[color:var(--color-border)] bg-white lg:hidden">
          <nav className="container-content flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-navy-50 text-gold-600" : "text-navy-700 hover:bg-navy-50"
                  }`
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
            <NavLink
              to="/broker-registration"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50"
            >
              {t("nav.broker")}
            </NavLink>
            <div className="mt-2 flex items-center justify-between px-3">
              <select
                aria-label={t("language.select")}
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="rounded-full border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-sm"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              {user ? (
                <Link to="/account" onClick={() => setOpen(false)} className="btn-secondary !px-4 !py-2.5 text-xs">
                  {t("nav.myAccount")}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary !px-4 !py-2.5 text-xs">
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

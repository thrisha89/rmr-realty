import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BUSINESS, WHATSAPP_LINK, EMAIL_ENQUIRY_LINK } from "../lib/constants.js";
import Reveal from "./Reveal.jsx";

const QUICK_LINKS = [
  { to: "/about", key: "about" },
  { to: "/projects", key: "projects" },
  { to: "/amenities", key: "amenities" },
  { to: "/calculator", key: "calculator" },
  { to: "/gallery", key: "gallery" },
  { to: "/broker-registration", key: "broker" },
];

const CONTACT_ITEM_CONFIG = [
  {
    icon: "M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    value: BUSINESS.address,
    href: BUSINESS.mapLink,
    external: true,
  },
  {
    icon: "M4 5c0 8.5 6.5 15 15 15l2-4-5-2-2 2c-2-1-4-3-5-5l2-2-2-5-4 1z",
    value: BUSINESS.phone,
    href: `tel:${BUSINESS.phone}`,
  },
  {
    icon: "M3 5h18v14H3zM3 7l9 6 9-6",
    value: BUSINESS.email,
    href: EMAIL_ENQUIRY_LINK,
  },
  {
    icon: "M12 8v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z",
    isHours: true,
  },
];

const Footer = forwardRef(function Footer(_props, ref) {
  const { t } = useTranslation();
  const CONTACT_ITEMS = CONTACT_ITEM_CONFIG.map((item) =>
    item.isHours ? { ...item, value: t("home.businessHours") } : item
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-navy-900 text-white">
      {/* Signature top edge: gold hairline + faint architectural plot-line field */}
      <div className="h-[3px] w-full bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id="footerGrid" width="56" height="56" patternUnits="userSpaceOnUse">
              <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footerGrid)" />
        </svg>
      </div>

      <div className="container-content relative">
        {/* Main grid */}
        <div className="grid gap-x-8 gap-y-12 py-16 sm:py-20 lg:grid-cols-12">
          {/* Brand column */}
          <Reveal variant="up-sm" className="lg:col-span-4">
            <Link to="/" className="inline-block rounded-lg bg-white p-2.5 shadow-[var(--shadow-sm)] transition-transform duration-300 hover:scale-[1.03]">
              <img src="/media/brand/logo.png" alt="RMR Realty" className="h-14 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs font-display text-lg italic text-gold-200/90">
              &ldquo;{t("home.tagline")}&rdquo;
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-200">
              {t("footer.description")}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                aria-label={t("common.phone")}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400 hover:shadow-[var(--shadow-gold)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 5c0 8.5 6.5 15 15 15l2-4-5-2-2 2c-2-1-4-3-5-5l2-2-2-5-4 1z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={EMAIL_ENQUIRY_LINK}
                aria-label={t("common.email")}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400 hover:shadow-[var(--shadow-gold)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 5h18v14H3zM3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("buttons.whatsapp")}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400 hover:shadow-[var(--shadow-gold)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.7 14.2c-.24.68-1.4 1.3-1.94 1.36-.5.06-1.12.08-1.8-.12-.42-.12-.96-.3-1.66-.6-2.92-1.26-4.82-4.2-4.96-4.4-.14-.2-1.18-1.58-1.18-3s.74-2.14 1-2.42c.26-.28.56-.36.76-.36l.54.01c.18 0 .4-.04.62.46.24.56.8 1.94.86 2.08.06.14.1.3.02.48-.08.18-.12.28-.24.44-.12.14-.26.32-.36.42-.12.12-.25.26-.11.5.14.24.62 1.02 1.32 1.66.92.82 1.68 1.08 1.94 1.2.26.12.4.1.56-.06.16-.16.66-.76.84-1.02.18-.26.36-.22.6-.14.24.1 1.56.74 1.82.88.26.14.44.2.5.32.06.12.06.68-.18 1.36z" />
                </svg>
              </a>
              <a
                href={BUSINESS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400 hover:shadow-[var(--shadow-gold)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={BUSINESS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-navy-100 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-400 hover:text-gold-400 hover:shadow-[var(--shadow-gold)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v6h3v-6h3l1-3h-4v-2c0-.6.4-1 1-1z" />
                </svg>
              </a>
            </div>
          </Reveal>

          {/* Quick links */}
          <Reveal variant="up-sm" delay={100} className="lg:col-span-2">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3 text-sm text-navy-100">
              {QUICK_LINKS.map((item) => (
                <li key={item.key}>
                  <Link to={item.to} className="link-underline inline-block transition-colors hover:text-gold-300">
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contact */}
          <Reveal variant="up-sm" delay={180} className="lg:col-span-3">
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
              {t("footer.contact")}
            </h3>
            <ul className="space-y-4 text-sm text-navy-100">
              {CONTACT_ITEMS.map((item, i) => {
                const content = (
                  <>
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/5 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500 group-hover:text-navy-900">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="leading-snug text-navy-200 transition-colors duration-300 group-hover:text-white">
                      {item.value}
                    </span>
                  </>
                );
                return (
                  <li key={i}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="group flex items-start gap-3"
                      >
                        {content}
                      </a>
                    ) : (
                      <div className="group flex items-start gap-3">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* CTA panel */}
          <Reveal variant="scale" delay={260} className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
              <h3 className="font-display text-lg font-semibold text-white">
                {t("footer.ctaTitle")}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-200">
                {t("footer.ctaBody")}
              </p>
              <Link to="/contact" className="btn-gold mt-5 w-full !px-5 !py-3 text-xs">
                {t("buttons.getInTouch")}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-navy-300">
          © {new Date().getFullYear()} {BUSINESS.name}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
});

export default Footer;

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BUSINESS } from "../lib/constants.js";
import Reveal from "./Reveal.jsx";

/**
 * The same closing enquiry band Home ends on — huge outlined background
 * word, architectural corner frame, off-center composition — factored
 * out so every interior page (About, Projects, Amenities, Gallery,
 * Calculator) can close on the same confident conversion moment instead
 * of just stopping after its last content section.
 *
 * All copy is optional and falls back to the same strings Home uses, so
 * pages can either reuse the generic pitch or pass something page-
 * specific (e.g. Gallery might want "Liked what you saw?").
 */
export default function CtaBand({ eyebrow, title, subtitle, bgWord }) {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
      <div className="gold-atmosphere gold-atmosphere-animated gold-atmosphere-hero-b" />
      <span
        aria-hidden="true"
        className="bg-word bg-word--fill-light left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
      >
        {bgWord || t("home.ctaBgWord")}
      </span>
      <span className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-gold-300/30 sm:left-10 sm:top-10" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-gold-300/30 sm:bottom-10 sm:right-10" aria-hidden="true" />

      <div className="container-content relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-2xl">
          <Reveal variant="up-sm">
            <p className="eyebrow mb-4 text-gold-400">{eyebrow || t("home.ctaEyebrow")}</p>
          </Reveal>
          <Reveal variant="scale">
            <h2 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {title || t("home.ctaTitle")}
            </h2>
          </Reveal>
          <Reveal variant="up-sm" delay={120}>
            <p className="mt-6 max-w-xl text-lg text-navy-100">
              {subtitle || t("home.ctaSubtitle")}
            </p>
          </Reveal>
        </div>
        <Reveal variant="up-sm" delay={220} className="flex flex-wrap gap-4 lg:flex-col lg:items-stretch">
          <Link to="/contact" className="btn-gold cta-magnetic justify-center">{t("buttons.enquireNow")}</Link>
          <a
            href={`tel:${BUSINESS.phone}`}
            className="btn-secondary cta-magnetic justify-center !border-white !text-white hover:!bg-white hover:!text-navy-800"
          >
            {t("buttons.callNow")}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

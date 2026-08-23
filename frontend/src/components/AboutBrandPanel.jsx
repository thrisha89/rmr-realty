import { useTranslation } from "react-i18next";
import { BUSINESS } from "../lib/constants.js";
import Reveal from "./Reveal.jsx";

/**
 * Brand composition for the homepage About section.
 *
 * Replaces the previous 4-image grid (those images belong in the
 * project galleries, not here). Built entirely from typography,
 * brand colour and simple architectural-plot-plan geometry so it
 * reads as an intentional identity piece rather than another photo.
 */
export default function AboutBrandPanel() {
  const { t } = useTranslation();
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md sm:aspect-square lg:aspect-[4/5]">
     
      {/* Base panel */}
      <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-md)]">
        <img 
          src="/media/brand/about.jpg" 
          alt="RMR Realty About Us" 
          className="h-full w-full object-contain bg-white"
        />
      </div>

      {/* Layered floating card, overlapping the panel edge — arrives as a second beat after the panel settles */}
      <Reveal
        variant="up-sm"
        delay={480}
        className="absolute -bottom-6 -left-6 w-[75%] rounded-2xl border border-[color:var(--color-border)] bg-white p-5 shadow-[var(--shadow-md)] sm:-left-8 sm:w-[70%]"
      >
        <div className="flex items-start gap-3">
          <span className="icon-badge icon-badge-gold shrink-0" style={{ width: "2.75rem", height: "2.75rem" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path
                d="M4 21V9l8-6 8 6v12h-6v-7H10v7H4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-800">{t("brandPanel.title")}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[color:var(--color-text-muted)]">
              {t("brandPanel.body")}
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

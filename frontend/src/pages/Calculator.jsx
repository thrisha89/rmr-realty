import { useTranslation } from "react-i18next";
import InvestmentPlanner from "../components/InvestmentPlanner.jsx";
import Reveal from "../components/Reveal.jsx";
import PageHero, { splitGold } from "../components/PageHero.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import CtaBand from "../components/CtaBand.jsx";

const STEP_KEYS = [
  { key: "plotSize", icon: "M4 21V9l8-6 8 6v12M9 21v-8h6v8" },
  { key: "loanPercent", icon: "M12 8v8m-4-4h8M12 21a9 9 0 100-18 9 9 0 000 18z" },
  { key: "interestRate", icon: "M4 19h16M4 19V7l8-4 8 4v12" },
];

export default function Calculator() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHero
        eyebrow={t("calculator.eyebrow")}
        heading={splitGold(t("calculator.title"), 3)}
        subtitle={t("calculator.subtitle")}
        bgWord={t("bgWord.calculator")}
        bgImage="/media/brand/calculator-hero.jpg"
        heroVariant="showcase"
        bgImageZoom="1.45"
        bgImageFocus="72% 46%"
      />

      {/* Slim "what you'll configure" rail — orients the visitor before
          the tool itself, using the same field labels the planner uses,
          so the panel below never feels like it drops in unexplained. */}
      <section className="relative overflow-hidden pt-16 sm:pt-20">
        <div className="gold-atmosphere gold-atmosphere-light-a" />
        <div className="container-content relative">
          <div className="grid gap-6 sm:grid-cols-3">
            {STEP_KEYS.map((s, i) => (
              <Reveal key={s.key} variant="up-sm" delay={i * 90} className="group flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300/50 bg-white text-gold-600 shadow-[var(--shadow-xs)] transition-transform duration-300 group-hover:-translate-y-0.5">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-600">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-sm font-semibold text-navy-800">{t(`calculator.${s.key}`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden section-pad">
        <div className="gold-atmosphere gold-atmosphere-light-a" />
        <div className="container-content relative">
          <Reveal variant="scale">
            <InvestmentPlanner />
          </Reveal>
        </div>
      </section>

      {/* FAQ — the same accordion Home uses, scoped to the questions
          people actually have right after running the numbers. */}
      <section className="section-pad bg-[color:var(--color-surface)]">
        <div className="container-content">
          <Reveal variant="up-sm">
            <SectionHeading
              eyebrow={t("calculator.faqEyebrow")}
              title={t("calculator.faqTitle")}
              subtitle={t("calculator.faqSubtitle")}
              align="center"
            />
          </Reveal>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow={t("calculator.ctaEyebrow")}
        title={t("calculator.ctaTitle")}
        subtitle={t("calculator.ctaSubtitle")}
        bgWord={t("bgWord.calculator")}
      />
    </div>
  );
}

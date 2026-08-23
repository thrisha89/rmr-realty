import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { BUSINESS } from "../lib/constants.js";
import SectionHeading from "../components/SectionHeading.jsx";
import InvestmentPlanner from "../components/InvestmentPlanner.jsx";
import FaqAccordion from "../components/FaqAccordion.jsx";
import Reveal from "../components/Reveal.jsx";
import AboutBrandPanel from "../components/AboutBrandPanel.jsx";
import Spinner from "../components/Spinner.jsx";
import useParallax from "../hooks/useParallax.js";

// Each amenity maps to the same translation keys used on the dedicated
// Amenities page, so a label only ever needs to be translated once.
const AMENITY_ICONS = [
  { key: "clubHouse", image: "/clubhouse.jpeg", path: "M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-6h6v6M9 12h.01M15 12h.01" },
  { key: "childrensPark", image: "/childrens-park.jpeg", path: "M12 3v4M8 21l4-6 4 6M6 13a6 6 0 1112 0c0 2-1.5 3.5-3 4.5H9c-1.5-1-3-2.5-3-4.5z" },
  { key: "overheadTank", image: "/overhead-tank.jpeg", path: "M12 2.5c3.2 3.6 6.5 7.6 6.5 11.5a6.5 6.5 0 11-13 0c0-3.9 3.3-7.9 6.5-11.5zM8.5 14.5a3.5 3.5 0 003.5 3.5" },
  { key: "cctv", image: "/cctv.jpeg", path: "M4 8l8-3 8 3M6 9v10a2 2 0 002 2h8a2 2 0 002-2V9M9 13a3 3 0 106 0 3 3 0 00-6 0z" },
  { key: "commercialShops", image: "/commercial-shops.jpeg", path: "M3 9l1.5-5h15L21 9M4 9h16v10a1 1 0 01-1 1H5a1 1 0 01-1-1V9zM9 20v-6h6v6" },
];

const VALUE_KEYS = [
  { key: "trust", tone: "navy", icon: "M4 21V9l8-6 8 6v12h-6v-7H10v7H4z" },
  { key: "accountability", tone: "gold", icon: "M12 3l7 4v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V7l7-4z" },
  { key: "relationships", tone: "navy", icon: "M17 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.5 20v-1a3.5 3.5 0 00-2.5-3.36M15 4.13a3.5 3.5 0 010 6.74" },
  { key: "planning", tone: "gold", icon: "M4 19h16M4 19V7l8-4 8 4v12M9 19v-6h6v6" },
];

const PROCESS_KEYS = ["site", "layout", "development", "handover"];

export default function Home() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const heroImageRef = useParallax(0.12);

  useEffect(() => {
    Promise.all([api.getProjects(), api.getContent()])
      .then(([p, c]) => {
        setProjects(p.projects);
        setContent(c.content);
      })
      .finally(() => setLoading(false));
  }, [i18n.language]);

  const heroWords = t("home.tagline").split(" ");
  const heroLead = heroWords.slice(0, -2).join(" ");
  const heroGold = heroWords.slice(-2).join(" ");

  return (
    <div>
     {/* Hero — layered editorial composition: full-bleed image, oversized
         split-weight headline with a gold-highlighted close, a vertical
         architectural rule, and a floating stat panel anchored to the
         image rather than a plain background+heading+button stack. */}
      <section className="relative overflow-hidden bg-navy-900">
        <div className="absolute -inset-y-16 inset-x-0 z-0" ref={heroImageRef}>
          <img
            src="/media/brand/hp-bg.png"
            alt="RMR Realty"
            className="hero-image-settle h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/92 via-navy-900/55 to-navy-900/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-navy-900/40 z-10" />

        <div className="container-content relative z-20 grid gap-10 py-28 sm:py-36 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-16">
          {/* Vertical architectural rule + rotated locale label — reads as
              a drafting mark, anchors the left edge of the composition */}
          <div className="hidden lg:flex lg:h-full lg:flex-col lg:items-center lg:gap-6 lg:pb-2 animate-[fadeInUp_0.9s_var(--ease-premium)_0.05s_both]">
            <span className="arch-line--v h-24 w-px" />
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-300/80" style={{ writingMode: "vertical-rl" }}>
              {t("home.estLocation")}
            </span>
          </div>

          <div>
            <p className="eyebrow mb-5 text-gold-400 animate-[fadeInUp_0.7s_var(--ease-premium)_both]">
              {BUSINESS.name} · {t("home.locationLine")}
            </p>
            <h1 className="hero-heading hero-heading--display hero-text-col-lg font-display font-bold text-white animate-[fadeInUp_0.8s_var(--ease-premium)_0.1s_both]">
              {heroLead}{" "}
              <span className="text-gradient-gold">{heroGold}</span>
            </h1>

            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="hero-subtitle max-w-md text-lg text-navy-100 animate-[fadeInUp_0.7s_var(--ease-premium)_0.25s_both]">
                {content.short_description || t("home.heroDescriptionFallback")}
              </p>
              <div className="flex flex-wrap gap-4 animate-[fadeInUp_0.7s_var(--ease-premium)_0.35s_both]">
                <Link to="/projects" className="btn-gold cta-magnetic">{t("buttons.viewAllProjects")}</Link>
                <Link to="/contact" className="btn-secondary cta-magnetic !border-white !text-white hover:!bg-white hover:!text-navy-800">
                  {t("buttons.getInTouch")}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating credential panel — overlaps the hero/next-section
            boundary so the two sections read as continuous, not stacked */}
        <div className="relative z-30 hidden sm:block">
          <div className="container-content">
            <Reveal
              variant="up-sm"
              delay={500}
              className="float-panel--dark grid -translate-y-1/2 grid-cols-3 divide-x divide-white/10 px-8 py-6 sm:max-w-xl"
            >
              {[
                ["3", t("home.statVerifiedProjects")],
                ["10+", t("home.statYearsOfTrust")],
                ["100%", t("home.statTransparentTitles")],
              ].map(([n, l]) => (
                <div key={l} className="px-5 text-center first:pl-0 last:pr-0">
                  <p className="font-display text-2xl font-bold text-gold-300 sm:text-3xl">{n}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-navy-100/80">{l}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Brand intro — asymmetric overlapping composition rather than a
          symmetric two-column block: oversized background word, offset
          image panel, sticky-feeling label rail beside the copy. */}
      <section className="relative overflow-hidden section-pad pt-20 sm:pt-24">
        <div className="gold-atmosphere gold-atmosphere-about" />
        <span aria-hidden="true" className="bg-word bg-word--navy left-1/2 top-6 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 lg:right-10">
          RMR
        </span>
        <div className="container-content relative grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <div className="relative grid grid-cols-[auto_1fr] gap-6 sm:gap-8">
            <div className="hidden sm:flex sm:flex-col sm:items-center sm:gap-4 sm:pt-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300/50 text-gold-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
                  <path d="M4 21V9l8-6 8 6v12h-6v-7H10v7H4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="arch-line--v h-full w-px flex-1" />
            </div>
            <div>
              <Reveal variant="up-sm">
                <SectionHeading eyebrow={t("home.aboutEyebrow")} title={t("home.aboutTitle")} />
              </Reveal>
              <Reveal variant="up-sm" delay={100}>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-[color:var(--color-text-muted)]">
                  {content.about_us_intro}
                </p>
              </Reveal>
              <Reveal variant="up-sm" delay={200}>
                <Link to="/about" className="btn-secondary cta-magnetic mt-8 inline-flex">{t("buttons.readMore")}</Link>
              </Reveal>
            </div>
          </div>
          <Reveal variant="scale" delay={120} className="relative flex justify-center lg:justify-end">
            {/* Offset gold frame behind the panel for depth, rather than
                the panel floating on flat background */}
            <span className="absolute -right-4 -top-4 hidden h-full w-full rounded-[1.75rem] border border-gold-300/40 sm:block" aria-hidden="true" />
            <AboutBrandPanel />
          </Reveal>
        </div>
      </section>

      {/* Projects overview — premium showcase strip: large alternating
          image/copy panels with index numbers, not a pill list. */}
      <section className="relative overflow-hidden section-pad bg-[color:var(--color-surface)]">
        <div className="gold-atmosphere gold-atmosphere-surface-a" />
        <div className="container-content relative">
          <Reveal variant="up-sm">
            <SectionHeading
              eyebrow={t("home.projectsEyebrow")}
              title={t("home.projectsTitle")}
              subtitle={t("home.projectsSubtitle")}
              align="center"
            />
          </Reveal>

          {loading ? (
            <Spinner label={t("common.loading")} className="mt-10" />
          ) : (
            <div className="mt-16 flex flex-col gap-4">
              {projects.map((p, i) => {
                const cover =
                  p.slug === "geetha-garden" ? "/media/projects/geetha-garden/gg-bg.jpg"
                  : p.slug === "prestige-imperial" ? "/media/projects/prestige-imperial/pi-bg.jpg"
                  : p.slug === "royal-enclasa" ? "/media/projects/royal-enclasa/re-bg.jpg"
                  : p.media?.[0]?.path;
                const reversed = i % 2 === 1;
                return (
                  <Reveal key={p.id} variant={reversed ? "right" : "left"} delay={90 + i * 110}>
                    <Link
                      to={`/projects/${p.slug}`}
                      className={`group grid items-center gap-0 overflow-hidden rounded-[1.5rem] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-xs)] transition-all duration-500 hover:shadow-[var(--shadow-md)] lg:grid-cols-2 ${
                        reversed ? "" : ""
                      }`}
                    >
                      <div className={`relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full ${reversed ? "lg:order-2" : ""}`}>
                        {cover ? (
                          <img
                            src={cover}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="grid h-full min-h-[240px] place-items-center bg-gradient-to-br from-navy-700 to-navy-900 text-gold-300">
                            <span className="font-display text-lg">{p.name}</span>
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        {!p.isVerified && (
                          <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-700 shadow-[var(--shadow-xs)] backdrop-blur-sm">
                            {t("home.comingSoon")}
                          </span>
                        )}
                      </div>
                      <div className={`relative flex flex-col justify-center gap-4 p-8 sm:p-12 ${reversed ? "lg:order-1" : ""}`}>
                        <p className="eyebrow">{p.category || t("home.featuredDevelopment")}</p>
                        <h3 className="font-display text-2xl font-bold text-navy-800 sm:text-3xl">{p.name}</h3>
                        {p.location && (
                          <p className="flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)]">
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-gold-500" fill="currentColor">
                              <path d="M10 2a6 6 0 00-6 6c0 4.2 5.2 9.3 5.4 9.5a.8.8 0 001.2 0C10.8 17.3 16 12.2 16 8a6 6 0 00-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z" />
                            </svg>
                            {p.location}
                          </p>
                        )}
                        {p.priceLabel && (
                          <p className="text-sm font-semibold text-gold-600">{p.priceLabel}</p>
                        )}
                        <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-navy-700 transition-all duration-300 group-hover:gap-3 group-hover:text-gold-600">
                          {t("home.exploreProject")}
                          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                            <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
          <Reveal variant="up-sm" delay={100 + projects.length * 110} className="mt-14 flex justify-center">
            <Link to="/projects" className="btn-primary cta-magnetic">
              {t("buttons.viewAllProjects")}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-pad">
        <div className="container-content">
          <Reveal variant="up-sm">
            <SectionHeading eyebrow={t("home.valuesEyebrow")} title={t("home.valuesTitle")} align="center" />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_KEYS.map((v, i) => (
              <Reveal key={v.key} variant={i % 2 === 0 ? "up" : "scale"} delay={100 + i * 90} className="card group p-7">
                <div className={`icon-badge is-hoverable icon-badge-${v.tone} mb-5`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d={v.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="mb-2 text-base font-semibold text-navy-800">{t(`home.values.${v.key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-[color:var(--color-text-muted)]">{t(`home.values.${v.key}Body`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Development Process */}
      <section className="section-pad bg-[color:var(--color-surface)]">
        <div className="container-content">
          <Reveal variant="up-sm">
            <SectionHeading
              eyebrow={t("home.processEyebrow")}
              title={t("home.processTitle")}
              subtitle={t("home.processSubtitle")}
              align="center"
            />
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {PROCESS_KEYS.map((key, i) => (
              <Reveal key={key} variant="left" delay={100 + i * 130} className="relative">
                {i < PROCESS_KEYS.length - 1 && (
                  <div className="step-line absolute right-0 top-6 hidden h-px w-full translate-x-1/2 bg-[color:var(--color-border)] lg:block" />
                )}
                <div className="pulse-ring relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-navy-600 to-navy-800 font-display text-lg font-bold text-white shadow-[var(--shadow-sm)]">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-base font-semibold text-navy-800">{t(`home.process.${key}Title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{t(`home.process.${key}Body`)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Planner */}
      <section className="section-pad">
        <div className="container-content">
          <Reveal variant="up-sm">
            <SectionHeading
              eyebrow={t("calculator.eyebrow")}
              title={t("calculator.title")}
              subtitle={t("calculator.subtitle")}
              align="center"
            />
          </Reveal>
          <Reveal variant="scale" delay={120} className="mt-10">
            <InvestmentPlanner />
          </Reveal>
        </div>
      </section>

      {/* Amenities highlight */}
      <section className="section-pad bg-[color:var(--color-surface)]">
        <div className="container-content">
          <Reveal variant="up-sm">
            <SectionHeading eyebrow={t("home.amenitiesEyebrow")} title={t("home.amenitiesTitle")} align="center" />
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {AMENITY_ICONS.map((a, i) => (
              <Reveal
                key={a.key}
                variant="blur"
                delay={100 + i * 70}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-xs)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-md)]"
              >
                <div className="relative h-40 w-full overflow-hidden bg-navy-50 sm:h-44">
                  <img
                    src={a.image}
                    alt={t(`amenitiesPage.${a.key}Label`)}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />
                  <span className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full border-2 border-white/80 bg-gradient-to-b from-gold-400 to-gold-500 text-navy-900 shadow-[var(--shadow-gold)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d={a.path} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white">
                    {t(`amenitiesPage.${a.key}Label`)}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad">
        <div className="container-content">
          <Reveal variant="up-sm">
            <SectionHeading
              eyebrow={t("home.faqEyebrow")}
              title={t("home.faqTitle")}
              subtitle={t("home.faqSubtitle")}
              align="center"
            />
          </Reveal>
          <div className="mt-12">
            <FaqAccordion />
          </div>
        </div>
      </section>

      {/* Enquiry CTA — its own identity: huge outlined background word,
          architectural corner frame, off-center composition rather than
          a centered navy band matching the earlier hero. */}
      <section className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
        <div className="gold-atmosphere gold-atmosphere-animated gold-atmosphere-hero-b" />
        <span aria-hidden="true" className="bg-word bg-word--fill-light left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          {t("home.ctaBgWord")}
        </span>
        {/* Corner frame */}
        <span className="pointer-events-none absolute left-6 top-6 h-10 w-10 border-l border-t border-gold-300/30 sm:left-10 sm:top-10" aria-hidden="true" />
        <span className="pointer-events-none absolute bottom-6 right-6 h-10 w-10 border-b border-r border-gold-300/30 sm:bottom-10 sm:right-10" aria-hidden="true" />

        <div className="container-content relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-2xl">
            <Reveal variant="up-sm">
              <p className="eyebrow mb-4 text-gold-400">{t("home.ctaEyebrow")}</p>
            </Reveal>
            <Reveal variant="scale">
              <h2 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
                {t("home.ctaTitle")}
              </h2>
            </Reveal>
            <Reveal variant="up-sm" delay={120}>
              <p className="mt-6 max-w-xl text-lg text-navy-100">
                {t("home.ctaSubtitle")}
              </p>
            </Reveal>
          </div>
          <Reveal variant="up-sm" delay={220} className="flex flex-wrap gap-4 lg:flex-col lg:items-stretch">
            <Link to="/contact" className="btn-gold cta-magnetic justify-center">{t("buttons.enquireNow")}</Link>
            <a href={`tel:${BUSINESS.phone}`} className="btn-secondary cta-magnetic justify-center !border-white !text-white hover:!bg-white hover:!text-navy-800">
              {t("buttons.callNow")}
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { BUSINESS } from "../lib/constants.js";
import Reveal from "../components/Reveal.jsx";
import CountUp from "../components/CountUp.jsx";
import PageHero, { splitGold } from "../components/PageHero.jsx";
import CtaBand from "../components/CtaBand.jsx";

const SERVICES = [
  { key: "landSales", image: "/services/land-sales.jpg", icon: "M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-8h6v8" },
  { key: "architecture", image: "/services/architecture-construction.jpg", icon: "M4 21V9l8-6 8 6v12M9 21v-6h6v6M4 12h16" },
  { key: "interiorDesign", image: "/services/interior-design.jpg", icon: "M4 4h16v16H4zM4 9h16M9 9v11" },
];

export default function About() {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState({});

  useEffect(() => {
    api.getContent().then((c) => setContent(c.content));
  }, [i18n.language]);

  return (
    <div>
      <PageHero
        eyebrow={t("aboutPage.eyebrow")}
        heading={splitGold(t("aboutPage.title"), 3)}
        subtitle={t(
          "aboutPage.heroSubtitle",
          "A Hosur-based team guiding every plot, layout and build with clear titles and honest planning."
        )}
        bgWord={t("bgWord.about")}
        bgImage="/media/brand/about-hero.jpg"
        heroVariant="showcase"
        bgImageZoom="1.55"
        bgImageFocus="78% 42%"
        icon="M3 21h18M5 21V10.5L12 4l7 6.5V21M9 21v-8h6v8"
      />

      {/* Editorial intro — an oversized opening quotation mark carries
          the brand-story paragraph, paired with a vertical stat rail
          set inside a dark navy signature panel (built from type and
          line-work, not a photo) so this page reads distinctly from
          the homepage's image-led About section. */}
      <section className="relative overflow-hidden section-pad pt-20 sm:pt-24">
        <div className="gold-atmosphere gold-atmosphere-about" />
        <div className="container-content relative grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-stretch lg:gap-16">
          <Reveal variant="up-sm" className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-10 font-display text-[7rem] leading-none text-gold-300/25 sm:-top-14 sm:text-[9rem]"
            >
              &ldquo;
            </span>
            <p className="eyebrow mb-5">{t("aboutPage.eyebrow")}</p>
            <p className="relative max-w-2xl text-2xl leading-relaxed text-navy-800 font-display font-medium sm:text-[1.75rem]">
              {content.about_us_intro}
            </p>
            <span className="mt-8 block h-px w-20 bg-gradient-to-r from-gold-400 to-gold-600" />
          </Reveal>

          {/* Signature panel — pure brand typography/geometry, distinct
              from the homepage brand panel which uses a photograph. */}
          <Reveal variant="scale" delay={140} className="relative flex">
            <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-navy-800 via-navy-800 to-navy-900 p-8 shadow-[0_30px_60px_-28px_rgba(0,8,32,0.55)] sm:p-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/10 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, #dcb768 0px, #dcb768 1px, transparent 1px, transparent 26px)",
                }}
              />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold-300/80">
                  {BUSINESS.tagline}
                </p>
                <p className="mt-6 font-display text-4xl font-bold leading-[0.95] text-white sm:text-5xl">
                  RM<span className="text-gradient-gold">R</span>
                  <span className="mt-2 block text-lg font-semibold uppercase tracking-[0.3em] text-navy-200 sm:text-xl">
                    Realty
                  </span>
                </p>
              </div>

              {/* Core-value icons and one-liner filling the middle space */}
              <div className="relative my-auto py-6 flex items-center justify-center gap-6 text-gold-300/90">
                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase">Trust</span>
                </div>

                <span className="text-gold-500/40">•</span>

                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    <path d="M2 12h20" />
                  </svg>
                  <span className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase">Transparency</span>
                </div>

                <span className="text-gold-500/40">•</span>

                <div className="flex items-center gap-1.5">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-display text-[11px] font-semibold tracking-[0.2em] uppercase">Legacy</span>
                </div>
              </div>

              <div className="relative grid grid-cols-3 gap-4 border-t border-white/10 pt-7">
                {[
                  ["3", t("home.statVerifiedProjects")],
                  ["10+", t("home.statYearsOfTrust")],
                  ["100%", t("home.statTransparentTitles")],
                ].map(([n, l]) => (
                  <div key={l}>
                    <p className="font-display text-2xl font-bold text-gold-300 sm:text-3xl">
                      <CountUp value={n} />
                    </p>
                    <p className="mt-1 text-[10px] uppercase leading-snug tracking-[0.1em] text-navy-200/80">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / Mission — one continuous two-tone plaque: a navy half
          and a cream half meeting at a soft seam, each carrying its own
          icon and copy — a single deliberate composition rather than
          two matching cards or a numbered list. */}
      <section className="section-pad">
        <div className="container-content">
          <Reveal
            variant="scale"
            className="grid overflow-hidden rounded-[1.75rem] shadow-[var(--shadow-md)] sm:grid-cols-2"
          >
            <div className="group relative overflow-hidden bg-gradient-to-br from-navy-700 to-navy-900 p-9 sm:p-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              />
              <div className="icon-badge is-hoverable icon-badge-gold mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-white sm:text-3xl">{t("aboutPage.visionLabel")}</h3>
              <p className="max-w-sm leading-relaxed text-navy-100">{content.vision}</p>
            </div>
            <div className="group relative overflow-hidden bg-[color:var(--color-surface)] p-9 sm:p-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
              />
              <div className="icon-badge is-hoverable icon-badge-navy mb-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="mb-4 font-display text-2xl font-bold text-navy-800 sm:text-3xl">{t("aboutPage.missionLabel")}</h3>
              <p className="max-w-sm leading-relaxed text-[color:var(--color-text-muted)]">{content.mission}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services — elevated, evenly weighted cards (not a sparse pill
          row) each with a color-washed icon panel. */}
      <section className="relative overflow-hidden section-pad bg-[color:var(--color-surface)]">
        <div className="gold-atmosphere gold-atmosphere-light-c" />
        <div className="container-content relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow mb-3">{t("aboutPage.servicesEyebrow")}</p>
            <h2 className="text-3xl font-bold sm:text-4xl">{t("aboutPage.servicesTitle")}</h2>
            <span className="accent-rule mx-auto mt-4" />
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal
                key={s.key}
                variant={i % 2 === 0 ? "up-sm" : "scale"}
                delay={i * 100}
                className="card card-sweep group relative overflow-hidden text-center"
              >
                <span className="card-top-accent" aria-hidden="true" />
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={s.image}
                    alt={t(`aboutPage.${s.key}`)}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/90 via-white/10 to-transparent" />
                </div>
                <div className="relative -mt-10 px-8 pb-8">
                  <div className="icon-badge is-hoverable icon-badge-gold relative z-10 mx-auto mb-6 bg-white">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d={s.icon} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-navy-800">{t(`aboutPage.${s.key}`)}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        eyebrow={t("aboutPage.ctaEyebrow", "Work With Us")}
        title={t("aboutPage.ctaTitle", "Ready to see it for yourself?")}
        subtitle={t(
          "aboutPage.ctaSubtitle",
          "Book a site visit or talk to our team about current availability and pricing."
        )}
        bgWord={t("bgWord.about")}
      />
    </div>
  );
}
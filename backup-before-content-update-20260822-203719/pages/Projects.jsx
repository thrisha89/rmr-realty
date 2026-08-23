import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { getVisitorId } from "../lib/visitor.js";
import Reveal from "../components/Reveal.jsx";
import Spinner from "../components/Spinner.jsx";
import PageHero from "../components/PageHero.jsx";

function coverFor(p) {
  return p.slug === "geetha-garden" ? "/media/projects/geetha-garden/gg-bg.jpg"
    : p.slug === "prestige-imperial" ? "/media/projects/prestige-imperial/pi-bg.jpg"
    : p.slug === "royal-enclasa" ? "/media/projects/royal-enclasa/re-bg.jpg"
    : p.media?.[0]?.path;
}

export default function Projects() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.getProjects().then((d) => setProjects(d.projects)).finally(() => setLoading(false));
  }, [i18n.language]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.location, p.address, p.category]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [projects, query]);

  // Track what visitors search for (debounced) so it's visible in the
  // admin panel — helps the team see what people are looking for.
  useEffect(() => {
    const q = query.trim();
    if (!q) return;
    const timer = setTimeout(() => {
      api.trackSearch({ query: q, resultsCount: filtered.length, visitorId: getVisitorId() });
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      {/* Portfolio hero — built on the same PageHero every interior page
          uses, so its height/proportions match About, Amenities, Gallery,
          Calculator, Contact and Broker Registration exactly. "built on
          trust" keeps the gold treatment since it's the core message of
          this page; the right side carries the softened, slow-drifting
          shot of a project gateway at lg+ plus the shared decorative
          emblem at xl+. */}
      <PageHero
        eyebrow={t("nav.projects")}
        heading={[t("projectsPage.title"), { text: t("projectsPage.titleGold"), gold: true }]}
        subtitle={t("projectsPage.subtitle")}
        bgWord={t("bgWord.projects")}
        bgImage="/media/brand/projects-hero.jpg"
        heroVariant="showcase"
        bgImageZoom="1.5"
        bgImageFocus="80% 40%"
      />

      {/* Portfolio listing — large asymmetric property presentations with
          index numbers and integrated metadata, alternating orientation,
          rather than a uniform card grid. */}
      <section className="relative overflow-hidden section-pad">
        <div className="gold-atmosphere gold-atmosphere-light-b" />
        <div className="container-content relative">
          <div className="mb-14 max-w-md">
            <label htmlFor="project-search" className="sr-only">{t("projectsPage.searchLabel")}</label>
            <div className="relative">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-muted)]" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
              <input
                id="project-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("projectsPage.searchPlaceholder")}
                className="w-full rounded-full border border-[color:var(--color-border)] bg-white py-3 pl-11 pr-4 text-sm shadow-[var(--shadow-sm)] outline-none transition focus:border-gold-400"
              />
            </div>
          </div>
          {loading ? (
            <Spinner label={t("common.loading")} />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-[color:var(--color-text-muted)]">
              {t("projectsPage.noResults", { query })}
            </p>
          ) : (
            <div className="flex flex-col gap-24 sm:gap-32">
              {filtered.map((p, i) => {
                const cover = coverFor(p);
                const reversed = i % 2 === 1;
                return (
                  <Reveal key={p.id} variant={reversed ? "right" : "left"} delay={80}>
                    <article className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
                      {/* Index + rule column — an editorial position marker
                          rather than a decorative icon/dot, since these
                          three properties genuinely are an ordered list. */}
                      <div className={`flex items-center gap-4 lg:col-span-2 lg:flex-col lg:items-start lg:gap-5 ${reversed ? "lg:order-3 lg:items-end" : ""}`}>
                        <span className="index-number shrink-0">{String(i + 1).padStart(2, "0")}</span>
                        <span className="h-px w-full flex-1 bg-gradient-to-r from-gold-300/60 to-transparent lg:h-full lg:w-px lg:flex-1 lg:bg-gradient-to-b" />
                      </div>

                      {/* Oversized image, framed with a thin offset rule
                          behind it for a layered, brochure-style depth */}
                      <div className={`relative lg:col-span-6 ${reversed ? "lg:order-2" : "lg:order-1"}`}>
                        <div
                          aria-hidden="true"
                          className={`pointer-events-none absolute inset-0 hidden rounded-[1.5rem] border border-gold-300/35 lg:block ${
                            reversed ? "-left-4 -top-4" : "-right-4 -bottom-4"
                          }`}
                        />
                        <Link
                          to={`/projects/${p.slug}`}
                          className="group relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] shadow-[var(--shadow-md)] lg:aspect-[5/4]"
                        >
                          {cover ? (
                            <img
                              src={cover}
                              alt={p.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                            />
                          ) : (
                            <div className="grid h-full place-items-center bg-gradient-to-br from-navy-700 to-navy-900 text-gold-300">
                              <span className="font-display text-lg">{p.name}</span>
                            </div>
                          )}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/55 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                          {!p.isVerified && (
                            <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-700 shadow-[var(--shadow-xs)] backdrop-blur-sm">
                              {t("home.comingSoon")}
                            </span>
                          )}
                          {/* Premium "Explore" interaction — reveals on hover rather than sitting static */}
                          <span className="absolute inset-x-6 bottom-6 flex translate-y-4 items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            {t("home.exploreProject")}
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                              <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </Link>
                      </div>

                      {/* Layered metadata */}
                      <div className={`lg:col-span-4 ${reversed ? "lg:order-1" : "lg:order-3"}`}>
                        <p className="eyebrow mb-3">{p.category || t("projectsPage.verifiedProject")}</p>
                        <Link to={`/projects/${p.slug}`}>
                          <h2 className="font-display text-3xl font-bold leading-tight text-navy-800 transition-colors hover:text-gold-600 sm:text-4xl">
                            {p.name}
                          </h2>
                        </Link>
                        {p.location && (
                          <p className="mt-3 flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)]">
                            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-gold-500" fill="currentColor">
                              <path d="M10 2a6 6 0 00-6 6c0 4.2 5.2 9.3 5.4 9.5a.8.8 0 001.2 0C10.8 17.3 16 12.2 16 8a6 6 0 00-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z" />
                            </svg>
                            {p.location}
                          </p>
                        )}
                        <span className="my-6 block h-px w-16 bg-gradient-to-r from-gold-400 to-gold-600" />
                        {p.priceLabel ? (
                          <p className="text-lg font-semibold text-gold-600">{p.priceLabel}</p>
                        ) : (
                          <p className="text-sm font-medium italic text-[color:var(--color-text-muted)]">
                            {t("home.pricingTBA")}
                          </p>
                        )}
                        <Link to={`/projects/${p.slug}`} className="btn-secondary cta-magnetic mt-8 inline-flex">
                          {t("buttons.viewDetails")}
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

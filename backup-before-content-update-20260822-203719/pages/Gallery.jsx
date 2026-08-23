import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import Lightbox from "../components/Lightbox.jsx";
import PageHero, { splitGold } from "../components/PageHero.jsx";

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    api.getProjects().then((d) => setProjects(d.projects));
  }, [i18n.language]);

  const allMedia = useMemo(
    () =>
      projects.flatMap((p) =>
        p.media.map((m) => ({ ...m, projectSlug: p.slug, projectName: p.name }))
      ),
    [projects]
  );

  const filtered = filter === "all" ? allMedia : allMedia.filter((m) => m.projectSlug === filter);

  return (
    <div>
      <PageHero
        eyebrow={t("galleryPage.eyebrow")}
        heading={splitGold(t("galleryPage.title"), 2)}
        subtitle={t(
          "galleryPage.heroSubtitle",
          "Real photographs from real sites — no stock imagery, no renders."
        )}
        bgWord={t("bgWord.gallery")}
        bgImage="/media/brand/gallery-hero.jpg"
        heroVariant="showcase"
        bgImageZoom="1.5"
        bgImageFocus="74% 38%"
      />

      <section className="relative overflow-hidden section-pad">
        <div className="gold-atmosphere gold-atmosphere-light-b" />
        <div className="container-content relative">
          {/* Editorial filter rail — underline tabs with a live count,
              set against a thin full-width rule, replacing the plain
              row of filled/outlined pill buttons. */}
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6 border-b border-[color:var(--color-border)] pb-4">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <button
                onClick={() => setFilter("all")}
                data-active={filter === "all"}
                className={`link-underline pb-1 text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                  filter === "all" ? "text-navy-900" : "text-[color:var(--color-text-muted)] hover:text-navy-800"
                }`}
              >
                {t("galleryPage.allProjects")}
              </button>
              {projects.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => setFilter(p.slug)}
                  data-active={filter === p.slug}
                  className={`link-underline pb-1 text-sm font-semibold uppercase tracking-[0.08em] transition-colors duration-300 ${
                    filter === p.slug ? "text-navy-900" : "text-[color:var(--color-text-muted)] hover:text-navy-800"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <p className="eyebrow shrink-0">{filtered.length}</p>
          </div>

          {/* Masonry-style composition — CSS columns, so image heights
              vary naturally and the wall reads as curated, not a rigid
              square grid. */}
          <div className="[column-fill:balance] columns-2 gap-4 sm:columns-3 lg:columns-4">
            {filtered.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setLightboxIndex(i)}
                className={`group relative mb-4 block w-full overflow-hidden rounded-[1.1rem] break-inside-avoid shadow-[var(--shadow-xs)] transition-shadow duration-300 hover:shadow-[var(--shadow-md)] ${
                  i % 5 === 0 ? "aspect-[3/4]" : i % 5 === 2 ? "aspect-square" : "aspect-[4/5]"
                }`}
              >
                <img
                  src={m.path}
                  alt={m.altText}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/0 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-left text-xs font-semibold uppercase tracking-[0.1em] text-white opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                  {m.projectName}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNav={(dir) => setLightboxIndex((i) => (i + dir + filtered.length) % filtered.length)}
      />
    </div>
  );
}

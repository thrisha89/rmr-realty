import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import LeadForm from "../components/LeadForm.jsx";
import Lightbox from "../components/Lightbox.jsx";
import VideoSection from "../components/VideoSection.jsx";
import Spinner from "../components/Spinner.jsx";

export default function ProjectDetail() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setProject(null);
    setNotFound(false);
    api
      .getProject(slug)
      .then((d) => setProject(d.project))
      .catch(() => setNotFound(true));
  }, [slug, i18n.language]);

  if (notFound) {
    return (
      <div className="section-pad container-content text-center">
        <h1 className="text-2xl font-bold text-navy-800">{t("projectDetailPage.notFound")}</h1>
        <Link to="/projects" className="btn-primary mt-6 inline-flex">{t("buttons.backToProjects")}</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="section-pad container-content">
        <Spinner label={t("common.loading")} />
      </div>
    );
  }

  const cover = project.media?.[0]?.path;

  // Royal Enclasa currently falls into this branch: confirmed real project,
  // no verified details yet. Polished, intentional presentation — not an
  // empty template.
  if (!project.isVerified) {
    return (
      <div>
        <section className="project-hero relative flex items-end overflow-hidden bg-navy-900">
          <div className="absolute inset-0 z-0">
            <img
              src={
                project.slug === 'royal-enclasa' 
                  ? '/media/projects/royal-enclasa/re-bg.jpg' 
                  : cover
              } 
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          {/* Customized darker overlay for Royal Enclasa — preserved as-is */}
          <div 
            className={`absolute inset-0 z-10 ${
              project.slug === 'royal-enclasa'
                ? 'bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-navy-900/30'
                : 'bg-gradient-to-r from-navy-900/70 via-navy-900/30 to-transparent'
            }`} 
          />
          {/* Additional bottom-anchored gradient so the taller hero keeps the
              lowered text block fully legible against the image */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-900/85 via-navy-900/15 to-transparent" />
          <div className="gold-atmosphere gold-atmosphere-hero-a z-10" />
          <span className="pointer-events-none absolute left-6 top-6 z-20 h-10 w-10 border-l border-t border-gold-300/40 sm:left-10 sm:top-10" aria-hidden="true" />
          <div className="container-content relative z-20 w-full pb-10 sm:pb-14 lg:pb-16">
            <p className="eyebrow mb-4 text-gold-400">{t("projectDetailPage.eyebrow")}</p>
            <h1 className="hero-heading hero-heading--project max-w-3xl font-display font-bold text-white">{project.name}</h1>
            {(project.address || project.location) && (
              <p className="mt-4 flex items-center gap-2 text-lg text-navy-100 sm:text-xl">
                <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-gold-400" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6c0 4.2 5.2 9.3 5.4 9.5a.8.8 0 001.2 0C10.8 17.3 16 12.2 16 8a6 6 0 00-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z" />
                </svg>
                {project.address || project.location}
              </p>
            )}
            <p className="mt-6 max-w-lg text-navy-100">
              {t("projectDetailPage.detailsPending")}
            </p>
          </div>
        </section>

        {project.media?.length > 0 && (
          <section className="relative overflow-hidden section-pad">
            <div className="gold-atmosphere gold-atmosphere-light-a" />
            <div className="container-content relative">
              <h2 className="mb-8 text-center text-2xl font-bold text-navy-800">{t("projectDetailPage.sitePhotos")}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {project.media.slice(0, 8).map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setLightboxIndex(i)}
                    className="aspect-square overflow-hidden rounded-[var(--radius-card)]"
                  >
                    <img src={m.path} alt={m.altText} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="relative overflow-hidden section-pad bg-[color:var(--color-surface)]">
          <div className="gold-atmosphere gold-atmosphere-light-c" />
          <div className="container-content relative max-w-xl">
            <h2 className="mb-2 text-center text-2xl font-bold text-navy-800">{t("projectDetailPage.interestedIn", { name: project.name })}</h2>
            <p className="mb-8 text-center text-sm text-[color:var(--color-text-muted)]">
              {t("projectDetailPage.shareDetailsBody")}
            </p>
            <LeadForm source="project_enquiry" projectSlug={project.slug} projectName={project.name} />
          </div>
        </section>

        <Lightbox
          images={project.media}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={(dir) =>
            setLightboxIndex((i) => (i + dir + project.media.length) % project.media.length)
          }
        />
      </div>
    );
  }

  return (
    <div>
      <section className="project-hero relative flex items-end overflow-hidden bg-navy-900">
        <div className="absolute inset-0 z-0">
          <img
            src={
              project.slug === 'prestige-imperial' 
                ? '/media/projects/prestige-imperial/pi-bg.jpg' 
                : project.slug === 'geetha-garden' 
                ? '/media/projects/geetha-garden/gg-bg.jpg' 
                : project.slug === 'royal-enclasa'
                ? '/media/projects/royal-enclasa/re-bg.jpg'
                : cover
            } 
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        {/* Adjusted overlay specifically for prestige-imperial — preserved as-is */}
        <div 
          className={`absolute inset-0 z-10 ${
            project.slug === 'prestige-imperial'
              ? 'bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-navy-900/30'
              : 'bg-gradient-to-r from-navy-900/70 via-navy-900/30 to-transparent'
          }`} 
        />
        {/* Additional bottom-anchored gradient so the taller hero keeps the
            lowered text block fully legible against the image */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-900/85 via-navy-900/15 to-transparent" />
        <div className="gold-atmosphere gold-atmosphere-hero-b z-10" />
        <span className="pointer-events-none absolute left-6 top-6 z-20 h-10 w-10 border-l border-t border-gold-300/40 sm:left-10 sm:top-10" aria-hidden="true" />
        <div className="container-content relative z-20 w-full pb-10 sm:pb-14 lg:pb-16">
          <p className="eyebrow mb-3 text-gold-400">{t("common.verifiedProject")}</p>
          <h1 className="hero-heading hero-heading--project max-w-3xl font-display font-bold text-white">{project.name}</h1>
          {project.location && (
            <p className="mt-4 flex items-center gap-2 text-lg text-navy-100 sm:text-xl">
              <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-gold-400" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6c0 4.2 5.2 9.3 5.4 9.5a.8.8 0 001.2 0C10.8 17.3 16 12.2 16 8a6 6 0 00-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z" />
              </svg>
              {project.location}
            </p>
          )}
        </div>

        {/* Floating price/credential panel — overlaps the hero/content
            boundary so the price reads as a design element, not a badge */}
        {project.priceLabel && (
          <div className="relative z-30 hidden sm:block">
            <div className="container-content">
              <div className="float-panel--dark inline-flex -translate-y-1/2 items-center gap-4 px-7 py-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-300/50 text-gold-300">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M6 3h12M6 8h12M8 3c0 6 8 6 8 12M6 21h12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-navy-200/80">{t("projectDetailPage.startingFrom")}</p>
                  <p className="font-display text-2xl font-bold text-gold-300">{project.priceLabel}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="relative overflow-hidden section-pad pt-16 sm:pt-20">
        <div className="gold-atmosphere gold-atmosphere-light-b" />
        <div className="container-content relative grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center gap-5">
              <p className="eyebrow">{t("projectDetailPage.theProject")}</p>
              <span className="arch-line h-px flex-1" />
            </div>
            <h2 className="mb-4 font-display text-2xl font-bold text-navy-800 sm:text-3xl">{t("projectDetailPage.overview")}</h2>
            <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--color-text-muted)]">{project.description}</p>

            {project.category && (
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-navy-200 px-4 py-2 text-sm text-navy-700">
                  {project.category}
                </span>
              </div>
            )}

            {project.amenities?.length > 0 && (
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-navy-800">{t("common.amenities")}</h3>
                <div className="flex flex-wrap gap-3">
                  {project.amenities.map((a) => (
                    <span key={a.id} className="rounded-full bg-navy-50 px-4 py-2 text-sm text-navy-700">
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-navy-800">{t("projectDetailPage.walkthrough")}</h3>
              <VideoSection 
  videoUrl={
                  project.slug === 'prestige-imperial' 
                    ? '/media/projects/prestige-imperial/pi.mp4' 
                    : project.slug === 'geetha-garden' 
                    ? '/media/projects/geetha-garden/gg.mp4' 
                    : project.videoUrl
                }
  title={project.name} 
  poster={cover} 
/>
            </div>
          </div>

          <div>
            <div className="card sticky top-24 p-6">
              <h3 className="mb-4 text-lg font-semibold text-navy-800">{t("buttons.enquireNow")}</h3>
              <LeadForm source="project_enquiry" projectSlug={project.slug} projectName={project.name} />
            </div>
          </div>
        </div>
      </section>

      {project.media?.length > 0 && (
        <section className="relative overflow-hidden section-pad bg-[color:var(--color-surface)]">
          <div className="gold-atmosphere gold-atmosphere-surface-a" />
          <div className="container-content relative">
            <h2 className="mb-8 text-2xl font-bold text-navy-800">{t("projectDetailPage.gallery")}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {project.media.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square overflow-hidden rounded-[var(--radius-card)]"
                >
                  <img src={m.path} alt={m.altText} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <Lightbox
        images={project.media}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNav={(dir) => setLightboxIndex((i) => (i + dir + project.media.length) % project.media.length)}
      />
    </div>
  );
}

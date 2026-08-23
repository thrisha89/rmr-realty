import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProjectCard({ project }) {
  const { t } = useTranslation();
  
  // Custom cover overrides for specific projects
  const cover = 
    project.slug === 'geetha-garden' 
      ? '/media/projects/geetha-garden/gg-bg.jpg' 
      : project.slug === 'prestige-imperial' 
      ? '/media/projects/prestige-imperial/pi-bg.jpg' 
      : project.slug === 'royal-enclasa' 
      ? '/media/projects/royal-enclasa/re-bg.jpg' 
      : project.media?.[0]?.path;

  return (
    <Link to={`/projects/${project.slug}`} className="card card-sweep group relative flex h-full flex-col overflow-hidden">
      <span className="card-top-accent" aria-hidden="true" />
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-navy-50">
        {cover ? (
          <img
            src={cover}
            alt={project.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-navy-700 to-navy-900 text-gold-300">
            <span className="font-display text-lg">{project.name}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/45 via-navy-900/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {!project.isVerified && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy-700 shadow-[var(--shadow-xs)] backdrop-blur-sm">
            {t("home.comingSoon")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="text-xl font-semibold text-navy-800 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:text-navy-900">{project.name}</h3>
        {project.location && (
          <p className="flex items-center gap-1.5 text-sm text-[color:var(--color-text-muted)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 text-gold-500" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6c0 4.2 5.2 9.3 5.4 9.5a.8.8 0 001.2 0C10.8 17.3 16 12.2 16 8a6 6 0 00-6-6zm0 8.2A2.2 2.2 0 1110 5.8a2.2 2.2 0 010 4.4z" />
            </svg>
            {project.location}
          </p>
        )}
        {project.priceLabel ? (
          <p className="mt-1 text-sm font-semibold text-gold-600">{project.priceLabel}</p>
        ) : (
          <p className="mt-1 text-sm font-medium italic text-[color:var(--color-text-muted)]">
            {t("home.pricingTBA")}
          </p>
        )}
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-semibold text-navy-700 transition-colors group-hover:text-gold-600">
          {t("buttons.viewDetails")}
          <svg viewBox="0 0 20 20" className="btn-icon h-4 w-4" fill="currentColor">
            <path d="M7 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
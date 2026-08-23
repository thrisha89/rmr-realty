// A single, reusable slot for project cinematic video. When `videoUrl` is
// null (the current state — cinematic media is being produced by a
// separate team member), this renders an on-brand static fallback rather
// than a stock video, generic icon, or placeholder image. Once a real
// video file/URL is supplied, passing it as `videoUrl` is the entire
// integration step — no redesign needed.
import { useTranslation } from "react-i18next";

export default function VideoSection({ videoUrl, title, poster }) {
  const { t } = useTranslation();
  if (videoUrl) {
    return (
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-black">
        <video controls poster={poster} className="aspect-video w-full">
          <source src={videoUrl} />
        </video>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-card)] border border-navy-800 bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900">
      <div className="absolute inset-0 opacity-[0.07]">
        <svg width="100%" height="100%">
          <pattern id="rmr-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#rmr-grid)" />
        </svg>
      </div>
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-gold-400/60 text-gold-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="font-display text-lg text-white/90">{title || t("projectDetailPage.walkthrough")}</p>
        <p className="max-w-sm text-sm text-navy-200">
          {t("projectDetailPage.videoProducing")}
        </p>
      </div>
    </div>
  );
}

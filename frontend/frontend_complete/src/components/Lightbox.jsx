import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Lightbox({ images, index, onClose, onNav }) {
  const { t } = useTranslation();
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  if (index === null) return null;
  const img = images[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label={t("a11y.close")}
        className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        ✕
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1); }}
        aria-label={t("a11y.previousImage")}
        className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
      >
        ‹
      </button>
      <img
        src={img.path}
        alt={img.altText}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-[90vw] rounded-sm object-contain"
      />
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1); }}
        aria-label={t("a11y.nextImage")}
        className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
      >
        ›
      </button>
    </div>
  );
}

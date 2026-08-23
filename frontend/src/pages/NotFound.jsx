import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-[70vh] items-center overflow-hidden">
      <div className="gold-atmosphere gold-atmosphere-light-c" />
      <div className="container-content relative text-center">
        <p className="eyebrow mb-4">{t("notFound.eyebrow", "Error 404")}</p>
        <h1 className="font-display text-6xl font-bold text-navy-800 sm:text-8xl">404</h1>
        <span className="accent-rule mx-auto mt-6" />
        <p className="mx-auto mt-6 max-w-md text-[color:var(--color-text-muted)]">
          {t("notFound.body", "This page could not be found. It may have been moved, or the link may be incorrect.")}
        </p>
        <Link to="/" className="btn-primary mt-9 inline-flex">
          {t("notFound.backHome", "Back to Home")}
        </Link>
      </div>
    </div>
  );
}

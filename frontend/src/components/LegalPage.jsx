import { useTranslation } from "react-i18next";

/**
 * titleKey: i18n key resolving to the page heading (e.g. "legal.privacyTitle")
 * bodyKey: optional i18n key for page-specific body copy (e.g. "legal.refundBody").
 *          When omitted, the shared "policy pending" placeholder is shown, translated,
 *          with its trailing link composed from "legal.contactCta".
 */
export default function LegalPage({ titleKey, bodyKey }) {
  const { t } = useTranslation();

  return (
    <div>
      <section className="relative overflow-hidden section-pad bg-navy-800">
        <div className="gold-atmosphere gold-atmosphere-hero-b" />
        <div className="container-content relative">
          <p className="eyebrow mb-3 text-gold-400">{t("legal.eyebrow", "Legal")}</p>
          <h1 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl">{t(titleKey)}</h1>
        </div>
      </section>
      <section className="section-pad">
        <div className="container-content max-w-2xl">
          {bodyKey ? (
            <p className="leading-relaxed text-[color:var(--color-text-muted)]">{t(bodyKey)}</p>
          ) : (
            <p className="leading-relaxed text-[color:var(--color-text-muted)]">
              {t("legal.pendingBody")}{" "}
              <a href="/contact" className="link-underline font-semibold text-navy-700 hover:text-gold-600">
                {t("legal.contactCta")}
              </a>
              .
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

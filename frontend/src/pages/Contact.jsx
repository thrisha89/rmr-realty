import { useTranslation } from "react-i18next";
import { BUSINESS } from "../lib/constants.js";
import LeadForm from "../components/LeadForm.jsx";
import Reveal from "../components/Reveal.jsx";
import PageHero, { splitGold } from "../components/PageHero.jsx";

const CONTACT_ITEM_CONFIG = [
  { key: "officeAddress", value: BUSINESS.address, icon: "M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z M12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" },
  { key: "phone", value: BUSINESS.phone, href: `tel:${BUSINESS.phone}`, icon: "M4 5c0 8.5 6.5 15 15 15l2-4-5-2-2 2c-2-1-4-3-5-5l2-2-2-5-4 1z" },
  { key: "email", value: BUSINESS.email, href: `mailto:${BUSINESS.email}`, icon: "M3 5h18v14H3zM3 7l9 6 9-6" },
  { key: "businessHours", icon: "M12 8v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z" },
];

export default function Contact() {
  const { t } = useTranslation();
  const CONTACT_ITEMS = CONTACT_ITEM_CONFIG.map((item) =>
    item.key === "businessHours" ? { ...item, value: t("home.businessHours") } : item
  );
  return (
    <div>
      <PageHero
        eyebrow={t("nav.contact")}
        heading={splitGold(t("contactPage.heroTitle"), 2)}
        subtitle={t(
          "contactPage.heroSubtitle",
          "Our Hosur office, phone line and enquiry desk — all one message away."
        )}
        bgWord={t("bgWord.contact")}
        bgImage="/media/brand/contact-hero.jpg"
        heroVariant="showcase"
        bgImageZoom="1.5"
        bgImageFocus="82% 48%"
      />

      {/* Two clean, evenly-aligned panels — a dark navy details card and
          a white enquiry card, same rounded treatment, same rhythm, no
          overlap tricks — plus a full-width map strip underneath so
          nothing competes for the same corner of the layout. */}
      <section className="relative overflow-hidden section-pad">
        <div className="gold-atmosphere gold-atmosphere-light-b" />
        <div className="container-content relative">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
            <Reveal
              variant="left"
              className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-navy-800 to-navy-900 p-8 shadow-[0_30px_60px_-30px_rgba(0,8,32,0.6)] sm:p-10 flex flex-col justify-between [&::after]:hidden [&::before]:hidden"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gold-400/10 blur-3xl"
              />
              <p className="eyebrow mb-7 text-gold-400">{t("contactPage.detailsTitle")}</p>
              <ul className="space-y-6">
                {CONTACT_ITEMS.map((item, i) => (
                  <Reveal key={item.key} delay={i * 80} as="li" className="group flex items-start gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold-300/40 text-gold-300 transition-colors duration-300 group-hover:border-gold-300 group-hover:bg-gold-400/10">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-navy-300">
                        {t(`common.${item.key}`)}
                      </p>
                      {item.href ? (
                        <a href={item.href} className="mt-1 block break-words text-white hover:text-gold-300">
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-1 break-words text-white">{item.value}</p>
                      )}
                    </div>
                  </Reveal>
                ))}
              </ul>
              
              {/* Pure luxury architectural gold emblem */}
              <div className="mt-16 flex items-center justify-center pt-4">
                <svg className="h-10 w-full max-w-[280px] text-gold-300/80" viewBox="0 0 280 40" fill="none" stroke="currentColor" strokeWidth="1">
                  {/* Left extended wing line */}
                  <path d="M10 20H100" strokeLinecap="round" strokeOpacity="0.5" />
                  <path d="M20 24H90" strokeLinecap="round" strokeWidth="0.5" strokeOpacity="0.3" />
                  
                  {/* Right extended wing line */}
                  <path d="M180 20H270" strokeLinecap="round" strokeOpacity="0.5" />
                  <path d="M190 24H260" strokeLinecap="round" strokeWidth="0.5" strokeOpacity="0.3" />
                  
                  {/* Center geometric diamond & crest ornament */}
                  <g transform="translate(140, 20)">
                    <diamond x="-8" y="-8" width="16" height="16" transform="rotate(45)" stroke="currentColor" strokeWidth="1.2" fill="rgba(212, 175, 55, 0.15)" />
                    <circle cx="0" cy="0" r="3" fill="currentColor" className="text-gold-400" />
                    <path d="M-14 0H-10M10 0H14" strokeLinecap="round" strokeWidth="1" />
                  </g>
                </svg>
              </div>
              
            </Reveal>

            <Reveal delay={140} variant="right" className="card p-8 sm:p-10">
              <h2 className="mb-2 text-2xl font-bold text-navy-800">{t("contactPage.enquiryTitle")}</h2>
              <span className="accent-rule mb-6" />
              <LeadForm source="contact_form" />
            </Reveal>
          </div>

          <Reveal
            variant="up-sm"
            delay={100}
            className="mt-8 overflow-hidden rounded-[1.25rem] border border-[color:var(--color-border)] shadow-[var(--shadow-sm)]"
          >
            <iframe
              title="RMR Realty office location"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&z=15&output=embed`}
              className="h-72 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}

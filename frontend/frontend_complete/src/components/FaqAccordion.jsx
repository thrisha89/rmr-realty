import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BUSINESS } from "../lib/constants.js";
import Reveal from "./Reveal.jsx";

const FAQ_KEYS = ["visit", "verified", "loan", "quote", "broker", "amenities", "trackEnquiries", "hours"];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="card overflow-hidden !transition-shadow">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-semibold text-navy-800 sm:text-base">{item.q}</span>
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color:var(--color-border)] text-navy-700 transition-transform duration-300 ease-out ${
            isOpen ? "rotate-45 border-gold-400 bg-gold-50 text-gold-600" : ""
          }`}
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 4v12M4 10h12" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-sm leading-relaxed text-[color:var(--color-text-muted)]">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({ showContactCta = true }) {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = FAQ_KEYS.map((key) => ({
    key,
    q: t(`faq.${key}.q`),
    a: t(`faq.${key}.a`, { phone: BUSINESS.phone, hours: t("home.businessHours") }),
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <Reveal key={item.key} variant="up-sm" delay={Math.min(i, 5) * 60}>
            <FaqItem
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
            />
          </Reveal>
        ))}
      </div>

      {showContactCta && (
        <p className="mt-8 text-center text-sm text-[color:var(--color-text-muted)]">
          {t("faq.stillHaveQuestion")}{" "}
          <Link to="/contact" className="font-semibold text-navy-700 hover:text-gold-600">
            {t("faq.getInTouch")}
          </Link>
          .
        </p>
      )}
    </div>
  );
}

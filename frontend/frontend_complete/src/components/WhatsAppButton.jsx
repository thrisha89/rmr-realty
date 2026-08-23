import { WHATSAPP_LINK } from "../lib/constants.js";
import { useTranslation } from "react-i18next";

export default function WhatsAppButton({ hidden = false }) {
  const { t } = useTranslation();
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("a11y.whatsappChat")}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      className={`fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 ease-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2 ${
        hidden ? "pointer-events-none translate-y-4 scale-90 opacity-0" : "translate-y-0 scale-100 opacity-100"
      }`}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.001 3C9.096 3 3.5 8.597 3.5 15.5c0 2.3.62 4.454 1.7 6.31L3 29l7.36-2.15A12.4 12.4 0 0 0 16 28.5c6.905 0 12.5-5.597 12.5-12.5S22.906 3 16.001 3zm0 22.7a10.16 10.16 0 0 1-5.19-1.43l-.372-.222-4.367 1.276 1.303-4.253-.243-.39a10.15 10.15 0 0 1-1.554-5.38c0-5.63 4.583-10.2 10.223-10.2 5.63 0 10.2 4.573 10.2 10.2 0 5.63-4.573 10.2-10.2 10.2zm5.6-7.646c-.307-.154-1.816-.895-2.1-.998-.282-.103-.487-.153-.692.154-.205.307-.79.998-.97 1.204-.178.205-.357.23-.663.077-.307-.154-1.294-.477-2.465-1.52-.911-.813-1.526-1.816-1.705-2.123-.178-.307-.02-.472.134-.625.138-.137.307-.358.46-.537.154-.18.205-.307.307-.512.103-.205.051-.384-.026-.537-.077-.154-.692-1.666-.948-2.283-.25-.6-.505-.52-.692-.53l-.59-.01c-.205 0-.537.077-.818.384-.281.307-1.075 1.05-1.075 2.563 0 1.512 1.1 2.973 1.253 3.178.154.205 2.166 3.306 5.247 4.636.733.316 1.305.505 1.75.647.735.234 1.404.2 1.933.121.59-.088 1.816-.742 2.072-1.46.256-.716.256-1.33.18-1.46-.077-.128-.282-.205-.588-.359z" />
      </svg>
    </a>
  );
}

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import kn from "./locales/kn.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ta: { translation: ta },
    te: { translation: te },
    kn: { translation: kn },
  },
  lng: localStorage.getItem("rmr_lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Keep <html lang="..."> in sync with the active locale. This is what
// lets CSS target script-specific rules (e.g. the extra line-height
// Telugu/Kannada/Tamil headings need) with :lang() instead of adding
// per-language classes throughout the component tree, and it's correct
// for accessibility/font-selection regardless of the hero fix.
if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
  i18n.on("languageChanged", (lang) => {
    document.documentElement.lang = lang;
  });
}

export function changeLanguage(lang) {
  i18n.changeLanguage(lang);
  localStorage.setItem("rmr_lang", lang);
}

export default i18n;

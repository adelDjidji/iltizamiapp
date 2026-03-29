import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./ar";
import en from "./en";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(i18n.use(initReactI18next) as any).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
  initImmediate: false,
});

export default i18n;

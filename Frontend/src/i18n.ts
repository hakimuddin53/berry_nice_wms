import i18n, { Resource } from "i18next";
import * as deDE from "locales/de-DE";
import * as enGB from "locales/en-GB";
import * as enUS from "locales/en-US";
import * as esES from "locales/es-ES";
import { initReactI18next } from "react-i18next";

const resources: Resource = {
  "en-US": enUS,
  "en-GB": enGB,
  "de-DE": deDE,
  "es-ES": esES,
};

const getBrowserLanguage = (): string => {
  const browserLanguage = navigator.language;

  // German DE
  if (browserLanguage.startsWith("de")) return "de-DE";
  // English US / GB
  else if (browserLanguage.startsWith("en"))
    return browserLanguage === "en_GB" ? browserLanguage : "en-US";
  // Spanish
  else if (browserLanguage.startsWith("es")) return "es-ES";
  // Use default fallback language
  else return "";
};

i18n.use(initReactI18next).init({
  resources,
  fallbackNS: "common",
  lng: getBrowserLanguage(),
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
});

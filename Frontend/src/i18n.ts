import i18n, { Resource } from "i18next";
import * as enGB from "locales/en-GB";
import * as enUS from "locales/en-US";
import { initReactI18next } from "react-i18next";

const resources: Resource = {
  "en-US": enUS,
  "en-GB": enGB,
};

const getBrowserLanguage = (): string => {
  const browserLanguage = navigator.language;

  // English US / GB
  if (browserLanguage.startsWith("en"))
    return browserLanguage === "en_GB" ? browserLanguage : "en-US";
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

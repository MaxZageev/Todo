import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import intervalPlural from "i18next-intervalplural-postprocessor";

import I18nWebPackBackend from "@/shared/config/i18n/lib/i18nWebPackBackend";

i18next
  .use(initReactI18next)
  .use(I18nWebPackBackend)
  .use(intervalPlural)
  .init({
    fallbackLng: "ru",
    supportedLngs: ["ru"],
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false
    }
  });

export default i18next;

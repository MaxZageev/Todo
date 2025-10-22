import { type BackendModule } from "i18next";

const I18nWebPackBackend: BackendModule<null> = {
  type: "backend",
  init: () => null,
  read(language: string, namespace: string, callback: (Error, any) => void) {
    import(`@/shared/config/i18n/locales/${language}/${namespace}.json`)
      .then((resources) => callback(null, resources))
      .catch((error) => {
        callback(error, null);
      });
  }
};

export default I18nWebPackBackend;

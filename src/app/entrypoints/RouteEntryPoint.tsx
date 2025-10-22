import "@/shared/config/i18n";
import { memo, Suspense } from "react";
import { useTranslation } from "react-i18next";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

import AppProviders from "@/app/providers/AppProviders";
import App from "../ui/App";

const AppWrapper = () => {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <div>{t("example-app-language-loading", "Loading language...")}</div>;
  }

  return (
    <Suspense fallback={<div>{t("example-app-config-loading", "Loading configuration...")}</div>}>
      <App />
    </Suspense>
  );
};

const cache = createCache({
  key: "example",
  prepend: true
});

const EntryPoint = () => (
  <CacheProvider value={cache}>
    <AppProviders>
      <AppWrapper />
    </AppProviders>
  </CacheProvider>
);

export default memo(EntryPoint);

import { useContext } from "react";
import { useTranslation } from "react-i18next";

import AppConfigContext from "../context/AppConfigContext";

const useAppConfig = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "shared.app-config" });
  const config = useContext(AppConfigContext);
  if (!config) {
    throw new Error(t("missing"));
  }
  return config;
};

export default useAppConfig;

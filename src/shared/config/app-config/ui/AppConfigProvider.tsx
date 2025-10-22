import { type PropsWithChildren } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import getAppConfig from "@/shared/config/app-config/api/getAppConfig";
import { type AppConfigData } from "@/shared/config/app-config/model/AppConfigData";
import AppConfigContext from "../context/AppConfigContext";

const AppConfigProvider = ({ children }: PropsWithChildren) => {
  const { data: config } = useSuspenseQuery<AppConfigData>({
    queryKey: ["config"],
    queryFn: async () => {
      const myConfig = await getAppConfig();

      window.CONFIG = myConfig as AppConfigData;
      Object.freeze(window.CONFIG);
      return myConfig;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchIntervalInBackground: false
  });

  return <AppConfigContext.Provider value={config}>{children}</AppConfigContext.Provider>;
};

export default AppConfigProvider;

import { createContext } from "react";
import { type AppConfigData } from "@/shared/config/app-config/model/AppConfigData";

declare global {
  interface Window {
    CONFIG: AppConfigData;
  }
}

export default createContext<AppConfigData | undefined>(undefined);

import { type AppConfigData } from "@/shared/config/app-config/model/AppConfigData";

const getAppConfig = async (): Promise<AppConfigData> => {
  let response;
  try {
    response = await fetch("./config.json");
    return await response.json();
  } catch (err) {
    throw new Error(`Bad response from server ${response?.status}, ${response?.statusText}`, {
      cause: err
    });
  }
};

export default getAppConfig;

declare const VERSION: string;
declare const GIT_COMMIT: string;
declare const MODULE_NAME: string;
declare const BUILD_DATE: string;

// Декларации модулей для поддержки импортов изображений (jpg, png, svg) в TypeScript.

declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.jpeg" {
  const value: string;
  export default value;
}
declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  const value: string;
  export default value;
}

interface NavigatorUAData {
  brands: { brand: string; version: string }[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues(
    hints: Array<"architecture" | "bitness" | "model" | "platformVersion" | string>
  ): Promise<Record<string, string>>;
}

interface Navigator {
  userAgentData?: NavigatorUAData;
}

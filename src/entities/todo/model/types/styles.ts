import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    mode: "light" | "dark";
    colors: {
      background: string;
      surface: string;
      text: string;
      border: string;
      backgroundImage: string;
      button: string;
      buttonHover: string;
    };
  }
}

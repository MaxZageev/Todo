import type { DefaultTheme } from "styled-components";

/**
 * Палитры для светлой и тёмной тем. Цвета подбирались так, чтобы сохранять читаемость
 * и атмосферу приложения независимо от режима.
 */
export const lightTheme: DefaultTheme = {
  mode: "light",
  colors: {
    background: "#f5feffd8",
    surface: "rgba(255, 255, 255, 0.54)",
    text: "#3a2f25",
    border: "rgba(120,100,80,0.3)",
    backgroundImage: "/img/liteBg.webp",
    button: "#d4a373",
    buttonHover: "#b5835a"
  }
};

export const darkTheme: DefaultTheme = {
  mode: "dark",
  colors: {
    background: "#0e141b",
    surface: "rgba(20,30,45,0.6)",
    text: "#f0f4f9",
    border: "rgba(200,220,255,0.2)",
    backgroundImage: "/img/darkBg.webp",
    button: "#8c3af6ff",
    buttonHover: "#8c3af6d8"
  }
};

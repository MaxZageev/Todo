/**
 * Глобальные стили: задают фон, цветовую схему и CSS-переменные для темы приложения.
 */
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root { color-scheme: ${({ theme }) => theme.mode}; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background} url(${({ theme }) =>
      theme.colors.backgroundImage}) no-repeat center center fixed;
    background-size: cover;
    font-family: -apple-system, Arial;
    transition: background 0.5s ease-in-out, color 0.3s ease-in-out;

    --surface: ${({ theme }) => theme.colors.surface};
    --text: ${({ theme }) => theme.colors.text};
    --border: ${({ theme }) => theme.colors.border};
    --button: ${({ theme }) => theme.colors.button};
    --button-hover: ${({ theme }) => theme.colors.buttonHover};
  }

  body, input, button {
    color: var(--text);
  }
`;

export default GlobalStyles;

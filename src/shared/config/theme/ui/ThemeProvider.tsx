/**
 * Провайдер темы: синхронизирует стили styled-components и MUI, хранит выбранный
 * режим (светлый/тёмный) и запоминает его в localStorage.
 */
import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect
} from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { ThemeProvider as MUIThemeProvider, createTheme, CssBaseline } from "@mui/material";
import GlobalStyles from "./GlobalStyles";
import { lightTheme, darkTheme } from "@/shared/config/theme/lib/themes";
import { loadTheme, saveTheme } from "@/shared/config/theme/lib/themeStorage";
import type { ColorModeContext } from "@/shared/config/theme/model/types";

const ColorModeCtx = createContext<ColorModeContext | null>(null);

export const useColorMode = () => {
  const ctx = useContext(ColorModeCtx);
  if (!ctx) throw new Error("useColorMode необходимо вызывать внутри AppThemeProvider");
  return ctx;
};

export const AppThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Инициализируем режим из localStorage, чтобы повторно использовать выбор пользователя
  const [mode, setMode] = useState<"light" | "dark">(() => loadTheme());

  // Загружаем фоновые изображения один раз, чтобы при переключении темы не было мерцаний
  const backgroundsPreloaded = useRef(false);
  useEffect(() => {
    if (backgroundsPreloaded.current) return;
    if (typeof window === "undefined") return;

    const sources = [lightTheme.colors.backgroundImage, darkTheme.colors.backgroundImage];

    sources.forEach((src) => {
      if (!src) return;

      const selector = `link[rel="preload"][href="${src}"]`;
      if (!document.head.querySelector(selector)) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      }

      const img = new Image();
      img.decoding = "async";
      img.src = src;
    });

    backgroundsPreloaded.current = true;
  }, []);

  // При каждом переключении темы сохраняем выбранный режим
  useEffect(() => {
    saveTheme(mode);
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Styled-components тема содержит цвета и ресурсы для обоев
  const scTheme = mode === "light" ? lightTheme : darkTheme;

  // Темизация MUI: синхронизируем цветовую палитру с styled-components
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: scTheme.colors.background,
            paper: scTheme.colors.surface
          },
          text: { primary: scTheme.colors.text },
          primary: { main: scTheme.colors.button }
        },
        shape: { borderRadius: 15 },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                backdropFilter: "blur(5px)",
                border: "1px solid var(--border)",
                transition: "all 0.4s ease-in-out"
              }
            }
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: "none",
                fontWeight: 500,
                transition: "background-color 0.3s ease, color 0.3s ease",
                backgroundColor: "var(--button)",
                "&:hover": { backgroundColor: "var(--button-hover)" }
              }
            }
          }
        }
      }),
    [mode, scTheme]
  );

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);

  return (
    <ColorModeCtx.Provider value={value}>
      <MUIThemeProvider theme={muiTheme}>
        <SCThemeProvider theme={scTheme}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </SCThemeProvider>
      </MUIThemeProvider>
    </ColorModeCtx.Provider>
  );
};

const THEME_KEY = "theme";

export function loadTheme(): "light" | "dark" {
  const raw = localStorage.getItem(THEME_KEY);
  return raw === "dark" ? "dark" : "light";
}

export function saveTheme(mode: "light" | "dark"): void {
  localStorage.setItem(THEME_KEY, mode);
}

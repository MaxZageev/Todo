import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { IconButton, Tooltip } from "@mui/material";

import { useColorMode } from "@/shared/config/theme/ui/ThemeProvider";

type ThemeToggleButtonProps = {
  size?: "small" | "medium" | "large";
};

const ThemeToggleButton = ({ size = "medium" }: ThemeToggleButtonProps) => {
  const { mode, toggle } = useColorMode();
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Switch to light theme" : "Switch to dark theme"}>
      <IconButton
        color="inherit"
        onClick={toggle}
        size={size}
        aria-label="toggle color theme"
      >
        {isDark ? <LightModeIcon fontSize="inherit" /> : <DarkModeIcon fontSize="inherit" />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggleButton;

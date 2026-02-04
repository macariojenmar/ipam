import { IconButton, Tooltip } from "@mui/material";
import { Moon, Sun } from "lucide-react";
import { DARK, LIGHT } from "../enums/themeEnums";
import { useThemeStore } from "../store/useThemeStore";

export const ThemeSwitch = () => {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <Tooltip title={`Switch to ${mode === LIGHT ? DARK : LIGHT} mode`}>
      <IconButton onClick={toggleTheme}>
        {mode === LIGHT ? <Moon size={20} /> : <Sun size={20} />}
      </IconButton>
    </Tooltip>
  );
};

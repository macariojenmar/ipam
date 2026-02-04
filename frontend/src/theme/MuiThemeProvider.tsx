import { type ReactNode } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./darkTheme";
import lightTheme from "./lightTheme";
import { useThemeStore } from "../store/useThemeStore";
import { DARK } from "../enums/themeEnums";

interface MuiThemeProviderProps {
  children: ReactNode;
}

export const MuiThemeProvider = ({ children }: MuiThemeProviderProps) => {
  const mode = useThemeStore((state) => state.mode);
  const theme = mode === DARK ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

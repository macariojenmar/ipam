export const DARK = "dark" as const;
export const LIGHT = "light" as const;
import type { Theme } from "@mui/material";

export const PRIMARY_COLOR = "#615FFF";

export const TYPOGRAPHY = {
  fontFamily: ["Poppins", "sans-serif"].join(","),
};

export const COMPONENTS = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: "none",
        textTransform: "capitalize",
        minWidth: 90,
        ":hover": {
          boxShadow: "none",
        },
      },
      outlined: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        padding: 14,
        borderRadius: 8,
        boxShadow: "none",
      },
    },
  },
  MuiIconButton: {
    defaultProps: {
      color: "inherit" as const,
    },
  },
};

export const GLOBAL_X_MARGIN = {
  xs: 1,
  md: 10,
  lg: 30,
};

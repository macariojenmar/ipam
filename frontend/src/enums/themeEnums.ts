export const DARK = "dark" as const;
export const LIGHT = "light" as const;
import { type Theme } from "@mui/material";

export const PRIMARY_COLOR = "#615FFF";

export const TYPOGRAPHY = {
  fontFamily: ["Poppins", "sans-serif"].join(","),
};

export const COMPONENTS = {
  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiOutlinedInput-root": {
          borderRadius: 8,
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: "14px",
      },
    },
  },

  MuiInputBase: {
    styleOverrides: {
      root: {
        fontSize: "14px",
      },
      input: {
        fontSize: "14px",
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 12,
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
        borderRadius: 12,
        boxShadow: "none",
      },
    },
  },
  MuiIconButton: {
    defaultProps: {
      color: "inherit" as const,
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: 12,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
        border: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiDataGrid: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: () => ({
        borderRadius: 12,
        boxShadow: "none",
      }),
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontWeight: 800,
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        padding: 20,
        borderTop: `1px solid ${theme.palette.divider}`,
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: "14px",
      },
    },
  },
};

export const GLOBAL_X_MARGIN = {
  xs: 1,
  md: 10,
  lg: 20,
};

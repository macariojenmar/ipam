import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  alpha,
  Stack,
  Button,
} from "@mui/material";
import { GLOBAL_X_MARGIN } from "../enums/themeEnums";
import { ThemeSwitch } from "./ThemeSwitch";
import { Earth } from "lucide-react";

export const Navbar = () => {
  const theme = useTheme();

  return (
    <AppBar
      position="sticky"
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: alpha(theme.palette.background.default, 0.7),
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        boxShadow: "none",
        px: GLOBAL_X_MARGIN,
      }}
    >
      <Toolbar>
        <Stack direction={"row"} alignItems={"center"} sx={{ flexGrow: 1 }} gap={1}>
          <Earth size={22} strokeWidth={2.2}/>
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            IPlytics.io
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <Button variant="outlined" color="inherit">
              Sign Up
            </Button>
            <Button variant="contained" sx={{ mr: 1 }}>
              Login
            </Button>
            <ThemeSwitch />
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

import { Box } from "@mui/material";
import { Navbar } from "./Navbar";
import { NavigationTabs } from "./NavigationTabs";
import { useAuthStore } from "../store/useAuthStore";
import { GLOBAL_X_MARGIN } from "../enums/themeEnums";
import type { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      {isAuthenticated && <NavigationTabs />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: GLOBAL_X_MARGIN,
          py: 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

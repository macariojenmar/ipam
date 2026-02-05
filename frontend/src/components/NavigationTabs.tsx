import { Tabs, Tab, Box, useTheme, alpha } from "@mui/material";
import { LayoutDashboard, Network, Users } from "lucide-react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { PageList } from "../enums/pageEnums";
import { GLOBAL_X_MARGIN } from "../enums/themeEnums";

export const NavigationTabs = () => {
  const theme = useTheme();
  const location = useLocation();

  const currentTab = location.pathname;

  const navItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      path: PageList.DASHBOARD,
    },
    {
      label: "IP Management",
      icon: <Network size={16} />,
      path: PageList.IP_MANAGEMENT,
    },
    {
      label: "Users",
      icon: <Users size={16} />,
      path: PageList.USERS_MANAGEMENT,
    },
  ];

  return (
    <Box
      sx={{
        position: "sticky",
        top: 64,
        zIndex: theme.zIndex.appBar - 1,
        backgroundColor: alpha(theme.palette.background.default, 0.8),
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: GLOBAL_X_MARGIN,
      }}
    >
      <Tabs
        value={currentTab}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 48,
          "& .MuiTab-root": {
            color: "text.secondary",
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: 600,
            },
          },
          "& .MuiTabs-indicator": {
            height: 2,
            borderRadius: "2px 2px 0 0",
          },
        }}
      >
        {navItems.map((item) => (
          <Tab
            key={item.path}
            component={RouterLink}
            to={item.path}
            value={item.path}
            label={item.label}
            icon={item.icon}
            iconPosition="start"
            sx={{
              minHeight: 48,
              textTransform: "none",
              fontSize: "12px",
              gap: 1,
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

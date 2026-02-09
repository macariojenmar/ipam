import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  alpha,
  Stack,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { GLOBAL_X_MARGIN } from "../enums/themeEnums";
import { ThemeSwitch } from "./ThemeSwitch";
import { Earth, LogOut, UserRound } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Fragment, useState } from "react";
import { logout as apiLogout } from "../services/authService";
import toast from "react-hot-toast";
import { UserAvatar } from "./UserAvatar";

export const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    toast.promise(
      (async () => {
        const response = await apiLogout();
        if (response.ok) {
          logout();
          navigate("/login");
        }
        return "See you soon!";
      })(),
      {
        loading: "Logging out...",
        success: (message) => message,
        error: (error) => error.message,
      },
    );
  };

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
      <Toolbar disableGutters>
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{ flexGrow: 1 }}
          gap={1}
        >
          <Earth size={22} strokeWidth={2.2} />
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            IPlytics.io
          </Typography>
        </Stack>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            {user ? (
              <Fragment>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
                    <UserAvatar name={user?.name} size={32} />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  onClick={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  sx={{
                    "& .MuiMenu-paper": {
                      width: "170px",
                    },
                  }}
                >
                  <Stack sx={{ p: 2 }} alignItems={"center"}>
                    <UserAvatar name={user?.name} size={48} sx={{ mb: 1 }} />
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      maxWidth={130}
                      noWrap
                    >
                      {user?.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      maxWidth={130}
                    >
                      {user?.email}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {user?.role_names[0]}
                    </Typography>
                  </Stack>
                  <MenuItem onClick={() => navigate("/profile")}>
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <UserRound size={18} />
                    </ListItemIcon>
                    <Typography variant="body2">Profile</Typography>
                  </MenuItem>
                  <Divider sx={{ mb: 1 }} />
                  <MenuItem onClick={() => handleLogout()}>
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <LogOut size={18} />
                    </ListItemIcon>
                    <Typography variant="body2">Logout</Typography>
                  </MenuItem>
                </Menu>
              </Fragment>
            ) : (
              <Fragment>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={RouterLink}
                  to="/signup"
                >
                  Sign Up
                </Button>
                <Button
                  variant="contained"
                  sx={{ mr: 1 }}
                  component={RouterLink}
                  to="/login"
                >
                  Login
                </Button>
              </Fragment>
            )}
            <ThemeSwitch />
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

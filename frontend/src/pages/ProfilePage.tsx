import { useState } from "react";
import { MainLayout } from "../components/MainLayout";
import PageLabel from "../components/PageLabel";
import {
  Card,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Box,
  ListItemIcon,
} from "@mui/material";
import { UserRound, Lock } from "lucide-react";
import ProfilePersonalInfo from "../components/profile/ProfilePersonalInfo";
import ProfileSecurity from "../components/profile/ProfileSecurity";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  return (
    <MainLayout>
      <PageLabel title="Profile" subTitle="Manage your account settings" />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 2 }}>
          <List disablePadding sx={{ p: 1, width: "100%" }}>
            <ListItemButton
              selected={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
              sx={{
                py: 1.2,
                borderRadius: "8px",
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
                <UserRound size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Profile"
                slotProps={{ primary: { sx: { fontSize: "14px" } } }}
              />
            </ListItemButton>
            <ListItemButton
              selected={activeTab === "password"}
              onClick={() => setActiveTab("password")}
              sx={{
                py: 1.2,
                borderRadius: "8px",
                "&.Mui-selected": {
                  backgroundColor: "action.selected",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.primary" }}>
                <Lock size={18} />
              </ListItemIcon>
              <ListItemText
                primary="Security"
                slotProps={{ primary: { sx: { fontSize: "14px" } } }}
              />
            </ListItemButton>
          </List>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: "8px",
              width: "100%",
            }}
          >
            {activeTab === "profile" ? (
              <ProfilePersonalInfo />
            ) : (
              <ProfileSecurity />
            )}
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ProfilePage;

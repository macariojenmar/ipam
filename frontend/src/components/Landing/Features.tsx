import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Shield, Zap, Search, Users, Activity, Layers } from "lucide-react";

const features = [
  {
    icon: <Search size={24} />,
    title: "IP Tracking",
    description:
      "Real-time tracking of IP assignments and status across your entire network.",
  },
  {
    icon: <Shield size={24} />,
    title: "RBAC Security",
    description:
      "Granular role-based access control to ensure only authorized users can make changes.",
  },
  {
    icon: <Zap size={24} />,
    title: "High Performance",
    description:
      "Built for speed with a modern tech stack and optimized database queries.",
  },
  {
    icon: <Users size={24} />,
    title: "Collaboration",
    description:
      "Seamlessly manage teams and roles with intuitive user management interfaces.",
  },
  {
    icon: <Activity size={24} />,
    title: "Audit Logs",
    description:
      "Complete history of all changes for compliance and troubleshooting.",
  },
  {
    icon: <Layers size={24} />,
    title: "Modular Design",
    description:
      "Clean architecture that scales with your infrastructure needs.",
  },
];

export const Features = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3rem" },
              mb: 2,
            }}
          >
            Powerful Features for Modern Teams
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Everything you need to manage your IP infrastructure in one place.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition:
                    "transform 0.2s ease-in-out, border-color 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        color: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(97, 95, 255, 0.1)"
                            : "rgba(97, 95, 255, 0.05)",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

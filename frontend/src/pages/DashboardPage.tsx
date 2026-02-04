import { Grid, Paper, Typography, Box, useTheme, alpha } from "@mui/material";
import { MainLayout } from "../components/MainLayout";
import {
  Network,
  Activity,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import PageLabel from "../components/PageLabel";

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: { value: string; isUp: boolean };
  color: string;
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 4px 20px 0 rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px 0 rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: "12px",
            backgroundColor: alpha(color, 0.1),
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={24} />
        </Box>
        {trend && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              py: 0.5,
              borderRadius: "20px",
              backgroundColor: trend.isUp
                ? alpha(theme.palette.success.main, 0.1)
                : alpha(theme.palette.error.main, 0.1),
              color: trend.isUp
                ? theme.palette.success.main
                : theme.palette.error.main,
            }}
          >
            {trend.isUp ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <Typography variant="caption" fontWeight="600">
              {trend.value}
            </Typography>
          </Box>
        )}
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight="500"
        sx={{ mb: 0.5 }}
      >
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="700">
        {value}
      </Typography>
    </Paper>
  );
};

const DashboardPage = () => {
  const theme = useTheme();

  const stats = [
    {
      title: "Total Networks",
      value: "1,280",
      icon: Network,
      trend: { value: "12%", isUp: true },
      color: theme.palette.primary.main,
    },
    {
      title: "Active IPs",
      value: "45,203",
      icon: Activity,
      trend: { value: "5.4%", isUp: true },
      color: "#10b981",
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: ShieldCheck,
      trend: { value: "0.2%", isUp: true },
      color: "#8b5cf6",
    },
    {
      title: "Pending Alerts",
      value: "7",
      icon: AlertTriangle,
      trend: { value: "3", isUp: false },
      color: "#f59e0b",
    },
  ];

  return (
    <MainLayout>
      <PageLabel title="Dashboard" subTitle="Summary of your infrastructure." />
    </MainLayout>
  );
};

export default DashboardPage;

import {
  Typography,
  Box,
  alpha,
  Skeleton,
  Card,
  useTheme,
  Grid,
} from "@mui/material";
import { Users, Globe, UserCheck } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { formatNumberCompact } from "../utils/stringHelper";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
  loading = false,
}: StatCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight="500"
        sx={{ mb: 0.5 }}
      >
        {title}
      </Typography>
      {loading ? (
        <Skeleton variant="text" width="60%" height={48} />
      ) : (
        <Typography variant="h3" fontWeight="700">
          {formatNumberCompact(value)}
        </Typography>
      )}
    </Card>
  );
};

const DashboardStats = () => {
  const theme = useTheme();
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();

  const statsConfig = [
    {
      title: "Pending Users",
      value: stats?.pending_users || 0,
      icon: Users,
      color: theme.palette.warning.main,
    },
    {
      title: "IP Count",
      value: stats?.ip_count || 0,
      icon: Globe,
      color: theme.palette.primary.main,
    },
    {
      title: "Active Users",
      value: stats?.active_users || 0,
      icon: UserCheck,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Grid container spacing={2}>
      {statsConfig.map((stat, index) => (
        <Grid key={`stat-key-${index}`} size={{ xs: 4 }}>
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={isLoadingStats}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default DashboardStats;

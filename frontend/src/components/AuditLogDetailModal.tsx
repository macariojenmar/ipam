import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Divider,
  alpha,
  useTheme,
  Grid,
  Tooltip,
} from "@mui/material";
import { type AuditLog } from "../services/auditService";
import { User, Globe, Monitor, Clock } from "lucide-react";
import dayjs from "dayjs";
import { getEventIcon } from "../utils/auditUtils";

interface AuditLogDetailModalProps {
  open: boolean;
  onClose: () => void;
  log: AuditLog;
}

const AuditLogDetailModal = ({
  open,
  onClose,
  log,
}: AuditLogDetailModalProps) => {
  const theme = useTheme();

  const { icon: EventIcon, color } = getEventIcon(log.event);

  const renderValues = (values: object) => {
    if (!values) return "None";
    if (typeof values === "object") {
      return (
        <Box
          component="pre"
          sx={{
            backgroundColor: alpha(theme.palette.action.hover, 0.05),
            p: 1.5,
            borderRadius: 1,
            fontSize: "0.75rem",
            overflow: "auto",
            maxHeight: "200px",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          {JSON.stringify(values, null, 2)}
        </Box>
      );
    }
    return String(values);
  };

  const logMetadata = [
    {
      label: "PERFORMED BY",
      value: log.user?.name || "System",
      icon: User,
    },
    {
      label: "TIMESTAMP",
      value: dayjs(log.created_at).format("MMM DD, YYYY HH:mm:ss"),
      icon: Clock,
    },
    {
      label: "IP ADDRESS",
      value: log.user_ip || "N/A",
      icon: Globe,
    },
    {
      label: "USER AGENT",
      value: log.user_agent || "N/A",
      icon: Monitor,
      isTooltip: true,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: "10px",
              backgroundColor: alpha(color, 0.1),
              color: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <EventIcon size={24} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="700" lineHeight={1}>
              Log Details
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {log.id} • {log.event}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ py: 1 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight="700" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2">{log.description}</Typography>
          </Box>

          <Divider />

          <Grid container spacing={2}>
            {logMetadata.map((item) => (
              <Grid key={item.label} size={{ xs: 6 }}>
                <Stack direction="row" alignItems="center" gap={1} mb={0.5}>
                  <item.icon size={16} color={theme.palette.text.secondary} />
                  <Typography
                    variant="caption"
                    fontWeight="600"
                    color="text.secondary"
                  >
                    {item.label}
                  </Typography>
                </Stack>
                {item.isTooltip ? (
                  <Tooltip title={item.value}>
                    <Typography
                      variant="body2"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography variant="body2">{item.value}</Typography>
                )}
              </Grid>
            ))}
          </Grid>

          {(log.old_values || log.new_values) && (
            <Stack spacing={2}>
              <Divider />
              {log.old_values && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="700"
                    color="error.main"
                    gutterBottom
                  >
                    Old Values
                  </Typography>
                  {renderValues(log.old_values)}
                </Box>
              )}
              {log.new_values && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight="700"
                    color="success.main"
                    gutterBottom
                  >
                    New Values
                  </Typography>
                  {renderValues(log.new_values)}
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" fullWidth size="large">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuditLogDetailModal;

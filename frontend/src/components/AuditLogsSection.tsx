import { useState } from "react";
import {
  Typography,
  Box,
  useTheme,
  alpha,
  Stack,
  Chip,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Card,
  Divider,
  TablePagination,
} from "@mui/material";
import { useAuditLogs, useAuditEvents } from "../hooks/useAuditLogs";
import SearchField from "./SearchField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import {
  Hourglass,
  FolderOpen,
  Trash2,
} from "lucide-react";
import EmptyState from "./EmptyState";
import RelativeTimeTooltip from "./RelativeTimeTooltip";
import AuditLogDetailModal from "./AuditLogDetailModal.tsx";
import { type AuditLog } from "../services/api";
import { getEventIcon } from "../utils/auditUtils";
import { useAuthStore } from "../store/useAuthStore";
import { DEVELOPER } from "../enums/roleEnums";

const AuditLogsSection = () => {
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("all");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: auditLogs, isLoading: isLoadingLogs } = useAuditLogs(
    page + 1,
    perPage,
    search,
    eventType === "all" ? "" : eventType,
    startDate?.format("YYYY-MM-DD"),
    endDate?.format("YYYY-MM-DD"),
  );

  const { data: events } = useAuditEvents();
  const { user } = useAuthStore();
  const isDeveloper = user?.role_names?.includes(DEVELOPER);

  const filteredLogs = auditLogs?.data.filter((log) => {
    if (isDeveloper) return true;
    
    const restrictedEvents = [
      "user_role_assigned",
      "user_role_revoked",
      "permission_created",
      "permission_assigned_to_role",
      "permission_revoked_from_role"
    ];
    
    return !restrictedEvents.includes(log.event as string);
  }) || [];

  const handleClearFilters = () => {
    setSearch("");
    setEventType("all");
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  const handleOpenDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  return (
    <Card variant="outlined" sx={{ padding: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack>
          <Typography variant="h6" fontWeight="700">
            Recent Activity
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Track all system changes and events.
          </Typography>
        </Stack>
        <Chip
          label="Audit Trail"
          size="small"
          sx={{
            fontWeight: "600",
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            py: 2,
            px: 1
          }}
        />
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Stack gap={1} direction={"row"} mb={2} alignItems={"center"}>
        <SearchField
          placeholder="Search logs or users"
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(0);
          }}
        />
        <TextField
          fullWidth
          select
          size="small"
          value={eventType}
          onChange={(e) => {
            setEventType(e.target.value);
            setPage(0);
          }}
        >
          <MenuItem value="all">All Events</MenuItem>
          {events?.map((e) => (
            <MenuItem key={e.value} value={e.value}>
              {e.label}
            </MenuItem>
          ))}
        </TextField>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            setPage(0);
          }}
          format="MMM DD, YYYY"
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            setPage(0);
          }}
          format="MMM DD, YYYY"
        />
        {(search || eventType !== "all" || startDate || endDate) && (
          <Tooltip title="Clear Filters">
            <IconButton onClick={handleClearFilters} size="small">
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack spacing={2}>
        {isLoadingLogs ? (
          <EmptyState
            icon={Hourglass}
            isLoading
            description="Loading recent activity..."
          />
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            gap={1}
            description="No recent activity found"
          />
        ) : (
          filteredLogs.map((log) => {
            const { icon: EventIcon, color } = getEventIcon(log.event);
            return (
              <Card 
                variant="outlined" 
                key={`log-key-${log.id}`}
                sx={{ 
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.action.hover, 0.04),
                  },
                  transition: "all 0.2s ease-in-out",
                }}
                onClick={() => handleOpenDetail(log)}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Stack direction={"row"} alignItems={"center"} gap={2}>
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
                      <EventIcon size={20} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {log.description}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          By {log.user?.name || "System"}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          •
                        </Typography>
                        <RelativeTimeTooltip
                          passedDate={log.created_at}
                          fontSize="0.75rem"
                        />
                      </Box>
                    </Box>
                  </Stack>
                  <Typography
                    variant="body2"
                    display="block"
                    color="text.disabled"
                  >
                    {log.user_ip}
                  </Typography>
                </Stack>
              </Card>
            );
          })
        )}
      </Stack>

      {auditLogs && auditLogs.total > 0 && (
        <TablePagination
          component="div"
          count={auditLogs.total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={perPage}
          onRowsPerPageChange={(e) => {
            setPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{ mt: 2 }}
        />
      )}

      {selectedLog && (
        <AuditLogDetailModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          log={selectedLog}
        />
      )}
    </Card>
  );
};

export default AuditLogsSection;

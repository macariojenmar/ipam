import type { Dispatch, SetStateAction } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
} from "@mui/material";
import { Globe, Pencil, Trash2 } from "lucide-react";
import { UserAvatar } from "../UserAvatar";
import type { IpAddress } from "../../services/ipService";
import { CAN_DELETE_IP_ADDRESS } from "../../enums/permissionEnums";

interface IpMobileViewProps {
  ips: IpAddress[];
  loading: boolean;
  totalRows: number;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: Dispatch<SetStateAction<{ page: number; pageSize: number }>>;
  onEdit: (ip: IpAddress) => void;
  onDelete: (ip: IpAddress) => void;
  hasPermission: (permission: string) => boolean;
  canEdit: (ipUserId: number) => boolean;
}

export const IpMobileView = ({
  ips,
  loading,
  totalRows,
  paginationModel,
  setPaginationModel,
  onEdit,
  onDelete,
  hasPermission,
  canEdit,
}: IpMobileViewProps) => {
  return (
    <Box sx={{ height: "100%", overflowY: "auto", pb: 2 }}>
      <Stack spacing={2}>
        {ips.map((ipRow: IpAddress) => {
          const editable = canEdit(ipRow.user_id);
          return (
            <Card
              key={ipRow.id}
              variant="outlined"
              sx={{ borderRadius: "12px" }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={1.5}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        borderRadius: "10px",
                        bgcolor: "primary.main",
                        height: 34,
                        width: 34,
                      }}
                    >
                      <Globe size={18} color="#fff" />
                    </Avatar>
                    <Box>
                      <Typography
                        fontWeight={700}
                        variant="body1"
                        noWrap
                        sx={{ maxWidth: 150 }}
                      >
                        {ipRow.ip}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {ipRow.type}
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>

                <Box mb={1.5}>
                  <Chip
                    label={ipRow.label}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 600,
                      borderRadius: "8px",
                    }}
                  />
                </Box>

                {ipRow.comment && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      p: 1,
                      bgcolor: "action.hover",
                      borderRadius: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    {ipRow.comment}
                  </Typography>
                )}

                <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <UserAvatar
                      size={24}
                      name={ipRow.user?.name || "Unknown"}
                    />
                    <Typography variant="caption" fontWeight={600}>
                      {ipRow.user?.name || "Unknown"}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => onEdit(ipRow)}
                        sx={{ bgcolor: "action.hover" }}
                      >
                        <Pencil size={16} />
                      </IconButton>
                    </Tooltip>
                    {hasPermission(CAN_DELETE_IP_ADDRESS) && editable && (
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => onDelete(ipRow)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
        {ips.length === 0 && !loading && (
          <Box py={4} textAlign="center">
            <Typography color="text.secondary">No IPs found</Typography>
          </Box>
        )}
      </Stack>
      <TablePagination
        component="div"
        count={totalRows}
        page={paginationModel.page}
        onPageChange={(_, newPage) =>
          setPaginationModel((prev) => ({ ...prev, page: newPage }))
        }
        rowsPerPage={paginationModel.pageSize}
        onRowsPerPageChange={(e) =>
          setPaginationModel((prev) => ({
            ...prev,
            pageSize: parseInt(e.target.value, 10),
            page: 0,
          }))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage={"Rows:"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to}/${count}`
        }
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          mt: 1,
        }}
      />
    </Box>
  );
};

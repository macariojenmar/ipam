import { Fragment } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
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
import type { GridPaginationModel } from "@mui/x-data-grid";
import { Check, Pencil, X } from "lucide-react";
import { UserAvatar } from "../UserAvatar";
import type { UserDetail } from "../../services/userService";
import { PENDING } from "../../enums/statusEnums";
import { CAN_APPROVE_USERS, CAN_REJECT_USERS } from "../../enums/permissionEnums";
import { getStatusColor } from "../../utils/statusUtils";

interface UserMobileViewProps {
  users: UserDetail[];
  loading: boolean;
  totalRows: number;
  paginationModel: GridPaginationModel;
  setPaginationModel: Dispatch<SetStateAction<GridPaginationModel>>;
  onEdit: (user: UserDetail) => void;
  onApprove: (user: UserDetail) => void;
  onReject: (user: UserDetail) => void;
  hasPermission: (permission: string) => boolean;
}


export const UserMobileView = ({
  users,
  loading,
  totalRows,
  paginationModel,
  setPaginationModel,
  onEdit,
  onApprove,
  onReject,
  hasPermission,
}: UserMobileViewProps) => {
  return (
    <Box sx={{ height: "100%", overflowY: "auto", pb: 2 }}>
      <Stack spacing={2}>
        {users.map((userRow: UserDetail) => (
          <Card
            key={userRow.id}
            variant="outlined"
            sx={{ borderRadius: "12px" }}
          >
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <UserAvatar size={40} name={userRow.name} />
                  <Box>
                    <Typography
                      fontWeight={800}
                      variant="body1"
                      noWrap
                      sx={{ maxWidth: 150 }}
                    >
                      {userRow.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {userRow.email}
                    </Typography>
                  </Box>
                </Stack>
                <Chip
                  label={userRow.status}
                  size="small"
                  variant="outlined"
                  color={getStatusColor(userRow.status)}
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                />
              </Stack>

              <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Role
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {userRow.role_names[0]}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => onEdit(userRow)}>
                      <Pencil size={16} />
                    </IconButton>
                  </Tooltip>
                  {userRow.status === PENDING && (
                    <Fragment>
                      {hasPermission(CAN_APPROVE_USERS) && (
                        <Tooltip title="Approve">
                          <IconButton
                            color="success"
                            onClick={() => onApprove(userRow)}
                          >
                            <Check size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                      {hasPermission(CAN_REJECT_USERS) && (
                        <Tooltip title="Reject">
                          <IconButton
                            color="error"
                            onClick={() => onReject(userRow)}
                          >
                            <X size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Fragment>
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && !loading && (
          <Box py={4} textAlign="center">
            <Typography color="text.secondary">No users found</Typography>
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

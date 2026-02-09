import { Fragment, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import {
  updateUserStatus,
  createUser,
  updateUser,
  type UserDetail,
  type UserSaveData,
  type ApiErrorResponse,
} from "../services/api";

import { toast } from "react-hot-toast";
import { MainLayout } from "../components/MainLayout";
import PageLabel from "../components/PageLabel";
import RelativeTimeTooltip from "../components/RelativeTimeTooltip";
import { UserAvatar } from "../components/UserAvatar";
import {
  ACTIVE,
  PENDING,
  REJECTED,
  ARCHIVED,
  APPROVED,
} from "../enums/statusEnums";
import { Check, Pencil, Plus, X } from "lucide-react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import UserModal from "../components/UserModal";
import SearchField from "../components/SearchField";
import { useAuthStore } from "../store/useAuthStore";
import { CAN_APPROVE_USERS, CAN_REJECT_USERS } from "../enums/permissionEnums";
import { useUsers } from "../hooks/useUsers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DEVELOPER } from "../enums/roleEnums";

const getStatusColor = (status: string) => {
  switch (status) {
    case ACTIVE:
      return "success";
    case PENDING:
      return "warning";
    case REJECTED:
    case ARCHIVED:
      return "error";
    default:
      return "default";
  }
};

const UsersManagementPage = () => {
  const { hasPermission } = useAuthStore();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const { user: currentUser } = useAuthStore();
  const isDeveloper = currentUser?.role_names.includes(DEVELOPER);

  const [userModal, setUserModal] = useState<{
    open: boolean;
    user: UserDetail | null;
    processing: boolean;
  }>({
    open: false,
    user: null,
    processing: false,
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: string;
    user: UserDetail | null;
    processing: boolean;
  }>({
    open: false,
    type: APPROVED,
    user: null,
    processing: false,
  });
  const { data: usersData, isLoading: loading } = useUsers(
    paginationModel.page,
    paginationModel.pageSize,
    search,
    statusFilter,
    roleFilter,
  );

  const users = usersData?.data || [];
  const totalRows = usersData?.total || 0;

  const queryClient = useQueryClient();

  const statusUpdateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await updateUserStatus(id, status);
      if (!response.ok) throw new Error("Failed to update user status");
      return response.data;
    },
    onSuccess: (_, variables) => {
      const user = confirmDialog.user;
      toast.success(
        `User ${user?.name} has been ${
          variables.status === ACTIVE ? APPROVED : REJECTED
        }`,
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setConfirmDialog((prev) => ({ ...prev, open: false }));
    },
    onError: () => {
      toast.error("An error occurred while updating user status");
    },
  });

  const saveUserMutation = useMutation({
    mutationFn: async (values: UserSaveData) => {
      const response = userModal.user
        ? await updateUser(userModal.user.id, values)
        : await createUser(values);
      if (!response.ok) {
        const errorData = response.data as ApiErrorResponse;
        throw errorData;
      }
      return response.data;
    },
    onSuccess: (_, values) => {
      toast.success(
        `User ${values.name} ${
          userModal.user ? "updated" : "created"
        } successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setUserModal({ open: false, user: null, processing: false });
    },
    onError: (error: ApiErrorResponse) => {
      const errors = error?.errors;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error?.message ?? "Failed to save user");
      }
    },
  });

  const handleStatusUpdate = async () => {
    if (!confirmDialog.user) return;
    const newStatus = confirmDialog.type === APPROVED ? ACTIVE : REJECTED;
    statusUpdateMutation.mutate({
      id: confirmDialog.user.id,
      status: newStatus,
    });
  };

  const handleSaveUser = async (values: UserSaveData) => {
    saveUserMutation.mutate(values);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction={"row"} gap={1} alignItems={"center"} mt={1.2}>
          <UserAvatar size={30} name={row.name} />
          <Typography fontWeight={800} variant="body2">
            {row.name}
          </Typography>
        </Stack>
      ),
    },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          label={row.status}
          size="small"
          variant="outlined"
          color={getStatusColor(row.status)}
          sx={{
            textTransform: "capitalize",
            fontWeight: 600,
            py: 2,
            px: 1,
          }}
        />
      ),
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      renderCell: ({ row }) => row.role_names[0],
    },
    {
      field: "created_at",
      headerName: "Sign up date",
      flex: 1,
      renderCell: ({ row }) => (
        <RelativeTimeTooltip passedDate={row.created_at} />
      ),
    },
    {
      field: "updated_at",
      headerName: "Last updated",
      flex: 1,
      renderCell: ({ row }) => (
        <RelativeTimeTooltip passedDate={row.updated_at} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction={"row"} alignItems={"center"} mt={1.2}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() =>
                setUserModal({
                  open: true,
                  user: row as UserDetail,
                  processing: false,
                })
              }
            >
              <Pencil size={18} />
            </IconButton>
          </Tooltip>
          {row.status === PENDING && (
            <Fragment>
              {hasPermission(CAN_APPROVE_USERS) && (
                <Tooltip title="Approve">
                  <IconButton
                    color="success"
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        type: APPROVED,
                        user: row as UserDetail,
                        processing: false,
                      })
                    }
                  >
                    <Check size={18} />
                  </IconButton>
                </Tooltip>
              )}
              {hasPermission(CAN_REJECT_USERS) && (
                <Tooltip title="Reject">
                  <IconButton
                    color="error"
                    onClick={() =>
                      setConfirmDialog({
                        open: true,
                        type: REJECTED,
                        user: row as UserDetail,
                        processing: false,
                      })
                    }
                  >
                    <X size={18} />
                  </IconButton>
                </Tooltip>
              )}
            </Fragment>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageLabel
        title="User Management"
        subTitle="Approve or reject user registration requests."
        count={totalRows}
        loading={loading}
      >
        <Button
          variant="contained"
          startIcon={<Plus size={22} />}
          onClick={() =>
            setUserModal({ open: true, user: null, processing: false })
          }
        >
          Add New User
        </Button>
      </PageLabel>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        mb={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <SearchField
          placeholder="Search for name or email"
          value={search}
          onChange={setSearch}
        />
        <Stack direction={"row"} gap={1}>
          <TextField
            size="small"
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all"> All Status</MenuItem>
            <MenuItem value={PENDING}>Pending</MenuItem>
            <MenuItem value={ACTIVE}>Active</MenuItem>
            <MenuItem value={REJECTED}>Rejected</MenuItem>
          </TextField>

          <TextField
            size="small"
            select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            {isDeveloper && <MenuItem value="Developer">Developer</MenuItem>}
            <MenuItem value="Super-Admin">Super Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </TextField>
        </Stack>
      </Stack>
      <Box sx={{ height: "62vh" }}>
        <DataGrid
          rows={users}
          columns={columns}
          rowCount={totalRows}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
        />
      </Box>

      <ConfirmationDialog
        open={confirmDialog.open}
        loading={statusUpdateMutation.isPending}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleStatusUpdate}
        title={`${confirmDialog.type === APPROVED ? "Approve" : "Reject"} User`}
        message={`Are you sure you want to ${confirmDialog.type} ${confirmDialog.user?.name}'s registration request?`}
        confirmText={confirmDialog.type === APPROVED ? "Approve" : "Reject"}
        color={confirmDialog.type === APPROVED ? "success" : "error"}
      />

      <UserModal
        open={userModal.open}
        user={userModal.user}
        loading={saveUserMutation.isPending}
        onClose={() =>
          setUserModal({ open: false, user: null, processing: false })
        }
        onSave={handleSaveUser}
      />
    </MainLayout>
  );
};

export default UsersManagementPage;

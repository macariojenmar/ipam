import { Fragment, useEffect, useState } from "react";
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
  getUsers,
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
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 10,
    page: 0,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  const fetchUsers = async (
    page: number,
    pageSize: number,
    searchTerm: string,
    status: string,
  ) => {
    setLoading(true);
    try {
      const response = await getUsers(
        page + 1,
        pageSize,
        searchTerm || "",
        status === "all" ? "" : status,
      );
      if (response.ok && response.data) {
        setUsers(response.data.data);
        setRowCount(response.data.total);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    if (!confirmDialog.user) return;

    setConfirmDialog((prev) => ({ ...prev, processing: true }));
    const newStatus = confirmDialog.type === APPROVED ? ACTIVE : REJECTED;

    try {
      const response = await updateUserStatus(confirmDialog.user.id, newStatus);
      if (response.ok) {
        toast.success(
          `User ${confirmDialog.user.name} has been ${
            confirmDialog.type === APPROVED ? APPROVED : REJECTED
          }`,
        );
        fetchUsers(
          paginationModel.page,
          paginationModel.pageSize,
          search,
          statusFilter,
        );
        setConfirmDialog((prev) => ({ ...prev, open: false }));
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("An error occurred while updating user status");
    }
    setConfirmDialog((prev) => ({ ...prev, processing: false }));
  };

  const handleSaveUser = async (values: UserSaveData) => {
    setUserModal((prev) => ({ ...prev, processing: true }));
    try {
      const response = userModal.user
        ? await updateUser(userModal.user.id, values)
        : await createUser(values);

      if (response.ok) {
        toast.success(
          `User ${values.name} ${
            userModal.user ? "updated" : "created"
          } successfully`,
        );
        fetchUsers(
          paginationModel.page,
          paginationModel.pageSize,
          search,
          statusFilter,
        );
        setUserModal({ open: false, user: null, processing: false });
      } else {
        const errorData = response.data as ApiErrorResponse;
        const errors = errorData?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            toast.error(errors[key][0]);
          });
        } else {
          toast.error(errorData?.message ?? "Failed to save user");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving user");
    }
    setUserModal((prev) => ({ ...prev, processing: false }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(
        paginationModel.page,
        paginationModel.pageSize,
        search,
        statusFilter,
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [paginationModel.page, paginationModel.pageSize, search, statusFilter]);

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
        <TextField
          size="small"
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            minWidth: 120,
          }}
        >
          <MenuItem value="all"> All Status</MenuItem>
          <MenuItem value={PENDING}>Pending</MenuItem>
          <MenuItem value={ACTIVE}>Active</MenuItem>
          <MenuItem value={REJECTED}>Rejected</MenuItem>
        </TextField>
      </Stack>
      <Box sx={{ height: "62vh" }}>
        <DataGrid
          rows={users}
          columns={columns}
          rowCount={rowCount}
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
        loading={confirmDialog.processing}
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
        loading={userModal.processing}
        onClose={() =>
          setUserModal({ open: false, user: null, processing: false })
        }
        onSave={handleSaveUser}
      />
    </MainLayout>
  );
};

export default UsersManagementPage;

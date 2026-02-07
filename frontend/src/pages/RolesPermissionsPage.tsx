import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Switch,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
} from "@mui/x-data-grid";
import { Plus, Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import { MainLayout } from "../components/MainLayout";
import PageLabel from "../components/PageLabel";
import SearchField from "../components/SearchField";
import PermissionModal from "../components/PermissionModal";
import {
  getPermissions,
  updatePermissionRole,
  createPermission,
  type PermissionItem,
} from "../services/roleService";
import { DEVELOPER, SUPER_ADMIN, USER } from "../enums/roleEnums";

const RolesPermissionsPage = () => {
  const theme = useTheme();
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);
  const roles = [DEVELOPER, SUPER_ADMIN, USER];

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const data = await getPermissions(
        paginationModel.page + 1,
        paginationModel.pageSize,
        search,
      );
      setPermissions(data.data);
      setTotalRows(data.total);
    } catch (error) {
      toast.error("Failed to load permissions");
    }
    setLoading(false);
  };

  const handleToggle = async (
    permissionId: string,
    role: string,
    currentValue: boolean,
  ) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.id === permissionId
          ? {
              ...perm,
              roles: {
                ...perm.roles,
                [role as keyof typeof perm.roles]: !currentValue,
              },
            }
          : perm,
      ),
    );

    const toastId = toast.loading("Saving...");
    try {
      await updatePermissionRole(permissionId, role, !currentValue);
      toast.success("Saved", { id: toastId });
    } catch (error) {
      toast.error("Failed to update permission", { id: toastId });
      setPermissions((prev) =>
        prev.map((perm) =>
          perm.id === permissionId
            ? {
                ...perm,
                roles: {
                  ...perm.roles,
                  [role as keyof typeof perm.roles]: currentValue,
                },
              }
            : perm,
        ),
      );
    }
  };

  const handleCreate = async (name: string) => {
    setCreating(true);
    try {
      const newPermission = await createPermission(name.trim());
      await fetchPermissions();
      toast.success("Permission created and assigned to Developer");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create permission");
    }
    setCreating(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPermissions();
    }, 400);

    return () => clearTimeout(timer);
  }, [search, paginationModel]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Permission Name",
      flex: 1.5,
      minWidth: 250,
      renderCell: (params: GridRenderCellParams) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ height: "100%" }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.text.secondary, 0.1),
              display: "flex",
            }}
          >
            <Shield size={16} />
          </Box>
          <Typography variant="body2" fontWeight={500}>
            {params.value}
          </Typography>
        </Stack>
      ),
    },
    ...roles.map((role) => ({
      field: role,
      headerName: role,
      flex: 1,
      minWidth: 150,
      align: "center" as const,
      headerAlign: "center" as const,
      sortable: false,
      renderCell: (params: GridRenderCellParams<PermissionItem>) => {
        const isChecked =
          params.row.roles[role as keyof typeof params.row.roles];
        return (
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
            sx={{ height: "100%", width: "100%" }}
          >
            <Switch
              checked={isChecked}
              onChange={() => handleToggle(params.row.id, role, isChecked)}
              size="small"
              color="success"
            />
            <Typography
              variant="body2"
              color={isChecked ? "success.main" : "text.disabled"}
              fontWeight={600}
              sx={{ minWidth: 50, textAlign: "left" }}
            >
              {isChecked ? "Enabled" : "Disabled"}
            </Typography>
          </Stack>
        );
      },
    })),
  ];

  return (
    <MainLayout>
      <PageLabel
        title="Roles & Permissions"
        subTitle="Manage access controls for different user roles."
      >
        <Button
          variant="contained"
          startIcon={<Plus size={20} />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add New Permission
        </Button>
      </PageLabel>

      <Box sx={{ mb: 2 }}>
        <SearchField
          value={search}
          onChange={setSearch}
          placeholder="Search for permission name"
        />
      </Box>

      <Box sx={{ height: "62vh", width: "100%" }}>
        <DataGrid
          rows={permissions}
          columns={columns}
          loading={loading}
          rowCount={totalRows}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableColumnMenu
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        />
      </Box>

      <PermissionModal
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={handleCreate}
        creating={creating}
      />
    </MainLayout>
  );
};

export default RolesPermissionsPage;

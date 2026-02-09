import { useState } from "react";
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
  updatePermissionRole,
  createPermission,
  type PermissionItem,
} from "../services/roleService";
import { usePermissions } from "../hooks/usePermissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DEVELOPER, SUPER_ADMIN, USER } from "../enums/roleEnums";

const RolesPermissionsPage = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const roles: string[] = [DEVELOPER, SUPER_ADMIN, USER];
  const { data: permissionsData, isFetching: loading } = usePermissions(
    paginationModel.page,
    paginationModel.pageSize,
    search,
  );

  const permissions = permissionsData?.data || [];
  const totalRows = permissionsData?.total || 0;

  const toggleMutation = useMutation({
    mutationFn: async ({
      permissionId,
      role,
      isEnabled,
    }: {
      permissionId: string;
      role: string;
      isEnabled: boolean;
    }) => {
      await updatePermissionRole(permissionId, role, isEnabled);
    },
    onMutate: async ({ permissionId, role, isEnabled }) => {
      await queryClient.cancelQueries({ queryKey: ["permissions"] });
      const previousPermissions = queryClient.getQueryData(["permissions"]);

      queryClient.setQueriesData({ queryKey: ["permissions"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((perm: PermissionItem) =>
            perm.id === permissionId
              ? {
                  ...perm,
                  roles: {
                    ...perm.roles,
                    [role]: isEnabled,
                  },
                }
              : perm,
          ),
        };
      });

      return { previousPermissions };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPermissions) {
        queryClient.setQueryData(["permissions"], context.previousPermissions);
      }
      toast.error("Failed to update permission");
    },
    onSuccess: () => {
      toast.success("Saved");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => createPermission(name.trim()),
    onSuccess: () => {
      toast.success("Permission created and assigned to Developer");
      setCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: () => {
      toast.error("Failed to create permission");
    },
  });

  const handleToggle = (
    permissionId: string,
    role: string,
    currentValue: boolean,
  ) => {
    toggleMutation.mutate({ permissionId, role, isEnabled: !currentValue });
  };

  const handleCreate = async (name: string) => {
    createMutation.mutate(name);
  };

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
    ...roles.map((role: string) => ({
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
        creating={createMutation.isPending}
      />
    </MainLayout>
  );
};

export default RolesPermissionsPage;

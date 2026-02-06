import { useEffect, useState } from "react";
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
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import {
  createIpAddress,
  deleteIpAddress,
  getIps,
  type IpAddress,
  type IpSaveData,
  type ApiErrorResponse,
  updateIpAddress,
} from "../services/api";
import { toast } from "react-hot-toast";
import { MainLayout } from "../components/MainLayout";
import PageLabel from "../components/PageLabel";
import RelativeTimeTooltip from "../components/RelativeTimeTooltip";
import { Pencil, Plus, Trash2, Globe } from "lucide-react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import IpAddressModal from "../components/IpAddressModal";
import { UserAvatar } from "../components/UserAvatar";
import SearchField from "../components/SearchField";
import { useAuthStore } from "../store/useAuthStore";
import { CAN_DELETE_IP_ADDRESS } from "../enums/permissionEnums";
import { CAN_EDIT_FULL_ROLES } from "../enums/roleEnums";

const IpManagementPage = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [ips, setIps] = useState<IpAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission, user } = useAuthStore();
  const isAdmin = user?.role_names?.some((role) =>
    CAN_EDIT_FULL_ROLES.includes(role),
  );

  const canEdit = (ipUserId: number) => {
    return isAdmin || user?.id === ipUserId;
  };

  const [ipModal, setIpModal] = useState<{
    open: boolean;
    ip: IpAddress | null;
    processing: boolean;
    canEditFull: boolean;
  }>({
    open: false,
    ip: null,
    processing: false,
    canEditFull: true,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ip: IpAddress | null;
    processing: boolean;
  }>({
    open: false,
    ip: null,
    processing: false,
  });

  const fetchIps = async (searchTerm: string, type: string) => {
    setLoading(true);
    try {
      const response = await getIps(1, 10, searchTerm, type);
      if (response.ok && response.data) {
        setIps(response.data.data);
      } else {
        toast.error("Failed to fetch IP addresses");
      }
    } catch (error) {
      toast.error("An error occurred while fetching IP addresses");
    }
    setLoading(false);
  };

  const handleSaveIp = async (values: IpSaveData) => {
    setIpModal((prev) => ({ ...prev, processing: true }));
    try {
      const payload: IpSaveData = {
        ...values,
        id: ipModal.ip?.id,
      };
      const response = ipModal.ip?.id
        ? await updateIpAddress(ipModal.ip.id, payload)
        : await createIpAddress(payload);

      if (response.ok) {
        toast.success(
          `IP Address ${values.ip} ${ipModal.ip ? "updated" : "created"} successfully`,
        );
        fetchIps(search, typeFilter);
        setIpModal({
          open: false,
          ip: null,
          processing: false,
          canEditFull: true,
        });
      } else {
        const errorData = response.data as ApiErrorResponse;
        const errors = errorData?.errors;
        if (errors) {
          Object.keys(errors).forEach((key) => {
            toast.error(errors[key][0]);
          });
        } else {
          toast.error(errorData?.message ?? "Failed to save IP address");
        }
      }
    } catch (error) {
      toast.error("An error occurred while saving IP address");
    }
    setIpModal((prev) => ({ ...prev, processing: false }));
  };

  const handleDeleteIp = async () => {
    if (!deleteDialog.ip) return;

    setDeleteDialog((prev) => ({ ...prev, processing: true }));
    try {
      const response = await deleteIpAddress(deleteDialog.ip.id);
      if (response.ok) {
        toast.success("IP Address deleted successfully");
        fetchIps(search, typeFilter);
        setDeleteDialog({ open: false, ip: null, processing: false });
      } else {
        toast.error("Failed to delete IP address");
      }
    } catch (error) {
      toast.error("An error occurred while deleting IP address");
    }
    setDeleteDialog((prev) => ({ ...prev, processing: false }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchIps(search, typeFilter);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, typeFilter]);

  const columns: GridColDef[] = [
    {
      field: "ip",
      headerName: "IP Address",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction={"row"} gap={1} alignItems={"center"} mt={1.2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Globe size={18} />
          </Box>
          <Typography fontWeight={700} variant="body2">
            {row.ip}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          label={row.type}
          size="small"
          sx={{ fontWeight: 600, py: 1.5, px: 1 }}
        />
      ),
    },
    { field: "label", headerName: "Label", flex: 1 },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1,
      renderCell: ({ row }) => row.comment || "None",
    },
    {
      field: "created_by",
      headerName: "Author",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack direction={"row"} gap={1} alignItems={"center"} mt={1.6}>
          <UserAvatar size={24} name={row.user.name} />
          <Typography variant="body2" fontWeight={600}>
            {row.user.name}
          </Typography>
        </Stack>
      ),
    },
    {
      field: "created_at",
      headerName: "Date created",
      flex: 1,
      renderCell: ({ row }) => (
        <RelativeTimeTooltip passedDate={row.created_at} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => {
        const editable = canEdit(row.user_id);
        return (
          <Stack direction={"row"} alignItems={"center"} mt={1.2}>
            <Tooltip title="Edit">
              <IconButton
                onClick={() =>
                  setIpModal({
                    open: true,
                    ip: row as IpAddress,
                    processing: false,
                    canEditFull: editable,
                  })
                }
              >
                <Pencil size={18} />
              </IconButton>
            </Tooltip>
            {hasPermission(CAN_DELETE_IP_ADDRESS) && editable && (
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() =>
                    setDeleteDialog({
                      open: true,
                      ip: row as IpAddress,
                      processing: false,
                    })
                  }
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <MainLayout>
      <PageLabel
        title="IP Management"
        subTitle="Manage and track your assigned IP addresses."
      >
        <Button
          variant="contained"
          startIcon={<Plus size={22} />}
          onClick={() =>
            setIpModal({
              open: true,
              ip: null,
              processing: false,
              canEditFull: true,
            })
          }
        >
          Add IP Address
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
          placeholder="Search for IP, label, or author"
          value={search}
          onChange={setSearch}
        />
        <TextField
          size="small"
          select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          sx={{
            minWidth: 120,
          }}
        >
          <MenuItem value="all"> All Types </MenuItem>
          <MenuItem value="IPv4">IPv4</MenuItem>
          <MenuItem value="IPv6">IPv6</MenuItem>
        </TextField>
      </Stack>
      <Box sx={{ height: "62vh" }}>
        <DataGrid
          rows={ips}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>

      <IpAddressModal
        open={ipModal.open}
        ipAddress={ipModal.ip}
        loading={ipModal.processing}
        canEditIp={ipModal.canEditFull}
        onClose={() =>
          setIpModal({
            open: false,
            ip: null,
            processing: false,
            canEditFull: true,
          })
        }
        onSave={handleSaveIp}
      />

      <ConfirmationDialog
        open={deleteDialog.open}
        loading={deleteDialog.processing}
        onClose={() => setDeleteDialog((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDeleteIp}
        title="Delete IP Address"
        message={`Are you sure you want to delete IP address ${deleteDialog.ip?.ip}? This action cannot be undone.`}
        confirmText="Delete"
        color="error"
      />
    </MainLayout>
  );
};

export default IpManagementPage;

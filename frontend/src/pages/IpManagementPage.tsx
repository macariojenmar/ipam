import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
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
} from "../services/api";
import { toast } from "react-hot-toast";
import { MainLayout } from "../components/MainLayout";
import PageLabel from "../components/PageLabel";
import RelativeTimeTooltip from "../components/RelativeTimeTooltip";
import { Pencil, Plus, Trash2, Globe } from "lucide-react";
import ConfirmationDialog from "../components/ConfirmationDialog";
import IpAddressModal from "../components/IpAddressModal";

const IpManagementPage = () => {
  const [ips, setIps] = useState<IpAddress[]>([]);
  const [loading, setLoading] = useState(true);

  const [ipModal, setIpModal] = useState<{
    open: boolean;
    ip: IpAddress | null;
    processing: boolean;
  }>({
    open: false,
    ip: null,
    processing: false,
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

  const fetchIps = async () => {
    setLoading(true);
    try {
      const response = await getIps();
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
      const response = await createIpAddress(payload);

      if (response.ok) {
        toast.success(
          `IP Address ${values.ip} ${ipModal.ip ? "updated" : "created"} successfully`,
        );
        fetchIps();
        setIpModal({ open: false, ip: null, processing: false });
      } else {
        toast.error("Failed to save IP address");
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
        fetchIps();
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
    fetchIps();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "ip",
      headerName: "IP Address",
      flex: 1.5,
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
      width: 100,
      renderCell: ({ row }) => (
        <Chip
          label={row.type}
          size="small"
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 600, mt: 1.2 }}
        />
      ),
    },
    { field: "label", headerName: "Label", flex: 1 },
    {
      field: "comment",
      headerName: "Comment",
      flex: 1.5,
      renderCell: ({ row }) => (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.2 }}>
          {row.comment || "-"}
        </Typography>
      ),
    },
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      renderCell: ({ row }) => (
        <RelativeTimeTooltip passedDate={row.created_at} />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction={"row"} alignItems={"center"} mt={1.2}>
          <Tooltip title="Edit">
            <IconButton
              onClick={() =>
                setIpModal({
                  open: true,
                  ip: row as IpAddress,
                  processing: false,
                })
              }
            >
              <Pencil size={18} />
            </IconButton>
          </Tooltip>
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
        </Stack>
      ),
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
            setIpModal({ open: true, ip: null, processing: false })
          }
        >
          Add IP Address
        </Button>
      </PageLabel>

      <Box sx={{ height: "70vh", mt: 2 }}>
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
        onClose={() => setIpModal({ open: false, ip: null, processing: false })}
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

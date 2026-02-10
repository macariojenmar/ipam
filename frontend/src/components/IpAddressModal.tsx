import { useEffect } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { object, string } from "yup";
import { type IpAddress, type IpSaveData } from "../services/ipService";
import { Globe, Info, Tag } from "lucide-react";
import { IP_REGEX } from "../enums/validationEnums";

interface IpAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: IpSaveData) => Promise<void>;
  ipAddress?: IpAddress | null;
  loading?: boolean;
  canEditIp?: boolean;
}

const IpAddressModal = ({
  open,
  onClose,
  onSave,
  ipAddress,
  loading,
  canEditIp = true,
}: IpAddressModalProps) => {
  const isEdit = !!ipAddress;
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      ip: ipAddress?.ip || "",
      type: ipAddress?.type || "IPv4",
      label: ipAddress?.label || "",
      comment: ipAddress?.comment || "",
    },
    enableReinitialize: true,
    validationSchema: object({
      ip: string()
        .required("IP Address is required")
        .matches(IP_REGEX, "Enter a valid IPv4 or IPv6 address"),
      type: string().required("Type is required"),
      label: string().required("Label is required"),
      comment: string().optional(),
    }),
    onSubmit: async (values) => {
      await onSave(values);
      formik.resetForm();
    },
  });

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isEdit ? "Edit IP Address" : "Add New IP Address"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              fullWidth
              label="IP Address"
              placeholder="e.g. 192.168.1.1"
              name="ip"
              size="small"
              disabled={isEdit && !canEditIp}
              value={formik.values.ip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.ip && Boolean(formik.errors.ip)}
              helperText={formik.touched.ip && formik.errors.ip}
              slotProps={{
                input: {
                  startAdornment: (
                    <Globe
                      size={18}
                      color={theme.palette.text.secondary}
                      style={{ marginRight: 8 }}
                    />
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              size="small"
              disabled={isEdit && !canEditIp}
              value={formik.values.type}
              onChange={formik.handleChange}
            >
              <MenuItem value="IPv4">IPv4</MenuItem>
              <MenuItem value="IPv6">IPv6</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Label"
              placeholder="e.g. Home Router"
              name="label"
              size="small"
              value={formik.values.label}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.label && Boolean(formik.errors.label)}
              helperText={formik.touched.label && formik.errors.label}
              slotProps={{
                input: {
                  startAdornment: (
                    <Tag
                      size={18}
                      color={theme.palette.text.secondary}
                      style={{ marginRight: 8 }}
                    />
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              label="Comment"
              placeholder="Optional notes..."
              name="comment"
              size="small"
              multiline
              rows={5}
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.comment && Boolean(formik.errors.comment)}
              helperText={formik.touched.comment && formik.errors.comment}
            />
          </Stack>
          {!canEditIp && (
            <Chip
              label="Limited edits allowed. Full access is for the creator."
              size="small"
              sx={{ width: "fit-content", py: 2, px: 1, mt: 2 }}
              icon={<Info size={18} style={{ marginRight: 1 }} />}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ flexDirection: { xs: "column-reverse", sm: "row" }, gap: { xs: 1, sm: 0 }, p: 3 }}>
          <Button onClick={onClose} variant="outlined" fullWidth sx={{ width: { sm: "auto" } }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ width: { sm: "auto" } }}
            disabled={loading || !formik.dirty}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isEdit ? "Update IP" : "Create IP"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IpAddressModal;

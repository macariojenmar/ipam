import { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import { type UserDetail, type UserSaveData } from "../services/api";
import { ACTIVE, PENDING, REJECTED, ARCHIVED } from "../enums/statusEnums";
import PasswordInput from "./PasswordInput";
import { generateRandomPassword } from "../utils/stringHelper";
import { Mail, RefreshCw, UserRound } from "lucide-react";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (values: UserSaveData) => Promise<void>;
  user?: UserDetail | null;
  loading?: boolean;
}

const UserModal = ({
  open,
  onClose,
  onSave,
  user,
  loading,
}: UserModalProps) => {
  const isEdit = !!user;
  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.roles?.[0]?.name || "User",
      status: user?.status || ACTIVE,
      password: "",
      password_confirmation: "",
    },
    enableReinitialize: true,
    validationSchema: object({
      name: string().required("Name is required"),
      email: string()
        .email("Invalid email address")
        .required("Email is required"),
      role: string().required("Role is required"),
      status: string().required("Status is required"),
      password: string().when("isEdit", {
        is: () => !isEdit,
        then: (schema) =>
          schema
            .min(8, "Minimum 8 characters")
            .required("Password is required"),
        otherwise: (schema) => schema.min(8, "Minimum 8 characters"),
      }),
      password_confirmation: string().oneOf(
        [ref("password")],
        "Passwords must match",
      ),
    }),
    onSubmit: async (values) => {
      await onSave(values);
      formik.resetForm();
    },
  });

  const handleGeneratePassword = () => {
    const newPass = generateRandomPassword(8);
    formik.setFieldValue("password", newPass);
    formik.setFieldValue("password_confirmation", newPass);
  };

  useEffect(() => {
    if (!open) {
      formik.resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2} mt={1}>
            <TextField
              placeholder="John Doe"
              fullWidth
              label="Full Name"
              name="name"
              size="small"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              slotProps={{
                input: {
                  startAdornment: (
                    <UserRound
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
              label="Email"
              placeholder="you@example.com"
              name="email"
              size="small"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              slotProps={{
                input: {
                  startAdornment: (
                    <Mail
                      size={18}
                      color={theme.palette.text.secondary}
                      style={{ marginRight: 8 }}
                    />
                  ),
                },
              }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                select
                label="Role"
                name="role"
                size="small"
                value={formik.values.role}
                onChange={formik.handleChange}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Developer">Developer</MenuItem>
                <MenuItem value="Super-Admin">Super-Admin</MenuItem>
              </TextField>
              <TextField
                disabled={formik.values.status === PENDING}
                fullWidth
                select
                label="Status"
                name="status"
                size="small"
                value={formik.values.status}
                onChange={formik.handleChange}
              >
                <MenuItem value={PENDING}>Pending</MenuItem>
                <MenuItem value={ACTIVE}>Active</MenuItem>
                <MenuItem value={REJECTED}>Rejected</MenuItem>
                <MenuItem value={ARCHIVED}>Archived</MenuItem>
              </TextField>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="flex-start">
              <PasswordInput
                fullWidth
                label={
                  isEdit
                    ? "New Password (Leave blank to keep current)"
                    : "Password"
                }
                name="password"
                size="small"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                variant="outlined"
                onClick={handleGeneratePassword}
                sx={{ minWidth: "fit-content", height: 40 }}
                title="Generate Password"
              >
                <RefreshCw size={18} />
              </Button>
            </Stack>

            <PasswordInput
              fullWidth
              label="Confirm Password"
              name="password_confirmation"
              size="small"
              placeholder="••••••••"
              value={formik.values.password_confirmation}
              onChange={formik.handleChange}
              error={
                formik.touched.password_confirmation &&
                Boolean(formik.errors.password_confirmation)
              }
              helperText={
                formik.touched.password_confirmation &&
                formik.errors.password_confirmation
              }
            />
          </Stack>
        </DialogContent>
        <Divider sx={{ mb: 1.5 }} />
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formik.dirty}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isEdit ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserModal;

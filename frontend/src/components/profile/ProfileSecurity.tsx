import {
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material";
import PasswordInput from "../PasswordInput";
import { updatePassword } from "../../services/authService";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { object, string, ref } from "yup";

const validationSchema = object({
  current_password: string().required("Current password is required"),
  new_password: string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  new_password_confirmation: string()
    .oneOf([ref("new_password")], "Passwords must match")
    .required("Confirm password is required"),
});

const ProfileSecurity = () => {
  const formik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await updatePassword(values);
        if (response.ok && response.data?.success) {
          toast.success(response.data.message);
          resetForm();
        } else {
          toast.error(response.data?.message || "Failed to update password");
        }
      } catch (error) {
        toast.error("An error occurred");
      }
      setSubmitting(false);
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="600">
        Update Password
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Ensure your account is using a long, random password to stay secure.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <PasswordInput
            size="small"
            fullWidth
            id="current_password"
            name="current_password"
            label="Current Password"
            value={formik.values.current_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.current_password &&
              Boolean(formik.errors.current_password)
            }
            helperText={
              formik.touched.current_password && formik.errors.current_password
            }
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <PasswordInput
            size="small"
            fullWidth
            id="new_password"
            name="new_password"
            label="New Password"
            value={formik.values.new_password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.new_password && Boolean(formik.errors.new_password)
            }
            helperText={
              formik.touched.new_password && formik.errors.new_password
            }
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <PasswordInput
            size="small"
            fullWidth
            id="new_password_confirmation"
            name="new_password_confirmation"
            label="Confirm New Password"
            value={formik.values.new_password_confirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.new_password_confirmation &&
              Boolean(formik.errors.new_password_confirmation)
            }
            helperText={
              formik.touched.new_password_confirmation &&
              formik.errors.new_password_confirmation
            }
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
          sx={{ px: 4, width: { sm: "auto" } }}
          startIcon={
            formik.isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          Update Password
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileSecurity;

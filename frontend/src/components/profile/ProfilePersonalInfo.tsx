import {
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";
import { updateProfile } from "../../services/authService";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import { object, string } from "yup";

const validationSchema = object({
  name: string().required("Name is required"),
  email: string().email("Invalid email address").required("Email is required"),
});

const ProfilePersonalInfo = () => {
  const { user, setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await updateProfile(values);
        if (response.ok && response.data?.success) {
          toast.success(response.data.message);
          if (response.data.user) {
            setUser(response.data.user);
          }
        } else {
          toast.error(response.data?.message || "Failed to update profile");
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
        Profile Information
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Update your account's profile information and email address.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            id="name"
            name="name"
            label="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            size="small"
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </Grid>
      </Grid>
      <Box justifyContent={"flex-end"} display={"flex"}>
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
          sx={{ mt: 3 }}
          startIcon={
            formik.isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : null
          }
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfilePersonalInfo;

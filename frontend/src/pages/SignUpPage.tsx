import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  TextField,
  Typography,
  useTheme,
  CircularProgress,
  Link,
  Divider,
} from "@mui/material";
import { ArrowLeft, Earth, Mail, CheckCircle, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { object, string, ref } from "yup";
import toast from "react-hot-toast";
import { type ApiErrorResponse } from "../services/api";
import { register } from "../services/authService";
import IconWrapper from "../components/IconWrapper";
import CenteredLayout from "../components/CenteredLayout";
import PasswordInput from "../components/PasswordInput";

const SignUpPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: object({
      name: string().required("Full name is required"),
      email: string()
        .email("Invalid email address")
        .required("Email is required"),
      password: string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      password_confirmation: string()
        .oneOf([ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await register(values);
        if (response.ok) {
          setIsSuccess(true);
          toast.success("Registration successful!");
        } else {
          const errorData = response.data as ApiErrorResponse;
          const errors = errorData?.errors;
          if (errors) {
            Object.keys(errors).forEach((key) => {
              toast.error(errors[key][0]);
            });
          } else {
            toast.error(errorData?.message ?? "Registration failed");
          }
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  if (isSuccess) {
    return (
      <CenteredLayout>
        <Container maxWidth="sm">
          <Card
            variant="outlined"
            sx={{
              p: { xs: 2, sm: 4 },
              borderRadius: 6,
              textAlign: "center",
            }}
          >
            <Stack spacing={1} alignItems="center">
              <IconWrapper>
                <CheckCircle size={32} color={theme.palette.primary.main} />
              </IconWrapper>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Registration Successful!
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Account has been created and is pending for approval.
              </Typography>
            </Stack>
            <Button
              sx={{ mt: 3 }}
              startIcon={<ArrowLeft size={18} />}
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </Card>
        </Container>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout>
      <Container maxWidth="sm">
        <Card
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 6,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{ px: 2, py: 1 }}
            startIcon={<ArrowLeft size={18} />}
          >
            Home
          </Button>
          <Stack spacing={3} alignItems="center" mt={3}>
            <IconWrapper>
              <Earth size={32} color={theme.palette.primary.main} />
            </IconWrapper>

            <Box>
              <Typography variant="h4" fontWeight="bold" textAlign="center">
                Create Account
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={"center"}
              >
                Join IPlytics by signing up
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Full Name"
                  variant="outlined"
                  placeholder="John Doe"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                <PasswordInput
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  variant="outlined"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                <PasswordInput
                  fullWidth
                  id="password_confirmation"
                  name="password_confirmation"
                  label="Confirm Password"
                  variant="outlined"
                  placeholder="••••••••"
                  value={formik.values.password_confirmation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting}
                sx={{
                  mt: 3,
                  py: 1.5,
                }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={20} />
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Stack
            justifyContent="center"
            sx={{ width: "100%" }}
            alignItems={"center"}
          >
            <Typography variant="caption" color="text.secondary">
              Already have an account?
            </Typography>
            <Link
              onClick={() => navigate("/login")}
              sx={{
                fontSize: "13px",
                fontWeight: "bold",
                cursor: "pointer",
                ml: 0.5,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Login
            </Link>
          </Stack>
        </Card>
      </Container>
    </CenteredLayout>
  );
};

export default SignUpPage;

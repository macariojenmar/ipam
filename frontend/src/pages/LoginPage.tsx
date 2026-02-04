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
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { ArrowLeft, Earth, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { object, string } from "yup";
import toast from "react-hot-toast";
import { login } from "../services/api";
import IconWrapper from "../components/IconWrapper";
import CenteredLayout from "../components/CenteredLayout";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: object({
      email: string()
        .email("Invalid email address")
        .required("Email is required"),
      password: string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await login(values);
        if (response.ok && response.data) {
          setAuthUser(response.data.user, response.data.access_token);
          toast.success("Welcome back!");
          navigate("/dashboard");
        } else {
          toast.error(response?.data?.error ?? "Invalid credentials");
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <CenteredLayout>
      <Container maxWidth="sm">
        <Card
          variant="outlined"
          sx={{
            p: 4,
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
              <Typography variant="h4" fontWeight="bold">
                Welcome Back!
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={"center"}
              >
                Please enter your details to login
              </Typography>
            </Box>

            <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
              <Stack spacing={2} sx={{ width: "100%" }}>
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
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Lock
                          size={18}
                          color={theme.palette.text.secondary}
                          style={{ marginRight: 8 }}
                        />
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
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
                {formik.isSubmitting ? <CircularProgress size={20} /> : "Login"}
              </Button>
            </form>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ width: "100%" }}
              alignItems={"center"}
            >
              <Button
                variant="text"
                size="small"
                sx={{ color: "text.secondary", px: 2 }}
              >
                Forgot password?
              </Button>
              <Link
                onClick={() => navigate("/signup")}
                sx={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign Up
              </Link>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </CenteredLayout>
  );
};

export default LoginPage;

import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const Hero = () => {
  return (
    <Box
      sx={{
        pt: { xs: 8, md: 15 },
        pb: { xs: 8, md: 12 },
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(97, 95, 255, 0.05) 0%, rgba(97, 95, 255, 0) 100%)"
            : "linear-gradient(180deg, rgba(97, 95, 255, 0.03) 0%, rgba(97, 95, 255, 0) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} alignItems="center" textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "4rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Manage Your IP Space <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              With Absolute Precision
            </Box>
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", fontWeight: 400 }}
          >
            The modern IP Address Management (IPAM) solution designed for speed,
            security, and seamless collaboration across your infrastructure.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              sx={{ py: 1.5, px: 4, fontSize: "1rem" }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              variant="outlined"
              size="large"
              sx={{ py: 1.5, px: 4, fontSize: "1rem" }}
            >
              Create Account
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

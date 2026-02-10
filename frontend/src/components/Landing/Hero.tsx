import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { DARK } from "../../enums/themeEnums";

const MotionStack = motion.create(Stack);
const MotionTypography = motion.create(Typography);

export const Hero = () => {
  return (
    <Box
      sx={{
        pt: { xs: 8, md: 15 },
        pb: { xs: 0, md: 12 },
        background: (theme) =>
          theme.palette.mode === DARK
            ? "linear-gradient(180deg, rgba(97, 95, 255, 0.05) 0%, rgba(97, 95, 255, 0) 100%)"
            : "linear-gradient(180deg, rgba(97, 95, 255, 0.03) 0%, rgba(97, 95, 255, 0) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <MotionStack
          spacing={4}
          alignItems="center"
          textAlign="center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <MotionTypography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "4rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Manage Your IP Space <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              With Absolute Precision
            </Box>
          </MotionTypography>

          <MotionTypography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", fontWeight: 400 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            The modern IP Address Management (IPAM) solution designed for speed,
            security, and seamless collaboration across your infrastructure.
          </MotionTypography>

          <MotionStack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, md: 1 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            width={{ xs: "100%", sm: "auto" }}
          >
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1rem",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Get Started
            </Button>
            <Button
              component={RouterLink}
              to="/signup"
              variant="outlined"
              size="large"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1rem",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Create Account
            </Button>
          </MotionStack>
        </MotionStack>
      </Container>
    </Box>
  );
};

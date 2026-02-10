import {
  Box,
  Typography,
  Container,
  Stack,
  Link,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <Box
      sx={{
        py: 6,
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}
              >
                IPlytics.io
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Modern IP Address Management for Everyone.
              </Typography>
            </Box>

            <Stack direction="row" spacing={3}>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/macariojenmar/ipam"
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: "14px" }}
              >
                GitHub
              </Link>
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href="https://dev-jenmar.vercel.app"
                color="text.secondary"
                underline="hover"
                sx={{ fontSize: "14px" }}
              >
                Jenmar Macario
              </Link>
            </Stack>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} IPlytics.io. All rights reserved.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
};

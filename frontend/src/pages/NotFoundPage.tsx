import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import { Ghost, ArrowLeft } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import IconWrapper from "../components/IconWrapper";

interface NotFoundPageProps {
  title?: string;
  message?: string;
}

const NotFoundPage = ({
  title = "404 - Page Not Found",
  message = "Oops! The page you're looking for doesn't exist.",
}: NotFoundPageProps) => {
  const theme = useTheme();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <IconWrapper size={80}>
          <Ghost size={34} color={theme.palette.primary.main} />
        </IconWrapper>

        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={18} />}
          component={RouterLink}
          to="/"
          sx={{
            borderRadius: 3,
            textTransform: "none",
            px: 4,
            py: 1.5,
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;

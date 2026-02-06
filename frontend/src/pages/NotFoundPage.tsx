import { Box, Typography, Button, Container } from "@mui/material";
import { MoveLeft, Ghost } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

interface NotFoundPageProps {
  title?: string;
  message?: string;
}

const NotFoundPage = ({ 
  title = "404 - Page Not Found", 
  message = "Oops! The page you're looking for doesn't exist or you don't have permission to view it." 
}: NotFoundPageProps) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "action.hover",
            mb: 1,
          }}
        >
          <Ghost size={40} />
        </Box>
        
        <Box>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {message}
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<MoveLeft size={18} />}
          component={RouterLink}
          to="/"
          sx={{
            borderRadius: 3,
            textTransform: "none",
            px: 4,
          }}
        >
          Back to Safety
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;

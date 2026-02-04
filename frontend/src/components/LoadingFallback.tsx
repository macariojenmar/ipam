import { Box, CircularProgress, Typography } from "@mui/material";

export const LoadingFallback = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: 2,
      }}
    >
      <CircularProgress size={24} thickness={4}/>
      <Typography variant="body2" color="text.secondary" textAlign={"center"}>
        Getting page ready
      </Typography>
    </Box>
  );
};

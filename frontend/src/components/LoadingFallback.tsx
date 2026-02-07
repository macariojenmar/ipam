import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import { Hourglass } from "lucide-react";
import { useMemo } from "react";
import IconWrapper from "./IconWrapper";

const LOADING_PHRASES = [
  "Getting page ready…",
  "Warming things up…",
  "Fetching the good stuff…",
  "Almost there…",
  "Loading awesomeness…",
  "Hang tight, preparing content…",
  "Just a moment…",
];

export const LoadingFallback = () => {
  const theme = useTheme();
  const phrase = useMemo(() => {
    return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
  }, []);

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
      <IconWrapper size={60}>
        <Hourglass size={24} color={theme.palette.primary.main} />
      </IconWrapper>
      <LinearProgress sx={{ width: 150 }} />
      <Typography variant="body2" color="text.secondary" textAlign="center">
        {phrase}
      </Typography>
    </Box>
  );
};

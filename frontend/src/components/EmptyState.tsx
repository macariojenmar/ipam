import { Box, LinearProgress, Typography, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { LucideIcon } from "lucide-react";
import IconWrapper from "./IconWrapper";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title?: string;
  description?: ReactNode;
  isLoading?: boolean;
  height?: number | string;
  gap?: number;
  iconSize?: number;
  showProgress?: boolean;
  sx?: SxProps<Theme>;
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  isLoading = false,
  height = 300,
  gap = 2,
  iconSize = 24,
  showProgress = false,
  sx,
}: EmptyStateProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height,
        gap,
        ...sx,
      }}
    >
      <IconWrapper size={60}>
        <Icon size={iconSize} color={theme.palette.primary.main} />
      </IconWrapper>
      
      {(isLoading || showProgress) && (
        <LinearProgress sx={{ width: 150 }} />
      )}

      {title && (
        <Typography variant="h6" fontWeight="600" textAlign="center">
          {title}
        </Typography>
      )}

      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default EmptyState;

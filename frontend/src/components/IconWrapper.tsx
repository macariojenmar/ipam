import { Box, alpha, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";

interface IconWrapperProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
  size?: number;
}

const IconWrapper = ({ children, size = 64, sx }: IconWrapperProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 1,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default IconWrapper;

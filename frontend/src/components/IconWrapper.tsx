import { Box, alpha, useTheme } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import type { ReactNode } from "react";

interface IconWrapperProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

const IconWrapper = ({ children, sx }: IconWrapperProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 64,
        height: 64,
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

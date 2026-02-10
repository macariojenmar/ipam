import { Box, type BoxProps } from "@mui/material";
import BrandLogo from "../assets/iplytics.svg";

interface LogoProps extends BoxProps {
  size?: number | string | { xs?: number | string; sm?: number | string; md?: number | string; lg?: number | string; xl?: number | string };
}

export const Logo = ({ size = 32, sx, ...props }: LogoProps) => (
  <Box
    component="img"
    src={BrandLogo}
    alt="IPlytics Logo"
    sx={{
      width: size,
      height: size,
      objectFit: "contain",
      ...sx
    }}
    {...props}
  />
);

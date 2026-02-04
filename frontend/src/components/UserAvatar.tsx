import { Avatar, useTheme } from "@mui/material";

interface UserAvatarProps {
  size?: number;
  sx?: object;
  name?: string;
}

export const UserAvatar = ({ size = 40, sx = {}, name }: UserAvatarProps) => {
  const theme = useTheme();

  return (
    <Avatar
      sx={{
        width: size,
        height: size,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: size * 0.45,
        ...sx,
      }}
    >
      {name ? name.charAt(0).toUpperCase() : "U"}
    </Avatar>
  );
};

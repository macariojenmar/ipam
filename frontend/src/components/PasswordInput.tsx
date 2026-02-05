import { useState } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
  type TextFieldProps,
  useTheme,
} from "@mui/material";
import { Eye, EyeOff, Lock } from "lucide-react";

type PasswordInputProps = TextFieldProps & {
  onShowPassword?: (show: boolean) => void;
};

const PasswordInput = ({ onShowPassword, ...props }: PasswordInputProps) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    const nextState = !showPassword;
    setShowPassword(nextState);
    if (onShowPassword) {
      onShowPassword(nextState);
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return (
    <TextField
      {...props}
      type={showPassword ? "text" : "password"}
      slotProps={{
        input: {
          startAdornment: (
            <Lock
              size={18}
              color={theme.palette.text.secondary}
              style={{ marginRight: 8 }}
            />
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="small"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </IconButton>
            </InputAdornment>
          ),
          ...props.slotProps?.input,
        },
      }}
    />
  );
};

export default PasswordInput;

import { IconButton, InputAdornment, type SxProps, TextField, type Theme } from "@mui/material";
import { Search, X } from "lucide-react";

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

const SearchField = ({
  value,
  onChange,
  placeholder = "Search...",
  sx,
}: SearchFieldProps) => {
  return (
    <TextField
      size="small"
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: { xs: "100%", md: 300 }, ...sx }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onChange("")}
                edge="end"
                sx={{ p: 0.5 }}
              >
                <X size={16} />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchField;

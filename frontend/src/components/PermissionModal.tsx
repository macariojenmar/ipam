import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface PermissionModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
  creating: boolean;
}

const PermissionModal = ({
  open,
  onClose,
  onCreate,
  creating,
}: PermissionModalProps) => {
  const [newPermissionName, setNewPermissionName] = useState("");

  const isValidKebabCase = (text: string) =>
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(text);

  const handleCreate = () => {
    onCreate(newPermissionName);
    setNewPermissionName(""); // Reset after create attempt (parent handles success logic usually)
  };

  const handleClose = () => {
    setNewPermissionName("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Permission</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            size="small"
            autoFocus
            fullWidth
            label="Permission Name"
            placeholder="e.g., can-manage-billing"
            value={newPermissionName}
            onChange={(e) => setNewPermissionName(e.target.value)}
            error={
              newPermissionName.length > 0 &&
              !isValidKebabCase(newPermissionName)
            }
            helperText={
              newPermissionName.length > 0 &&
              !isValidKebabCase(newPermissionName)
                ? "Permission name must be in kebab-case (lowercase, hyphen-separated)"
                : "This permission will be automatically assigned to the Developer role."
            }
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ flexDirection: { xs: "column-reverse", sm: "row" }, gap: { xs: 1, sm: 0 }, p: 3 }}>
        <Button onClick={handleClose} variant="outlined" fullWidth sx={{ width: { sm: "auto" } }}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          fullWidth
          sx={{ width: { sm: "auto" } }}
          disabled={
            !newPermissionName.trim() ||
            creating ||
            !isValidKebabCase(newPermissionName)
          }
          startIcon={
            creating ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PermissionModal;

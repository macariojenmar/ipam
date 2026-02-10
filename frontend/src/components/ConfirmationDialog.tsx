import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  children?: React.ReactNode;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  color = "primary",
  children,
}: ConfirmationDialogProps) => {
  return (
    <Dialog maxWidth={"xs"} open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2" maxWidth={320}>
          {message}
        </DialogContentText>
        {children}
      </DialogContent>
      <DialogActions sx={{ flexDirection: { xs: "column-reverse", sm: "row" }, gap: { xs: 1, sm: 0 }, p: 3 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined" fullWidth={true} sx={{ width: { sm: "auto" } }}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          disabled={loading}
          variant="contained"
          color={color}
          fullWidth={true}
          sx={{ width: { sm: "auto" } }}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

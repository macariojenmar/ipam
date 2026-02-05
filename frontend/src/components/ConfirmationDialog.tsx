import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Divider,
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
      <DialogTitle fontWeight={800}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText variant="body2" maxWidth={320}>
          {message}
        </DialogContentText>
        {children}
      </DialogContent>
      <Divider sx={{ mb: 1.5 }} />
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={onClose} disabled={loading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          disabled={loading}
          variant="contained"
          color={color}
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

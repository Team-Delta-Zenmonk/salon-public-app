import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from "@mui/material";
import styles from "./delete-dialog.module.css";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  itemName: string;
  isLoading: boolean;
  onDelete: () => void | Promise<void>;
}

export default function DeleteDialog({
  open,
  onClose,
  title = "Delete Item?",
  itemName,
  isLoading,
  onDelete,
}: Readonly<DeleteDialogProps>) {
  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
    >
      <DialogTitle>
        <Typography fontWeight="fontWeightBold">{title}</Typography>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <Typography>
          Are you sure you want to delete <strong>"{itemName}"</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} disabled={isLoading} variant="outlined">
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onDelete}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

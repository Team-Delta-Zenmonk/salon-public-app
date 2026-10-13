import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from "./dialogs.module.css";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  color?: "error" | "primary" | "warning";
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title,
  description,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  color = "error",
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" className={styles.description}>
          {description}
        </Typography>
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <Button onClick={onClose} color="inherit" className={styles.cancelButton}>
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={color}
          variant="contained"
          disabled={loading}
          className={styles.confirmButton}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

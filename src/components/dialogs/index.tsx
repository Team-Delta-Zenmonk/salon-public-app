import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
      <DialogTitle className="text-(--app-text) font-bold">{title}</DialogTitle>

      <DialogContent>
        <Typography variant="body2" className="text-(--app-muted)">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions className="px-6 pb-5">
        <Button onClick={onClose} color="inherit" className="text-(--app-muted)">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color={color}
          variant="contained"
          disabled={loading}
          className="font-semibold shadow-none hover:shadow-none"
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

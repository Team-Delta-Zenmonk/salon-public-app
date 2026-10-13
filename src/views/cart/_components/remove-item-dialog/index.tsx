import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./remove-item-dialog.module.css";

interface ConfirmRemoveItemDialogProps {
  open: boolean;
  serviceName?: string;
  removing?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmRemoveItemDialog({ open, serviceName, removing, onCancel, onConfirm }: Readonly<ConfirmRemoveItemDialogProps>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      fullScreen={fullScreen}
      slotProps={{
        paper: { className: styles.paper },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>Remove service?</DialogTitle>

      <DialogContent>
        <Typography variant="body2" className={styles.dialogBody}>
          Are you sure you want to remove{" "}
          <EllipsisCell
            value={serviceName || "this service"}
            className={styles.serviceNameInline}
            maxChars={20}
          />{" "}
          from your cart?
        </Typography>
      </DialogContent>

      <DialogActions className={styles.dialogActions}>
        <Button onClick={onCancel} color="inherit" disabled={removing}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={removing}>
          {removing ? <CircularProgress size={16} className={styles.progressWhite} /> : null}
          {removing ? "Removing..." : "Remove"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

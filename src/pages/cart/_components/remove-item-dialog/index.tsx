import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface Props {
  open: boolean;
  serviceName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmRemoveItemDialog({
  open,
  serviceName,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Remove service?</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          Are you sure you want to remove{" "}
          <strong>{serviceName || "this service"}</strong> from your cart?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  );
}

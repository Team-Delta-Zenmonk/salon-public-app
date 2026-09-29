import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery, Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
    <Dialog open={open} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle className="text-(--app-text)">Remove service?</DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" className="text-(--app-muted)">
          Are you sure you want to remove{" "}
          <Box component="span" className="font-semibold text-(--app-text)">
            {serviceName || "this service"}
          </Box>{" "}
          from your cart?
        </Typography>
      </DialogContent>

      <DialogActions className="px-6 pb-5">
        <Button onClick={onCancel} color="inherit" disabled={removing}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={removing}>
          {removing ? <CircularProgress size={16} className="text-white mr-2" /> : null}
          {removing ? "Removing..." : "Remove"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

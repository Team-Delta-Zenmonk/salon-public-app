import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, useMediaQuery, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface Props {
  open: boolean;
  serviceName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmRemoveItemDialog({ open, serviceName, onCancel, onConfirm }: Props) {
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

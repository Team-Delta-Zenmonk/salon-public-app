import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider } from "@mui/material";

interface SwitchCartDialogProps {
  open: boolean;
  currentCartItemsCount: number;
  newSalonName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SwitchCartDialog({
  open,
  currentCartItemsCount,
  newSalonName,
  onConfirm,
  onCancel,
}: SwitchCartDialogProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Switch Salon Cart</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography>
            You have <strong>{currentCartItemsCount} item(s)</strong> in your current cart.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Adding this service will create a new cart for <strong>{newSalonName}</strong> and replace your current
            cart.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography color="warning.main">
            Current cart items will be <strong>deleted</strong>.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary" startIcon="➜">
          Switch & Add Service
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
}: Readonly<SwitchCartDialogProps>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle className="text-(--app-text)">Switch Salon Cart</DialogTitle>
      <DialogContent>
        <Box className="py-2">
          <Typography>
            You have{" "}
            <Box component="span" className="font-semibold">
              {currentCartItemsCount} item(s)
            </Box>{" "}
            in your current cart.
          </Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1 text-(--app-muted)">
            Adding this service will create a new cart for{" "}
            <Box component="span" className="font-semibold text-(--app-text)">
              {newSalonName}
            </Box>{" "}
            and replace your current cart.
          </Typography>
          <Divider className="my-2 border-(--app-border)" />
          <Typography color="warning.main">
            Current cart items will be{" "}
            <Box component="span" className="font-semibold">
              deleted
            </Box>
            .
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

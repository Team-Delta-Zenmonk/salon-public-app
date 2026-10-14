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
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from "./switch-cart-dialog.module.css";

interface SwitchCartDialogProps {
  open: boolean;
  currentCartItemsCount: number;
  newSalonName: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SwitchCartDialog({
  open,
  currentCartItemsCount,
  newSalonName,
  loading,
  onConfirm,
  onCancel,
}: Readonly<SwitchCartDialogProps>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog open={open} maxWidth="xs" fullWidth fullScreen={fullScreen}>
      <DialogTitle className={styles.dialogTitle}>Switch Salon Cart</DialogTitle>
      <DialogContent>
        <Box className={styles.contentBody}>
          <Typography>
            You have{" "}
            <Box component="span" className={styles.semiboldText}>
              {currentCartItemsCount} item(s)
            </Box>{" "}
            in your current cart.
          </Typography>
          <Typography variant="body2" className={styles.mutedText}>
            Adding this service will create a new cart for{" "}
            <Box component="span" className={styles.salonNameText}>
              {newSalonName}
            </Box>{" "}
            and replace your current cart.
          </Typography>
          <Divider className={styles.divider} />
          <Typography color="warning.main">
            Current cart items will be{" "}
            <Box component="span" className={styles.semiboldText}>
              deleted
            </Box>
            .
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={16} className={styles.dialogSpinner} /> : <span className={styles.arrowIcon}>➜</span>}
          {loading ? "Switching..." : "Switch & Add Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

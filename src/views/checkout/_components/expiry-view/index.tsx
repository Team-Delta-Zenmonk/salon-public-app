import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "../checkout-components.module.css";

interface ExpiryViewProps {
  onReturn: () => void;
}

export default function ExpiryView({ onReturn }: Readonly<ExpiryViewProps>) {
  return (
    <Box className={styles.expiryViewContainer}>
      <Box className={styles.warningIconBox}>
        <ErrorOutlineIcon color="error" className={styles.expiryErrorIcon} />
      </Box>
      <Typography className={styles.expiryTitle}>
        Booking Expired
      </Typography>
      <Typography className={styles.expirySub}>
        Your session has timed out and the slot has been released. Please return to the cart to re-book.
      </Typography>
      <Button
        variant="contained"
        onClick={onReturn}
        className={styles.returnBtn}
      >
        Return to Cart
      </Button>
    </Box>
  );
}

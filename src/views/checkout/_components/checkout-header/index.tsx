import { Box, Container, Stack, IconButton, Typography, Paper } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { ExpiryUrgency } from "../../../../common/booking.enums";
import styles from "../checkout-components.module.css";

interface CheckoutHeaderProps {
  onBack: () => void;
  isExpired: boolean;
  urgency: ExpiryUrgency;
  formattedTime: string;
}

export default function CheckoutHeader({ onBack, isExpired, urgency, formattedTime }: Readonly<CheckoutHeaderProps>) {
  const isCritical = urgency === ExpiryUrgency.CRITICAL;

  return (
    <Box className={styles.headerBar}>
      <Container maxWidth="lg">
        <Box className={styles.headerContent}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              onClick={onBack}
              size="small"
              className={styles.backBtn}
            >
              <ArrowBackIcon className={styles.backArrowIcon} />
            </IconButton>
            <Box>
              <Typography className={styles.titleMain}>
                Checkout
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" className={styles.secureBadgeStack}>
                <VerifiedUserIcon className={styles.verifiedIcon} />
                <Typography className={styles.secureBadgeText}>
                  Secure
                </Typography>
              </Stack>
            </Box>
          </Stack>

          {!isExpired && (
            <Paper
              elevation={0}
              className={`${styles.timerPaper} ${isCritical ? styles.timerCritical : styles.timerNormal}`}
            >
              <AccessTimeIcon className={styles.timerIconSmall} />
              <Typography className={styles.timerTextSmall}>
                {formattedTime}
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}

import { useState } from "react";
import { Box, Button, Stack, Typography, Collapse } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OrderSummary from "../order-summary";
import styles from "../checkout-components.module.css";

interface MobileSummaryBarProps {
  salon: any;
  booking: any;
  dateStr: string;
}

export default function MobileSummaryBar({ salon, booking, dateStr }: Readonly<MobileSummaryBarProps>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box className={styles.mobileBar}>
      <Button
        fullWidth
        onClick={() => setExpanded(!expanded)}
        className={styles.mobileToggleBtn}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <StorefrontIcon className={styles.mobileStorefrontIcon} />
          <Typography className={styles.mobileSummaryText}>
            {expanded ? "Hide Details" : "Show Order Summary"}
          </Typography>
          {expanded
            ? <KeyboardArrowUpIcon className={styles.mobileArrowIcon} />
            : <KeyboardArrowDownIcon className={styles.mobileArrowIcon} />
          }
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className={styles.mobileToPayLabel}>
            To Pay Now
          </Typography>
          <Typography className={styles.mobileToPayAmount}>
            ₹{booking?.deposit_amount ?? 0}
          </Typography>
        </Stack>
      </Button>

      <Collapse in={expanded}>
        <Box className={styles.mobileSummaryCollapse}>
          <OrderSummary salon={salon} booking={booking} dateStr={dateStr} />
        </Box>
      </Collapse>
    </Box>
  );
}

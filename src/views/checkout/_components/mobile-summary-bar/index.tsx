import { useState } from "react";
import { Box, Button, Typography, Collapse } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OrderSummary from "../order-summary";
import styles from "./mobile-summary-bar.module.css";

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
        <div className={styles.mobileLeftSection}>
          <StorefrontIcon className={styles.mobileStorefrontIcon} />
          <Typography component="span" className={styles.mobileSummaryText}>
            {expanded ? "Hide Details" : "Show Order Summary"}
          </Typography>
          {expanded
            ? <KeyboardArrowUpIcon className={styles.mobileArrowIcon} />
            : <KeyboardArrowDownIcon className={styles.mobileArrowIcon} />
          }
        </div>
        <div className={styles.mobileRightSection}>
          <Typography component="span" className={styles.mobileToPayLabel}>
            To Pay Now
          </Typography>
          <Typography component="span" className={styles.mobileToPayAmount}>
            ₹{booking?.deposit_amount ?? 0}
          </Typography>
        </div>
      </Button>

      <Collapse in={expanded}>
        <Box className={styles.mobileSummaryCollapse}>
          <OrderSummary salon={salon} booking={booking} dateStr={dateStr} />
        </Box>
      </Collapse>
    </Box>
  );
}

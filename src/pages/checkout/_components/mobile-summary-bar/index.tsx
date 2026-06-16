import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OrderSummary from "../order-summary";

interface MobileSummaryBarProps {
  salon: any;
  booking: any;
  dateStr: string;
}

export default function MobileSummaryBar({ salon, booking, dateStr }: Readonly<MobileSummaryBarProps>) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box className="block lg:hidden bg-[var(--app-surface)] border-b border-[var(--app-border)] relative z-40 mt-[56px]">
      <Button
        fullWidth
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between py-4 px-4 text-none text-[var(--app-text)] rounded-none"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <StorefrontIcon className="text-[18px] text-[var(--app-primary)]" />
          <Typography className="text-sm font-bold">{expanded ? "Hide Details" : "Show Order Summary"}</Typography>
          {expanded ? (
            <KeyboardArrowUpIcon className="text-[18px] text-[var(--app-muted)]" />
          ) : (
            <KeyboardArrowDownIcon className="text-[18px] text-[var(--app-muted)]" />
          )}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography className="text-[10px] font-bold text-[var(--app-muted)] uppercase mt-0.5">To Pay Now</Typography>
          <Typography className="text-sm font-black text-[var(--app-primary)]">₹{booking?.deposit_amount ?? 0}</Typography>
        </Stack>
      </Button>

      {expanded && (
        <Box className="px-4 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <OrderSummary salon={salon} booking={booking} dateStr={dateStr} />
        </Box>
      )}
    </Box>
  );
}

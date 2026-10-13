import { useState } from "react";
import { Box, Button, Stack, Typography, Collapse } from "@mui/material";
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
    <Box
      sx={{
        display: { xs: "block", lg: "none" },
        backgroundColor: "var(--bg-surface)",
        borderBottom: "1px solid var(--color-hairline)",
        position: "relative",
        zIndex: 40,
        mt: "56px",
      }}
    >
      <Button
        fullWidth
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 2,
          px: 2,
          color: "var(--color-on-surface)",
          borderRadius: 0,
          textTransform: "none",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <StorefrontIcon sx={{ fontSize: 18, color: "var(--color-primary)" }} />
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--color-on-surface)" }}>
            {expanded ? "Hide Details" : "Show Order Summary"}
          </Typography>
          {expanded
            ? <KeyboardArrowUpIcon sx={{ fontSize: 18, color: "var(--color-tertiary)" }} />
            : <KeyboardArrowDownIcon sx={{ fontSize: 18, color: "var(--color-tertiary)" }} />
          }
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: "var(--color-tertiary)", textTransform: "uppercase", mt: "2px" }}>
            To Pay Now
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", fontWeight: 900, color: "var(--color-primary)" }}>
            ₹{booking?.deposit_amount ?? 0}
          </Typography>
        </Stack>
      </Button>

      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2.5 }}>
          <OrderSummary salon={salon} booking={booking} dateStr={dateStr} />
        </Box>
      </Collapse>
    </Box>
  );
}

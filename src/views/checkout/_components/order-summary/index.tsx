import Image from "next/image";
import { Box, Paper, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTheme } from "@mui/material/styles";
import { formatTimeUTC } from "../../../../common/date.utils";

interface OrderSummaryProps {
  salon: any;
  booking: any;
  dateStr: string;
}

export default function OrderSummary({ salon, booking, dateStr }: Readonly<OrderSummaryProps>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "0.75rem",
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--color-hairline)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid var(--color-hairline)",
          backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "0.75rem",
              backgroundColor: "white",
              border: "1px solid var(--color-hairline)",
              p: 0.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {salon?.logo ? (
              <Image
                src={salon.logo}
                alt={salon?.name || "Salon Logo"}
                fill
                sizes="44px"
                style={{ objectFit: "contain", padding: "4px" }}
                unoptimized
              />
            ) : (
              <Typography sx={{ fontWeight: 700, color: "var(--color-on-surface)", fontSize: "0.75rem" }}>
                {salon?.name?.[0] || "S"}
              </Typography>
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 900,
                color: "var(--color-on-surface)",
                fontSize: { xs: "0.9rem", md: "1.05rem" },
                lineHeight: 1.3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {salon?.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "var(--color-tertiary)",
                mt: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {salon?.address}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid var(--color-hairline)" }}>
        <Stack direction="row" spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon sx={{ fontSize: "0.875rem", color: "var(--color-primary)" }} />
            <Typography sx={{ fontWeight: 700, color: "var(--color-on-surface)", fontSize: 12 }}>{dateStr}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: "0.875rem", color: "var(--color-primary)" }} />
            <Typography sx={{ fontWeight: 700, color: "var(--color-on-surface)", fontSize: 12 }}>
              {formatTimeUTC(booking.booking_start_time)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          {booking.booking_services?.map((item: any) => (
            <Box key={item?.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: "var(--color-on-surface)", fontSize: 12 }}>
                  {item.service?.name}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "var(--color-tertiary)" }}>
                  {item.duration_minutes} mins
                </Typography>
              </Box>
              <Typography sx={{ fontWeight: 900, color: "var(--color-on-surface)", fontSize: 12 }}>
                ₹{item.price}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ p: 2, backgroundColor: "var(--bg-surface-container-low)", borderTop: "1px solid var(--color-hairline)" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography sx={{ fontSize: 10, fontWeight: 800, color: "var(--color-on-surface)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Service Total
            </Typography>
            <Typography sx={{ fontSize: 9, color: "var(--color-tertiary)", fontWeight: 600 }}>Inc. all taxes</Typography>
          </Box>
          <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--color-primary)" }}>
            ₹{booking.total_price}
          </Typography>
        </Box>
        <Box sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid var(--color-hairline)" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "var(--color-tertiary)" }}>To Pay Now</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 900, color: "var(--color-on-surface)" }}>
              ₹{booking.deposit_amount ?? 0}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "var(--color-tertiary)" }}>To Pay at Venue</Typography>
            <Typography sx={{ fontSize: 14, fontWeight: 900, color: "var(--color-on-surface)" }}>
              ₹{booking.total_price - (booking.deposit_amount ?? 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

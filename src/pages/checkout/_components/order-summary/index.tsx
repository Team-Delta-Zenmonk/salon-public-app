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

export default function OrderSummary({ salon, booking, dateStr }: OrderSummaryProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      className="rounded-[18px] bg-[var(--app-surface)] border border-[var(--app-border)] overflow-hidden"
    >
      <Box className={`p-4 border-b border-[var(--app-border)] ${isDark ? "bg-white/5" : "bg-black/2"}`}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box className="w-11 h-11 rounded-[12px] bg-white border border-[var(--app-border)] p-1 flex items-center justify-center overflow-hidden">
            <img src={salon?.logo || ""} alt={salon?.name} className="max-w-full max-h-full object-contain" />
          </Box>
          <Box className="min-w-0">
            <Typography className="font-black text-[var(--app-text)] text-[0.9rem] md:text-[1.05rem] leading-tight truncate">
              {salon?.name}
            </Typography>
            <Typography className="text-[0.75rem] text-[var(--app-muted)] mt-1 truncate">{salon?.address}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box className="px-4 py-3 border-b border-[var(--app-border)] dark:border-white/5">
        <Stack direction="row" spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon className="text-sm text-[var(--app-primary)]" />
            <Typography className="font-bold text-[var(--app-text)] text-[12px]">{dateStr}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon className="text-sm text-[var(--app-primary)]" />
            <Typography className="font-bold text-[var(--app-text)] text-[12px]">
              {formatTimeUTC(booking.booking_start_time)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box className="p-4">
        <Stack spacing={1.5}>
          {booking.booking_services?.map((item: any, idx: number) => (
            <Box key={idx} className="flex justify-between items-center">
              <Box>
                <Typography className="font-bold text-[var(--app-text)] text-[12px]">{item.service?.name}</Typography>
                <Typography className="text-[10px] text-[var(--app-muted)]">{item.duration_minutes} mins</Typography>
              </Box>
              <Typography className="font-black text-[var(--app-text)] text-[12px]">₹{item.price}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box className="p-4 bg-[var(--app-primary)] text-white">
        <Box className="flex justify-between items-center">
          <Box>
            <Typography className="text-[10px] font-extrabold text-white/90 uppercase tracking-wider">
              Total Amount
            </Typography>
            <Typography className="text-[9px] text-white/70 font-semibold">Inc. all taxes</Typography>
          </Box>
          <Typography className="text-[1.25rem] font-black text-white">₹{booking.total_price}</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

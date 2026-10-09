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
      className="rounded-xl bg-(--app-surface) border border-(--app-border) overflow-hidden"
    >
      <Box className={`p-4 border-b border-(--app-border) ${isDark ? "bg-white/5" : "bg-black/2"}`}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box className="w-11 h-11 rounded-xl bg-white border border-(--app-border) p-1 flex items-center justify-center overflow-hidden relative">
            {salon?.logo ? (
              <Image
                src={salon.logo}
                alt={salon?.name || "Salon Logo"}
                fill
                sizes="44px"
                className="object-contain p-1"
                unoptimized
              />
            ) : (
              <span className="font-bold text-(--app-text) text-xs">{salon?.name?.[0] || "S"}</span>
            )}
          </Box>
          <Box className="min-w-0">
            <Typography className="font-black text-(--app-text) text-[0.9rem] md:text-[1.05rem] leading-tight truncate">
              {salon?.name}
            </Typography>
            <Typography className="text-[0.75rem] text-(--app-muted) mt-1 truncate">{salon?.address}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box className="px-4 py-3 border-b border-(--app-border) dark:border-white/5">
        <Stack direction="row" spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon className="text-sm text-(--app-primary)" />
            <Typography className="font-bold text-(--app-text) text-[12px]">{dateStr}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon className="text-sm text-(--app-primary)" />
            <Typography className="font-bold text-(--app-text) text-[12px]">
              {formatTimeUTC(booking.booking_start_time)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box className="p-4">
        <Stack spacing={1.5}>
          {booking.booking_services?.map((item: any, idx: number) => (
            <Box key={item?.id} className="flex justify-between items-center">
              <Box>
                <Typography className="font-bold text-(--app-text) text-[12px]">{item.service?.name}</Typography>
                <Typography className="text-[10px] text-(--app-muted)">{item.duration_minutes} mins</Typography>
              </Box>
              <Typography className="font-black text-(--app-text) text-[12px]">₹{item.price}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box className="p-4 bg-(--app-surface-alt) border-t border-(--app-border)">
        <Box className="flex justify-between items-center">
          <Box>
            <Typography className="text-[10px] font-extrabold text-(--app-text) uppercase tracking-wider">
              Service Total
            </Typography>
            <Typography className="text-[9px] text-(--app-muted) font-semibold">Inc. all taxes</Typography>
          </Box>
          <Typography className="text-[1.25rem] font-black text-(--app-primary)">₹{booking.total_price}</Typography>
        </Box>
        <Box className="mt-3 pt-3 border-t border-(--app-border)">
          <Box className="flex justify-between items-center mb-1.5">
             <Typography className="text-[11px] font-semibold text-(--app-muted)">To Pay Now</Typography>
             <Typography className="text-[14px] font-black text-(--app-text)">₹{booking.deposit_amount ?? 0}</Typography>
          </Box>
          <Box className="flex justify-between items-center">
             <Typography className="text-[11px] font-semibold text-(--app-muted)">To Pay at Venue</Typography>
             <Typography className="text-[14px] font-black text-(--app-text)">₹{booking.total_price - (booking.deposit_amount ?? 0)}</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

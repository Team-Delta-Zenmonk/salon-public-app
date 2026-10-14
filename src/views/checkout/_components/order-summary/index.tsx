import Image from "next/image";
import { Box, Paper, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { formatTimeUTC } from "../../../../common/date.utils";
import styles from "./order-summary.module.css";

interface OrderSummaryProps {
  salon: any;
  booking: any;
  dateStr: string;
}

export default function OrderSummary({ salon, booking, dateStr }: Readonly<OrderSummaryProps>) {
  return (
    <Paper
      elevation={0}
      className={styles.card}
    >
      <Box className={styles.header}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box className={styles.logoBox}>
            {salon?.logo ? (
              <Image
                src={salon.logo}
                alt={salon?.name || "Salon Logo"}
                fill
                sizes="44px"
                className={styles.logoImage}
                unoptimized
              />
            ) : (
              <Typography className={styles.logoInitial}>
                {salon?.name?.[0] || "S"}
              </Typography>
            )}
          </Box>
          <Box className={styles.detailsCol}>
            <Typography className={styles.salonName}>
              {salon?.name}
            </Typography>
            <Typography className={styles.salonAddress}>
              {salon?.address}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box className={styles.dateTimeBar}>
        <Stack direction="row" spacing={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CalendarMonthIcon className={styles.iconPrimary} />
            <Typography className={styles.dateVal}>{dateStr}</Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon className={styles.iconPrimary} />
            <Typography className={styles.dateVal}>
              {formatTimeUTC(booking.booking_start_time)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Box className={styles.serviceList}>
        <Stack spacing={1.5}>
          {booking.booking_services?.map((item: any) => (
            <Box key={item?.id} className={styles.serviceRow}>
              <Box>
                <Typography className={styles.serviceName}>
                  {item.service?.name}
                </Typography>
                <Typography className={styles.serviceDuration}>
                  {item.duration_minutes} mins
                </Typography>
              </Box>
              <Typography className={styles.servicePrice}>
                ₹{item.price}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box className={styles.footerSection}>
        <Box className={styles.totalRow}>
          <Box>
            <Typography className={styles.totalLabel}>
              Service Total
            </Typography>
            <Typography className={styles.totalSub}>Inc. all taxes</Typography>
          </Box>
          <Typography className={styles.totalPrice}>
            ₹{booking.total_price}
          </Typography>
        </Box>
        <Box className={styles.splitDivider}>
          <Box className={styles.splitRowBottom}>
            <Typography className={styles.splitLabel}>To Pay Now</Typography>
            <Typography className={styles.splitValue}>
              ₹{booking.deposit_amount ?? 0}
            </Typography>
          </Box>
          <Box className={styles.splitRow}>
            <Typography className={styles.splitLabel}>To Pay at Venue</Typography>
            <Typography className={styles.splitValue}>
              ₹{booking.total_price - (booking.deposit_amount ?? 0)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

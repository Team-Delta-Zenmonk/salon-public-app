import { Box, Typography, Skeleton } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { SLOT_GROUPS } from "../../../../../../common/slot.constants";
import { useAppSelector } from "../../../../../../store/hook";
import { formatTimeUTC } from "../../../../../../common/date.utils";
import styles from "./slot-grid.module.css";

interface SlotGridProps {
  slots: any[];
  selectedSlot: any;
  onSelectSlot: (slot: any) => void;
  loading: boolean;
  selectedDate: string | null;
}

const isSlotLocked = (slotStart: string, slotEnd: string, activeBooking: any): boolean => {
  const sStart = new Date(slotStart).getTime();
  const now = new Date();
  if (sStart < now.getTime()) return true;
  if (!activeBooking?.booking_start_time || !activeBooking?.booking_end_time) return false;
  const sEnd = new Date(slotEnd).getTime();
  const bStart = new Date(activeBooking.booking_start_time).getTime();
  const bEnd = new Date(activeBooking.booking_end_time).getTime();
  return sStart < bEnd && sEnd > bStart;
};

export default function SlotGrid({
  slots,
  selectedSlot,
  onSelectSlot,
  loading,
  selectedDate,
}: Readonly<SlotGridProps>) {
  const { activeBooking } = useAppSelector((s) => s.booking);

  if (!selectedDate) {
    return (
      <Box className={styles.emptyState}>
        <Typography className={styles.emptyText}>Select a date to see available slots</Typography>
      </Box>
    );
  }

  const SLOT_SKELETON_ITEMS = Array.from({ length: 9 }, (_, i) => ({
    id: crypto.randomUUID(),
    animationDelay: `${i * 0.03}s`,
  }));

  if (loading) {
    return (
      <Box className={styles.skeletonGrid}>
        {SLOT_SKELETON_ITEMS.map((item) => (
          <Skeleton
            key={item.id}
            variant="rounded"
            height={44}
            className={styles.skeletonItem}
          />
        ))}
      </Box>
    );
  }

  if (!slots.length) {
    return (
      <Box className={styles.emptyState}>
        <Typography className={styles.emptyText}>No slots available for this date</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.gridContainer}>
      {SLOT_GROUPS.map(({ key, label, icon, filter }) => {
        const group = slots.filter((s) => filter(new Date(s.start).getUTCHours()));
        if (!group.length) return null;

        return (
          <Box key={key} className={styles.groupBlock}>
            <Box className={styles.groupHeader}>
              <Typography className={styles.groupIcon}>{icon}</Typography>
              <Typography className={styles.groupLabel}>{label}</Typography>
              <Box className={styles.headerLine} />
              <Typography className={styles.emptyText}>{group.length} slots</Typography>
            </Box>

            <Box className={styles.slotGrid}>
              {group.map((slot) => {
                const isSelected = selectedSlot?.start === slot.start;
                const locked = isSlotLocked(slot.start, slot.end, activeBooking);

                return (
                  <Box
                    key={slot.start}
                    onClick={locked ? undefined : () => onSelectSlot(slot)}
                    className={`${styles.slotCard} ${locked ? styles.slotCardLocked : ""} ${isSelected ? styles.slotCardSelected : ""}`}
                  >
                    {locked ? (
                      <Box className={styles.lockedContent}>
                        <LockIcon className={styles.lockIcon} />
                        <Typography className={styles.timeTextLocked}>
                          {formatTimeUTC(slot.start)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography className={isSelected ? styles.timeTextSelected : styles.timeText}>
                        {formatTimeUTC(slot.start)}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

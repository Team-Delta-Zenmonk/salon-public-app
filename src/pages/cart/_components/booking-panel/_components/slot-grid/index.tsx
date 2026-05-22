import { Box, Typography, Skeleton } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { SLOT_GROUPS } from "../../../../../../common/slot.constants";
import { useAppSelector } from "../../../../../../store/hook";
import { formatTimeUTC } from "../../../../../../common/date.utils";

interface SlotGridProps {
  slots: any[];
  selectedSlot: any;
  onSelectSlot: (slot: any) => void;
  loading: boolean;
  selectedDate: string | null;
}

const isSlotLocked = (slotStart: string, slotEnd: string, activeBooking: any): boolean => {
  if (!activeBooking?.booking_start_time || !activeBooking?.booking_end_time) return false;

  const sStart = new Date(slotStart).getTime();
  const sEnd = new Date(slotEnd).getTime();
  const bStart = new Date(activeBooking.booking_start_time).getTime();
  const bEnd = new Date(activeBooking.booking_end_time).getTime();

  return sStart < bEnd && sEnd > bStart;
};

const getSlotStateClass = (locked: boolean, isSelected: boolean): string => {
  if (locked) {
    return "bg-(--app-surface-alt) border-(--app-border) opacity-45 cursor-not-allowed";
  }

  if (isSelected) {
    return "bg-(--app-primary) border-(--app-primary) shadow-[0_2px_8px_rgba(15,23,42,0.15)] cursor-pointer active:scale-[0.97]";
  }

  return "bg-(--app-surface-alt) border-(--app-border) hover:bg-(--app-bg) hover:border-(--app-muted) cursor-pointer active:scale-[0.97]";
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
      <Box className="px-5 py-8 text-center">
        <Typography className="text-[13px] text-(--app-muted)">Select a date to see available slots</Typography>
      </Box>
    );
  }

  const SLOT_SKELETON_ITEMS = Array.from({ length: 9 }, (_, i) => ({
    id: crypto.randomUUID(),
    animationDelay: `${i * 0.03}s`,
  }));

  if (loading) {
    return (
      <Box className="px-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SLOT_SKELETON_ITEMS.map((item) => (
          <Skeleton
            key={item.id}
            variant="rounded"
            height={44}
            className="rounded-[10px]"
            style={{ animationDelay: item.animationDelay }}
          />
        ))}
      </Box>
    );
  }

  if (!slots.length) {
    return (
      <Box className="px-5 py-8 text-center">
        <Typography className="text-[13px] text-(--app-muted)">No slots available for this date</Typography>
      </Box>
    );
  }

  return (
    <Box className="px-5 pb-4">
      {SLOT_GROUPS.map(({ key, label, icon, filter }) => {
        const group = slots.filter((s) => filter(new Date(s.start).getUTCHours()));

        if (!group.length) return null;

        return (
          <Box key={key} className="mb-6">
            <Box className="flex items-center gap-2 mb-3">
              <Typography className="text-xs">{icon}</Typography>

              <Typography className="text-[10px] font-bold text-(--app-muted) tracking-[1.5px] uppercase">
                {label}
              </Typography>

              <Box className="flex-1 h-px bg-(--app-border)" />

              <Typography className="text-[10px] text-(--app-muted)">{group.length} slots</Typography>
            </Box>

            <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {group.map((slot, idx) => {
                const isSelected = selectedSlot?.start === slot.start;
                const locked = isSlotLocked(slot.start, slot.end, activeBooking);
                const slotStateClass = getSlotStateClass(locked, isSelected);

                return (
                  <Box
                    key={slot.start}
                    onClick={locked ? undefined : () => onSelectSlot(slot)}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                    className={`py-3 px-1 rounded-[10px] text-center border-[1.5px] transition-all duration-150 animate-[slotIn_0.25s_ease_both] ${slotStateClass}`}
                  >
                    {locked ? (
                      <Box className="flex items-center justify-center gap-1.5">
                        <LockIcon sx={{ fontSize: 12, color: "var(--app-muted)" }} />
                        <Typography className="text-[12px] font-medium text-(--app-muted) line-through">
                          {formatTimeUTC(slot.start)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography
                        className={`text-[12.5px] ${
                          isSelected ? "font-bold text-(--app-primary-contrast)" : "font-medium text-(--app-text)"
                        }`}
                      >
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

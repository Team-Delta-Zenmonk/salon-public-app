import { Box, Typography, Skeleton } from "@mui/material";
import { SLOT_GROUPS } from "../../../../../../common/slot.constants";

interface SlotGridProps {
  slots: any[];
  selectedSlot: any | null;
  onSelectSlot: (slot: any) => void;
  loading: boolean;
  selectedDate: string | null;
}

const formatTime = (isoString: string) => {
  const d = new Date(isoString);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

export default function SlotGrid({ slots, selectedSlot, onSelectSlot, loading, selectedDate }: SlotGridProps) {
  if (!selectedDate) {
    return (
      <Box className="px-5 py-8 text-center">
        <Typography className="text-[13px] text-(--app-muted)">Select a date to see available slots</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box className="px-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={44}
            className="rounded-[10px]"
            style={{ animationDelay: `${i * 0.03}s` }}
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

                return (
                  <Box
                    key={slot.start}
                    onClick={() => onSelectSlot(slot)}
                    style={{ animationDelay: `${idx * 0.03}s` }}
                    className={`
                      py-3 px-1 rounded-[10px] text-center border-[1.5px]
                      cursor-pointer transition-all duration-150
                      active:scale-[0.97] animate-[slotIn_0.25s_ease_both]
                      ${
                        isSelected
                          ? "bg-(--app-primary) border-(--app-primary) shadow-[0_2px_8px_rgba(15,23,42,0.15)]"
                          : "bg-(--app-surface-alt) border-(--app-border) hover:bg-(--app-bg) hover:border-(--app-muted)"
                      }
                    `}
                  >
                    <Typography
                      className={`text-[12.5px] ${
                        isSelected ? "font-bold text-(--app-primary-contrast)" : "font-medium text-(--app-text)"
                      }`}
                    >
                      {formatTime(slot.start)}
                    </Typography>
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

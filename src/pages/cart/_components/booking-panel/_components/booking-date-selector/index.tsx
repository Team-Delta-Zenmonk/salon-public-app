import { Box, Typography, Skeleton } from "@mui/material";
import { MONTH_SHORT, WEEKDAY_SHORT } from "../../../../../../common/date.constants";

interface DateStripProps {
  days: { date: string; slots: any[] }[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  loading: boolean;
}

const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const getDateCardStateClass = (isSelected: boolean, hasSlots: boolean) => {
  if (isSelected) {
    return "bg-(--app-primary) border-(--app-primary) shadow-[0_4px_12px_rgba(15,23,42,0.2)]";
  }

  if (hasSlots) {
    return "bg-(--app-surface) border-(--app-border) hover:border-(--app-muted) hover:bg-(--app-surface-alt)";
  }

  return "bg-(--app-bg) border-(--app-border)";
};

const getDateNumberClass = (isSelected: boolean, hasSlots: boolean) => {
  if (isSelected) {
    return "text-(--app-primary-contrast)";
  }

  if (hasSlots) {
    return "text-(--app-text)";
  }

  return "text-(--app-muted)";
};

export default function BookingDateSelector({ days, selectedDate, onSelectDate, loading }: Readonly<DateStripProps>) {
  const today = new Date();
  const todayStr = toLocalDateStr(today);

  const SKELETON_ITEMS = Array.from({ length: 7 }, () => ({
    id: crypto.randomUUID(),
  }));

  const dateItems = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = toLocalDateStr(d);

    return {
      date: d,
      dateStr,
      hasSlots: days.some((day) => day.date === dateStr),
    };
  });

  return (
    <Box className="flex gap-3 overflow-x-auto pb-1 px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {loading
        ? SKELETON_ITEMS.map((item) => (
            <Skeleton
              key={item.id}
              variant="rounded"
              className="shrink-0 rounded-xl"
              style={{ minWidth: 58, height: 76 }}
            />
          ))
        : dateItems.map(({ date, dateStr, hasSlots }, idx) => {
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === todayStr;

            const dateCardStateClass = getDateCardStateClass(isSelected, hasSlots);

            const dateNumberClass = getDateNumberClass(isSelected, hasSlots);

            return (
              <Box
                key={dateStr}
                onClick={() => hasSlots && onSelectDate(dateStr)}
                style={{
                  minWidth: 58,
                  height: 76,
                  flexShrink: 0,
                  animationDelay: `${idx * 0.04}s`,
                }}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl border-[1.5px] transition-all duration-150 animate-[dateIn_0.3s_ease_both]
                  ${hasSlots ? "cursor-pointer" : "cursor-default"} ${dateCardStateClass}`}
              >
                <Typography
                  className={`text-[9.5px] font-semibold uppercase tracking-[0.5px] ${
                    isSelected ? "text-(--app-primary-contrast) opacity-70" : "text-(--app-muted)"
                  }`}
                >
                  {isToday ? "Today" : WEEKDAY_SHORT[Object.keys(WEEKDAY_SHORT)[date.getDay()]]}
                </Typography>

                <Typography className={`text-[22px] font-extrabold leading-tight ${dateNumberClass}`}>
                  {date.getDate()}
                </Typography>

                <Typography
                  className={`text-[9px] tracking-[0.3px] ${
                    isSelected ? "text-(--app-primary-contrast) opacity-60" : "text-(--app-muted)"
                  }`}
                >
                  {MONTH_SHORT[date.getMonth()]}
                </Typography>
              </Box>
            );
          })}
    </Box>
  );
}

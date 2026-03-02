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

export default function BookingDateSelector({ days, selectedDate, onSelectDate, loading }: DateStripProps) {
  const today = new Date();
  const todayStr = toLocalDateStr(today);

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
        ? Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" className="shrink-0 rounded-xl" style={{ minWidth: 58, height: 76 }} />
          ))
        : dateItems.map(({ date, dateStr, hasSlots }, idx) => {
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === todayStr;

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
                className={`
                  relative flex flex-col items-center justify-center gap-0.5
                  rounded-xl border-[1.5px] transition-all duration-150
                  animate-[dateIn_0.3s_ease_both]
                  ${hasSlots ? "cursor-pointer" : "cursor-default opacity-40"}
                  ${
                    isSelected
                      ? "bg-slate-900 border-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.2)]"
                      : hasSlots
                        ? "bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                        : "bg-slate-50 border-slate-100"
                  }
                `}
              >
                <Typography
                  className={`text-[9.5px] font-semibold uppercase tracking-[0.5px] ${
                    isSelected ? "text-white/55" : "text-slate-400"
                  }`}
                >
                  {isToday ? "Today" : WEEKDAY_SHORT[Object.keys(WEEKDAY_SHORT)[date.getDay()]]}
                </Typography>

                <Typography
                  className={`text-[22px] font-extrabold leading-tight ${
                    isSelected ? "text-white" : hasSlots ? "text-slate-900" : "text-slate-300"
                  }`}
                >
                  {date.getDate()}
                </Typography>

                <Typography
                  className={`text-[9px] tracking-[0.3px] ${isSelected ? "text-white/45" : "text-slate-400"}`}
                >
                  {MONTH_SHORT[date.getMonth()]}
                </Typography>
              </Box>
            );
          })}
    </Box>
  );
}

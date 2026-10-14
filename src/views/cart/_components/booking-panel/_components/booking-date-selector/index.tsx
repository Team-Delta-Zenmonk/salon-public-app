import { Box, Typography, Skeleton } from "@mui/material";
import { MONTH_SHORT, WEEKDAY_SHORT } from "../../../../../../common/date.constants";
import styles from "./booking-date-selector.module.css";

interface DateStripProps {
  days: { date: string; slots: any[] }[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  loading: boolean;
}

const toLocalDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

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
    <Box className={styles.stripContainer}>
      {loading
        ? SKELETON_ITEMS.map((item) => (
            <Skeleton
              key={item.id}
              variant="rounded"
              className={styles.dateCard}
            />
          ))
        : dateItems.map(({ date, dateStr, hasSlots }) => {
            const isSelected = selectedDate === dateStr;
            const isToday = dateStr === todayStr;

            return (
              <Box
                key={dateStr}
                onClick={() => hasSlots && onSelectDate(dateStr)}
                className={`${styles.dateCard} ${
                  isSelected ? styles.dateCardSelected : !hasSlots ? styles.dateCardDisabled : ""
                }`}
              >
                <Typography
                  className={`${styles.dayText} ${isSelected ? styles.dayTextSelected : ""}`}
                >
                  {isToday ? "Today" : WEEKDAY_SHORT[Object.keys(WEEKDAY_SHORT)[date.getDay()]]}
                </Typography>

                <Typography
                  className={`${styles.numberText} ${isSelected ? styles.numberTextSelected : ""}`}
                >
                  {date.getDate()}
                </Typography>

                <Typography
                  className={`${styles.monthText} ${isSelected ? styles.monthTextSelected : ""}`}
                >
                  {MONTH_SHORT[date.getMonth()]}
                </Typography>
              </Box>
            );
          })}
    </Box>
  );
}

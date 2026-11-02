import { getTodayKey } from "./date.constants";

export function isStaffInactive(staff?: { end_date?: string | null; deleted_at?: string | null } | null): boolean {
  if (!staff) return false;
  if (staff.deleted_at) return true;

  const endDate = staff.end_date;
  if (!endDate) return false;

  const todayStr = new Date().toISOString().split("T")[0];

  let endDateStr = endDate;
  if (/^\d{2}-\d{2}-\d{4}$/.test(endDate)) {
    const [d, m, y] = endDate.split("-");
    endDateStr = `${y}-${m}-${d}`;
  }

  return endDateStr <= todayStr;
}

export function isStaffAvailableToday(staff?: {
  active_hours?: Record<string, any> | null;
  working_days?: string[] | null;
  end_date?: string | null;
  deleted_at?: string | null;
} | null): boolean {
  if (!staff) return false;
  if (isStaffInactive(staff)) return false;

  const todayKey = getTodayKey();
  const dayIndex = new Date().getDay();

  const todayHours =
    staff.active_hours?.[todayKey] ??
    staff.active_hours?.[dayIndex.toString()] ??
    staff.active_hours?.[dayIndex as unknown as string];

  return Boolean(
    (todayHours && todayHours.start_time && todayHours.end_time) ||
      (Array.isArray(staff.working_days) &&
        staff.working_days.some(
          (d: string) => typeof d === "string" && d.toLowerCase() === todayKey.toLowerCase()
        ))
  );
}


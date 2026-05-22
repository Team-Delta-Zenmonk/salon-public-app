import { MONTH_SHORT } from "./date.constants";

export function formatTimeUTC(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatDateUTC(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTH_SHORT[d.getUTCMonth()]}, ${d.getUTCFullYear()}`;
}

export function formatDateShortUTC(iso: string): string {
  const d = new Date(iso);
  return `${MONTH_SHORT[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours === 0) {
    return `${mins} min`;
  }

  const minsPart = mins > 0 ? ` ${mins}m` : "";
  return `${hours}h${minsPart}`;
}

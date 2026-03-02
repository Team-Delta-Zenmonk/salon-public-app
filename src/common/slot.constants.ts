export const SLOT_GROUPS = [
  {
    key: "morning",
    label: "Morning",
    icon: "☀️",
    filter: (hour: number) => hour < 12,
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: "🌤",
    filter: (hour: number) => hour >= 12 && hour < 17,
  },
  {
    key: "evening",
    label: "Evening",
    icon: "🌙",
    filter: (hour: number) => hour >= 17,
  },
] as const;

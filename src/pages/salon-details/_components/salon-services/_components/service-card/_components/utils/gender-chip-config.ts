export type GenderChipConfig = {
  label: string;
  className: string;
};

export const getGenderChipConfig = (gender?: string): GenderChipConfig | null => {
  if (!gender) return null;

  switch (gender.toLowerCase()) {
    case "male":
      return {
        label: "Men",
        className: "bg-(--app-surface-alt) text-(--app-text) border border-(--app-border) font-semibold",
      };

    case "female":
      return {
        label: "Women",
        className: "bg-(--app-primary-soft) text-(--app-text) border border-(--app-border) font-semibold",
      };

    default:
      return {
        label: "Unisex",
        className: "bg-(--app-chip-tone) text-(--app-text) border border-(--app-border) font-semibold",
      };
  }
};

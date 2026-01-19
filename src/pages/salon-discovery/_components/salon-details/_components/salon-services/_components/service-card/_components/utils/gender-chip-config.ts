import type { Theme } from "@emotion/react";
import type { SxProps } from "@mui/material";

export type GenderChipConfig = {
  label: string;
  sx: SxProps<Theme>;
};

export const getGenderChipConfig = (gender?: string): GenderChipConfig | null => {
  if (!gender) return null;

  switch (gender.toLowerCase()) {
    case "male":
      return {
        label: "Men",
        sx: { bgcolor: "#e0f2fe", color: "#0369a1" },
      };

    case "female":
      return {
        label: "Women",
        sx: { bgcolor: "#fce7f3", color: "#9d174d" },
      };

    default:
      return {
        label: "Unisex",
        sx: { bgcolor: "#ecfeff", color: "#155e75" },
      };
  }
};

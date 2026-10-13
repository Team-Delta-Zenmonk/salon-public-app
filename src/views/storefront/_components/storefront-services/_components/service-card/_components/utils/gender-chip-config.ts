import styles from "../../storefront-service-card.module.css";

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
        className: styles.genderChipMen,
      };

    case "female":
      return {
        label: "Women",
        className: styles.genderChipWomen,
      };

    default:
      return {
        label: "Unisex",
        className: styles.genderChipUnisex,
      };
  }
};

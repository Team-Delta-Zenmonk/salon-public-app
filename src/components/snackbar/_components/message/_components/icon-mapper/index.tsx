import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { type VariantType } from "notistack";

import styles from "./icon-mapper.module.css";

interface IconMapperProps {
  variant: VariantType | undefined;
}

export const IconMapper = ({ variant }: IconMapperProps) => {
  switch (variant) {
    case "success":
      return <CheckCircleOutlinedIcon className={styles.success} />;
    case "error":
      return <RemoveCircleOutlineIcon className={styles.error} />;
    case "warning":
      return <ReportGmailerrorredOutlinedIcon className={styles.warning} />;
    case "info":
      return <InfoOutlinedIcon className={styles.info} />;
    default:
      return null;
  }
};

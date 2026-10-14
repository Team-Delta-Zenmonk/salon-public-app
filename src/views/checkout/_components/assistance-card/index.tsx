import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import styles from "../checkout-components.module.css";

interface AssistanceCardProps {
  phone?: string;
  isDesktop?: boolean;
}

export default function AssistanceCard({ phone, isDesktop = false }: Readonly<AssistanceCardProps>) {
  return (
    <Box
      className={`${styles.assistanceCard} ${
        isDesktop ? styles.assistanceDesktop : styles.assistanceMobile
      }`}
    >
      <Box className={styles.iconCircle}>
        <ErrorOutlineIcon className={styles.helpIcon} />
      </Box>
      <Box>
        <Typography className={styles.helpTitle}>
          Need help?
        </Typography>
        <Typography
          component="a"
          href={`tel:${phone || "+91 98765 43210"}`}
          className={styles.helpLink}
        >
          Contact salon: {phone || "+91 98765 43210"}
        </Typography>
      </Box>
    </Box>
  );
}

import Image from "next/image";
import { Box, Divider } from "@mui/material";
import styles from "../checkout-components.module.css";

export default function SecurityFooter() {
  return (
    <Box className={styles.securityFooter}>
      <Box className={styles.stripeLogoWrapper}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
          alt="Stripe"
          fill
          sizes="64px"
          className={styles.stripeLogo}
          unoptimized
        />
      </Box>
      <Divider orientation="vertical" flexItem className={styles.securityDivider} />
    </Box>
  );
}

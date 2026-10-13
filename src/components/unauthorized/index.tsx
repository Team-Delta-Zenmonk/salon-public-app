"use client";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import { Box, Button, Typography } from "@mui/material";
import styles from "./unauthorized.module.css";

export default function Unauthorized() {
  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.card}>
        <Box className={styles.iconWrapper}>
          <Box className={styles.iconCircle}>
            <ContentCutIcon className={styles.icon} />
          </Box>
        </Box>

        <Box className={styles.codeWrapper}>
          <Typography className={styles.codeTitle} variant="h1">
            403
          </Typography>
        </Box>
        <Typography className={styles.title}>Access Denied</Typography>
        <Box className={styles.description}>
          You don&apos;t have permission to access this page. This area is restricted to authorized users only.
        </Box>
        <Box className={styles.reasonsBox}>
          <Typography className={styles.reasonsTitle}>This might have happened because:</Typography>
          <ul className={styles.reasonsList}>
            <li>• You don&apos;t have the required permissions</li>
            <li>• Your session has expired</li>
            <li>• This feature is restricted to administrators</li>
            <li>• Your account hasn&apos;t been fully activated</li>
          </ul>
        </Box>
        <Box className={styles.actions}>
          <Button
            variant="contained"
            onClick={handleGoBack}
            className={styles.backButton}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

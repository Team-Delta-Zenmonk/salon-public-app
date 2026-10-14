"use client";
import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "./error.module.css";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <Box className={styles.errorContainer}>
      <Box className={styles.errorCard}>
        <Box className={styles.errorIconBox}>
          <ErrorOutlineIcon className={styles.errorIcon} />
        </Box>
        <Typography
          variant="h5"
          className={styles.errorTitle}
        >
          Something went wrong
        </Typography>
        <Typography className={styles.errorDesc}>
          An unexpected error occurred while processing your request. Please try refreshing the page.
        </Typography>
        <Box className={styles.actionRow}>
          <Button
            variant="contained"
            onClick={() => reset()}
            startIcon={<RefreshIcon className={styles.errorRefreshIcon} />}
            className={styles.errorRefreshBtn}
          >
            Try Again
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/";
              }
            }}
            className={styles.errorHomeBtn}
          >
            Return Home
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

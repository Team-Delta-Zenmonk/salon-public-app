import React from "react";
import { Card, CardContent, Box, Skeleton, Divider } from "@mui/material";
import styles from "./booking-skeleton.module.css";

export const BookingSkeleton: React.FC = () => {
  return (
    <Card elevation={0} className={styles.card}>
      <Box className={styles.strip} />
      <CardContent className={styles.content}>
        <Box className={styles.topRow}>
          <Box className={styles.topLeft}>
            <Skeleton variant="rounded" sx={{ width: 56, height: 56, borderRadius: "0.75rem" }} />
            <Box>
              <Skeleton variant="text" sx={{ width: 140, height: 28 }} />
              <Skeleton variant="text" sx={{ width: 200, height: 20 }} />
            </Box>
          </Box>
          <Skeleton variant="rounded" sx={{ width: 100, height: 32, borderRadius: "1rem" }} />
        </Box>

        <Divider sx={{ my: 3, borderStyle: "dashed", opacity: 0.5 }} />

        <Box className={styles.bottomRow}>
          <Box className={styles.bottomLeft}>
            <Box>
              <Skeleton variant="text" sx={{ width: 40, height: 16 }} />
              <Skeleton variant="text" sx={{ width: 100, height: 24 }} />
            </Box>
            <Box>
              <Skeleton variant="text" sx={{ width: 40, height: 16 }} />
              <Skeleton variant="text" sx={{ width: 100, height: 24 }} />
            </Box>
          </Box>
          <Box className={styles.bottomRight}>
            <Skeleton variant="rounded" sx={{ width: 120, height: 40, borderRadius: "0.75rem" }} />
            <Skeleton variant="rounded" sx={{ width: 120, height: 40, borderRadius: "0.75rem" }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

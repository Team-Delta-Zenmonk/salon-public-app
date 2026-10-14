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
            <Skeleton variant="rounded" className={styles.avatarSkeleton} />
            <Box>
              <Skeleton variant="text" className={styles.titleSkeleton} />
              <Skeleton variant="text" className={styles.subtitleSkeleton} />
            </Box>
          </Box>
          <Skeleton variant="rounded" className={styles.statusSkeleton} />
        </Box>

        <Divider className={styles.divider} />

        <Box className={styles.bottomRow}>
          <Box className={styles.bottomLeft}>
            <Box>
              <Skeleton variant="text" className={styles.metaLabelSkeleton} />
              <Skeleton variant="text" className={styles.metaValueSkeleton} />
            </Box>
            <Box>
              <Skeleton variant="text" className={styles.metaLabelSkeleton} />
              <Skeleton variant="text" className={styles.metaValueSkeleton} />
            </Box>
          </Box>
          <Box className={styles.bottomRight}>
            <Skeleton variant="rounded" className={styles.actionSkeleton} />
            <Skeleton variant="rounded" className={styles.actionSkeleton} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

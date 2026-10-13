"use client";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";

import styles from "./not-found.module.css";

export default function NotFoundPage() {
  const navigate = useStorefrontNavigate();
  const params = useParams();
  const salonSlug = params?.salonSlug as string | undefined;

  const homePath = salonSlug ? `/salons/${salonSlug}` : "/";
  const servicesPath = salonSlug ? `/salons/${salonSlug}/services` : "/services";

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(homePath);
    }
  };

  return (
    <Box className={styles.notFoundContainer}>
      <Box className={styles.notFoundCard}>
        <Box className={styles.blurCircleTop} />
        <Box className={styles.blurCircleBottom} />

        <Box className={styles.iconWrapper}>
          <Box className={styles.iconBox}>
            <SearchOffIcon style={{ fontSize: 42 }} />
          </Box>
        </Box>

        <Box>
          <Typography
            variant="h1"
            className={styles.errorCode}
          >
            404
          </Typography>
        </Box>

        <Typography
          variant="h5"
          className={styles.errorTitle}
        >
          Page Not Found
        </Typography>

        <Typography className={styles.errorDescription}>
          The page or salon service you are looking for doesn&apos;t exist, was moved, or is temporarily unavailable.
        </Typography>

        <Box className={styles.buttonGroup}>
          <Button
            variant="outlined"
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            className={styles.backBtn}
          >
            Go Back
          </Button>

          <Button
            component={Link}
            href={homePath}
            variant="contained"
            disableElevation
            startIcon={<HomeIcon />}
            className={styles.homeBtn}
          >
            Return to Storefront
          </Button>
        </Box>

        <Box className={styles.footerLinkSection}>
          <Link
            href={servicesPath}
            className={styles.serviceLink}
          >
            <ContentCutIcon style={{ fontSize: 16 }} />
            <span>Explore Salon Services</span>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

"use client";
import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LoginButton from "../../components/login/login-button";
import { useStorefront } from "../../providers/storefront-provider";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useAppThemeMode } from "@/theme/theme-provider";
import EllipsisCell from "@/components/ellipse-cell";
import clsx from "clsx";
import styles from "./signup.module.css";

export default function SignUp() {
  const { salon } = useStorefront();
  const navigate = useStorefrontNavigate();
  const { themeId } = useAppThemeMode();

  const salonName = salon?.name || "Atelier Solstice";

  const themeClass =
    themeId === "obsidianFlame"
      ? styles.themeObsidianFlame
      : themeId === "lightGothic"
      ? styles.themeLightGothic
      : styles.themeCrimsonShear;

  return (
    <Box className={clsx(styles.signupPage, themeClass)}>
      <Box className={styles.authWrapper}>
        <Box className={clsx(styles.authCard, themeClass)}>
          <Box className={styles.monogramRow}>
            <Box className={styles.monogramBadge}>
              {salon?.logo ? (
                <img src={salon.logo} alt={salonName} className={styles.monogramImg} />
              ) : (
                <SpaOutlinedIcon className={styles.monogramFallbackIcon} />
              )}
            </Box>
          </Box>

          <Box className={styles.headerTextGroup}>
            <span className={styles.tagline}>
              SALON &amp; SPA
            </span>
            <EllipsisCell
              value={salonName}
              maxChars={25}
              className={styles.salonTitle}
            />
            <Typography className={styles.narrative}>
              Sign in or create your account to book appointments and manage your bookings.
            </Typography>
          </Box>

          <Box className={styles.authActionArea}>
            <LoginButton />
          </Box>

          <Box className={styles.returnRow}>
            <button
              type="button"
              onClick={() => navigate("/")}
              className={styles.returnLink}
            >
              <ArrowBackIcon />
              <span>Return to Salon</span>
            </button>
          </Box>
        </Box>

        <Box className={styles.microFooter}>
          <Typography className={styles.microFooterText}>
            Private Suite Appointments • Modern Wellness
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

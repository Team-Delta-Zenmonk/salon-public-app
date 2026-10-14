"use client";
import { useState } from "react";
import { Box, Typography, Collapse, IconButton } from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import LoginButton from "../../components/login/login-button";
import { useStorefront } from "../../providers/storefront-provider";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./signup.module.css";

export default function SignUp() {
  const { salon } = useStorefront();
  const navigate = useStorefrontNavigate();
  const [privilegesExpanded, setPrivilegesExpanded] = useState(false);

  const salonName = salon?.name || "Atelier Solstice";

  return (
    <Box className={styles.signupPage}>
      <Box className={styles.topBar}>
        <Box className={styles.topBarLeft}>
          <Box className={styles.breadcrumbs}>
            <span className={styles.crumbGold}>CLIENT ACCOUNT</span>
            <span className={styles.crumbSlash}>/</span>
            <EllipsisCell value={salonName} maxChars={22} className={styles.crumbText} />
          </Box>
        </Box>
        <Box className={styles.protocolInfo}>
          <span className={styles.protocolBadge}>
            <span className={styles.protocolDot} />
            <span className={styles.protocolLabel}>SECURE LOGIN</span>
          </span>
          <span className={styles.dividerDot} />
          <span className={styles.tierLabel}>CLIENT ACCESS</span>
        </Box>
      </Box>

      <Box className={styles.authWrapper}>
        <Box className={styles.authCard}>
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

          <Box className={styles.dividerRow}>
            <Box className={styles.dividerLine} />
            <span className={styles.dividerTag}>AUTHENTICATION</span>
            <Box className={styles.dividerLine} />
          </Box>

          <Box className={styles.securityNote}>
            <LockOutlinedIcon className={styles.securityIcon} />
            <Typography className={styles.securityText}>
              We use Google authentication for secure, one-click access. No password required.
            </Typography>
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

        <Box className={styles.privilegesSection}>
          <Box
            onClick={() => setPrivilegesExpanded((prev) => !prev)}
            className={styles.privilegesTrigger}
          >
            <Box className={styles.privilegesTitleLeft}>
              <WorkspacePremiumOutlinedIcon className={styles.goldIcon} />
              <Typography className={styles.privilegesHeaderTitle}>
                Privileges of the Member Pass
              </Typography>
            </Box>
            <IconButton
              size="small"
              className={`${styles.chevronBtn} ${privilegesExpanded ? styles.chevronRotated : ""}`}
            >
              <ExpandMoreIcon fontSize="small" />
            </IconButton>
          </Box>

          <Collapse in={privilegesExpanded}>
            <ul className={styles.privilegeList}>
              <li className={styles.privilegeItem}>
                <Box className={styles.iconSquare}>
                  <MeetingRoomOutlinedIcon />
                </Box>
                <Box className={styles.privilegeTextCol}>
                  <Typography className={styles.itemHeading}>Private Suite Priority</Typography>
                  <Typography className={styles.itemSub}>
                    Guaranteed solitary studio booking with acoustic noise mitigation and personal stylist consultation.
                  </Typography>
                </Box>
              </li>
              <li className={styles.privilegeItem}>
                <Box className={styles.iconSquare}>
                  <LocalBarOutlinedIcon />
                </Box>
                <Box className={styles.privilegeTextCol}>
                  <Typography className={styles.itemHeading}>Botanical Sensory Bar</Typography>
                  <Typography className={styles.itemSub}>
                    Rare botanical infusions, artisan sparkling waters, or chilled vintage refreshments during sessions.
                  </Typography>
                </Box>
              </li>
              <li className={styles.privilegeItem}>
                <Box className={styles.iconSquare}>
                  <HistoryEduOutlinedIcon />
                </Box>
                <Box className={styles.privilegeTextCol}>
                  <Typography className={styles.itemHeading}>Formulations Archive</Typography>
                  <Typography className={styles.itemSub}>
                    Encrypted record of your custom hair pigment mixtures, pH treatments, and sensory preferences.
                  </Typography>
                </Box>
              </li>
            </ul>
          </Collapse>
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


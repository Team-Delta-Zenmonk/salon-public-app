"use client";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import StaffCard from "@/components/staff-card";

import styles from "./specialists.module.css";

export default function SpecialistsPage() {
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();
  const staff = salon?.staff || [];

  return (
    <Box className={styles.specialistsPage}>
      <section className={styles.headerSection}>
        <Box className={styles.headerContainer}>
          <Box className={styles.titleArea}>
            <Box>
              <span className={styles.badge}>
                <WorkspacePremiumOutlinedIcon className={styles.badgeIcon} />
                CERTIFIED ARTISANS & STYLISTS
              </span>
            </Box>
            <Typography className={styles.mainTitle}>
              Master Specialists <span className={styles.titleAccent}>& Staff Dossier</span>
            </Typography>
            <Typography className={styles.subtitle}>
              Personalized consultations tailored to your cranial geometry, hair porosity, and lifestyle profile.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/services")}
            endIcon={<ArrowForwardIcon style={{ fontSize: "16px" }} />}
            className={styles.reserveBtn}
          >
            Reserve Session with Specialist
          </Button>
        </Box>
      </section>

      <main className={styles.mainContent}>
        {staff.length === 0 ? (
          <Box className={styles.emptyState}>
            <WorkspacePremiumOutlinedIcon className={styles.emptyIcon} />
            <Typography className={styles.emptyTitle}>
              Artisans Presently Conducting Consultations
            </Typography>
            <Typography className={styles.emptySub}>
              Our resident master specialists are currently taking appointments. Explore available treatments to book your session!
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate("/services")}
              className={styles.emptyBtn}
            >
              Explore Treatment Menu
            </Button>
          </Box>
        ) : (
          <Box className={styles.staffGrid}>
            {staff.map((member: any) => (
              <StaffCard key={member.uuid || member.id} member={member} />
            ))}
          </Box>
        )}
      </main>
    </Box>
  );
}

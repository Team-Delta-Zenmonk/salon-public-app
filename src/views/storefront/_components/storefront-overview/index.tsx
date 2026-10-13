import { Box, Typography, Button, Chip } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StorefrontGallery from "../storefront-gallery";
import ServiceCard from "@/components/service-card";
import StaffCard from "@/components/staff-card";
import type { StorefrontTab } from "../storefront-header";
import styles from "./storefront-overview.module.css";

interface StorefrontOverviewProps {
  salon: any;
  onNavigateTab: (tab: StorefrontTab) => void;
}

export default function StorefrontOverview({
  salon,
  onNavigateTab,
}: Readonly<StorefrontOverviewProps>) {
  const ratingText = String(salon?.rating ?? "4.9");
  const services: any[] = salon?.services || [];
  const staff: any[] = salon?.staff || [];

  const rootServices = services.filter((s: any) => s.parent_id === null);
  const subServicesMap = services.reduce<Record<number, any[]>>((acc, s: any) => {
    if (s.parent_id) {
      acc[s.parent_id] = acc[s.parent_id] || [];
      acc[s.parent_id].push(s);
    }
    return acc;
  }, {});

  const popularServices = rootServices.slice(0, 4);

  return (
    <Box className={styles.container}>
      <Box className={styles.heroCard}>
        <Box className={styles.heroGradientBg} />
        <Box className={styles.heroDarkOverlay} />
        <Box className={styles.heroRadialOverlay} />

        <Box className={styles.heroBody}>
          <Box className={styles.heroTextCol}>
            <Box className={styles.chipsRow}>
              <Chip
                icon={<StarRoundedIcon sx={{ color: "#fbbf24", fontSize: "15px !important" }} />}
                label={`${ratingText} Rating`}
                className={styles.heroChip}
              />
              <Chip
                label={salon?.type || "Luxury Unisex Salon"}
                className={`${styles.heroChip} ${styles.heroChipCapitalize}`}
              />
              <Chip
                icon={<VerifiedOutlinedIcon sx={{ color: "#6ee7b7", fontSize: "15px !important" }} />}
                label="Verified Venue"
                className={styles.heroChip}
              />
            </Box>

            <Typography className={styles.heroTitle}>
              {salon?.name}
            </Typography>

            {salon?.about && (
              <Typography className={styles.heroAbout}>
                {salon.about}
              </Typography>
            )}

            {salon?.address && (
              <Box className={styles.heroAddressRow}>
                <LocationOnOutlinedIcon className={styles.heroAddressIcon} />
                <Typography className={styles.heroAddressText}>
                  {salon.address}
                </Typography>
              </Box>
            )}

            <Box className={styles.heroBtnRow}>
              <Button
                variant="contained"
                size="large"
                onClick={() => onNavigateTab("services")}
                endIcon={<ArrowForwardIcon sx={{ fontSize: "16px" }} />}
                className={styles.primaryHeroBtn}
              >
                Explore Services & Book
              </Button>

              {salon?.map_link && (
                <Button
                  component="a"
                  href={salon.map_link}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  size="large"
                  startIcon={<MapOutlinedIcon />}
                  className={styles.secondaryHeroBtn}
                >
                  Get Directions
                </Button>
              )}
            </Box>
          </Box>

          <Box className={styles.statsGrid}>
            <Box className={styles.statCard}>
              <Typography className={styles.statLabel}>
                Treatments
              </Typography>
              <Typography className={styles.statValue}>{services.length}+</Typography>
            </Box>

            <Box className={styles.statCard}>
              <Typography className={styles.statLabel}>
                Specialists
              </Typography>
              <Typography className={styles.statValue}>{staff.length}</Typography>
            </Box>

            <Box className={styles.statCardFull}>
              <Typography className={styles.statLabel}>
                Payment Policy
              </Typography>
              <Typography className={styles.policyText}>
                {salon?.payment_policy === "pay_at_venue"
                  ? "Pay at venue after service"
                  : salon?.payment_policy === "partial_deposit"
                  ? `${salon.deposit_percentage || 20}% deposit required`
                  : "Online payment required"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <StorefrontGallery photos={salon?.photos} logo={salon?.logo} />

      <Box className={styles.sectionCard}>
        <Box className={styles.sectionHeader}>
          <Box>
            <Box className={styles.sectionTitleGroup}>
              <SparklesIcon sx={{ color: "var(--app-primary)", fontSize: "20px" }} />
              <Typography className={styles.sectionTitle}>
                Popular Treatments
              </Typography>
            </Box>
            <Typography className={styles.sectionSubtitle}>
              Top requested haircuts, coloring, styling, and wellness rituals.
            </Typography>
          </Box>

          <Button
            variant="text"
            onClick={() => onNavigateTab("services")}
            endIcon={<ArrowForwardIcon sx={{ fontSize: "14px" }} />}
            className={styles.viewAllBtn}
          >
            View All ({services.length}) Services
          </Button>
        </Box>

        <Box className={styles.servicesGrid}>
          {popularServices.map((service: any) => (
            <ServiceCard
              key={service.uuid}
              service={service}
              subServices={subServicesMap[service.id] || []}
            />
          ))}
        </Box>
      </Box>

      {staff.length > 0 && (
        <Box className={styles.sectionCard}>
          <Box className={styles.sectionHeaderRow}>
            <Box>
              <Typography className={styles.sectionTitle}>
                Meet Our Specialists
              </Typography>
              <Typography className={styles.sectionSubtitle}>
                Experienced artisans passionate about hair, skin, and grooming.
              </Typography>
            </Box>
            <Button
              variant="text"
              onClick={() => onNavigateTab("specialists")}
              className={styles.viewAllBtn}
            >
              See All Team ➔
            </Button>
          </Box>

          <Box className={styles.staffGrid}>
            {staff.slice(0, 3).map((member: any) => (
              <StaffCard key={member.uuid || member.id} member={member} />
            ))}
          </Box>
        </Box>
      )}

      <Box className={styles.scheduleBanner}>
        <Box className={styles.scheduleInfoGroup}>
          <Box className={styles.scheduleIconBox}>
            <AccessTimeIcon sx={{ fontSize: "22px" }} />
          </Box>
          <Box>
            <Typography className={styles.scheduleTitle}>
              Operating Schedule & Policies
            </Typography>
            <Typography className={styles.scheduleSubtitle}>
              Check complete weekly hours, location directions, and booking terms.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          onClick={() => onNavigateTab("hours")}
          className={styles.scheduleBtn}
        >
          View Full Schedule & Location
        </Button>
      </Box>
    </Box>
  );
}

"use client";
import { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import InfiniteScroll from "react-infinite-scroll-component";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import { useAppDispatch } from "../../store/hook";
import { getStorefrontStaffAction } from "../../features/salon/get-storefront-staff/get-storefront-staff.action";
import StaffCard from "@/components/staff-card";

import styles from "./specialists.module.css";

export default function SpecialistsPage() {
  const dispatch = useAppDispatch();
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();

  const [staffList, setStaffList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);

  const fetchStaffData = useCallback(async (pageNum: number, isInitial: boolean = false) => {
    if (!salon?.slug) return;
    if (isInitial) setIsLoadingInitial(true);

    try {
      const res = await dispatch(
        getStorefrontStaffAction({
          slug: salon.slug,
          page: pageNum,
          limit: 10,
        })
      ).unwrap();

      const newStaff = res.staff || [];
      const total = res.pagination?.total ?? newStaff.length;
      const limit = res.pagination?.limit ?? 10;
      const totalPages = Math.ceil(total / limit);

      if (pageNum === 1) {
        setStaffList(newStaff);
        setHasMore(newStaff.length < total && pageNum < totalPages);
      } else {
        setStaffList((prev) => {
          const existingIds = new Set(prev.map((m: any) => m.uuid || m.id));
          const updated = [...prev, ...newStaff.filter((m: any) => !existingIds.has(m.uuid || m.id))];
          setHasMore(updated.length < total && pageNum < totalPages);
          return updated;
        });
      }

      setPage(pageNum);
    } catch (err: any) {
      console.error("Failed to fetch storefront staff:", err);
    } finally {
      if (isInitial) setIsLoadingInitial(false);
    }
  }, [dispatch, salon?.slug]);

  useEffect(() => {
    fetchStaffData(1, true);
  }, [fetchStaffData]);

  const loadMoreStaff = () => {
    if (!hasMore) return;
    fetchStaffData(page + 1, false);
  };

  return (
    <Box className={styles.specialistsPage}>
      <section className={styles.headerSection}>
        <Box className={styles.headerContainer}>
          <Box className={styles.titleArea}>
            <Box>
              <span className={styles.badge}>
                <WorkspacePremiumOutlinedIcon className={styles.badgeIcon} />
                CERTIFIED STYLISTS &amp; SPECIALISTS
              </span>
            </Box>
            <Typography className={styles.mainTitle}>
              Our Specialists <span className={styles.titleAccent}>&amp; Stylist Team</span>
            </Typography>
            <Typography className={styles.subtitle}>
              Personalized consultations tailored to your style preferences, hair type, and lifestyle.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/services")}
            endIcon={<ArrowForwardIcon />}
            className={styles.reserveBtn}
          >
            Book Appointment with Specialist
          </Button>
        </Box>
      </section>

      <main className={styles.mainContent}>
        {isLoadingInitial ? (
          <Box className={styles.loadingBox}>
            <CircularProgress size={36} />
          </Box>
        ) : staffList.length === 0 ? (
          <Box className={styles.emptyState}>
            <WorkspacePremiumOutlinedIcon className={styles.emptyIcon} />
            <Typography className={styles.emptyTitle}>
              Specialists Currently Available
            </Typography>
            <Typography className={styles.emptySub}>
              Our specialists are currently taking appointments. Explore available services to book your session!
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
          <InfiniteScroll
            dataLength={staffList.length}
            next={loadMoreStaff}
            hasMore={hasMore}
            loader={
              <Box className={styles.scrollLoaderBox}>
                <CircularProgress size={28} />
              </Box>
            }
            scrollThreshold={0.8}
            style={{ overflow: "visible" }}
          >
            <Box className={styles.staffGrid}>
              {staffList.map((member: any) => (
                <StaffCard key={member.uuid || member.id} member={member} />
              ))}
            </Box>
          </InfiniteScroll>
        )}
      </main>
    </Box>
  );
}

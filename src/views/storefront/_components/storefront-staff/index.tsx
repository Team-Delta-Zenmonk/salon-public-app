"use client";
import { Avatar, Box, Typography, Chip } from "@mui/material";
import clsx from "clsx";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getStaffAction } from "../../../../features/salon/staff/get-staff/get-staff.action";
import { useAppDispatch } from "../../../../store/hook";
import { isStaffAvailableToday } from "../../../../common/staff-status.utils";
import StaffModal from "./_components/staff-detail-dialog";
import styles from "./storefront-staff.module.css";
import { getOptimizedImageUrl, MEDIA_PRESETS } from "../../../../common/media.utils";

interface SalonStaffProps {
  staff: any[];
  salonId?: string;
}

export default function SalonStaff({ staff, salonId }: Readonly<SalonStaffProps>) {
  const dispatch = useAppDispatch();
  const params = useParams();
  const paramSalonId = (params?.salonSlug as string) || (params?.salonId as string);
  const effectiveSalonId = salonId || paramSalonId;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onStaffClick = async (member: any) => {
    if (!effectiveSalonId) return;
    setModalOpen(true);
    setLoading(true);
    setSelectedStaff(null);
    try {
      const data = await dispatch(getStaffAction({ staffUuid: member.uuid, salonId: effectiveSalonId })).unwrap();
      setSelectedStaff(data);
    } catch {
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setModalOpen(false);
    setSelectedStaff(null);
  };

  return (
    <>
      <Box>
        <Typography className={styles.title}>
          Meet Our Experts
        </Typography>
        <Typography className={styles.subtitle}>
          Click on a specialist to view their info and availability.
        </Typography>

        <Box className={styles.staffGrid}>
          {staff.map((member) => {
            const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
            const initials = `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`;
            const photo = member.photos?.secure_url ?? member.photos?.url ?? "";
            const optimizedPhoto = photo ? getOptimizedImageUrl(photo, MEDIA_PRESETS.AVATAR) : "";
            const specialization = member.title || member.role || "Beauty Specialist";
            const isAvailable = isStaffAvailableToday(member);

            return (
              <Box
                key={member.uuid}
                className={clsx(styles.staffCard, !isAvailable && styles.staffCardInactive)}
                onClick={() => onStaffClick(member)}
              >
                <Box className={styles.cardInner}>
                  <Box className={styles.avatarContainer}>
                    <Avatar src={optimizedPhoto} alt={fullName} className={styles.staffAvatar}>
                      {initials || "—"}
                    </Avatar>
                    <Box className={isAvailable ? styles.onlineBadge : styles.offlineBadge} />
                  </Box>

                  <Box className={styles.staffInfo}>
                    <Typography className={styles.staffName}>
                      {fullName || "Unnamed"}
                    </Typography>
                    <Typography className={styles.staffSpecialization}>
                      {specialization}
                    </Typography>
                    <Chip
                      size="small"
                      label={isAvailable ? "Available" : "Off Today"}
                      className={isAvailable ? styles.availableChip : styles.unavailableChip}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <StaffModal open={modalOpen} onClose={onClose} staff={selectedStaff} loading={loading} />
    </>
  );
}

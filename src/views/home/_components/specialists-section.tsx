"use client";
import React from "react";
import StaffCard from "@/components/staff-card";
import type { Staff } from "@/common/salon.type";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "../home.module.css";

export interface SpecialistsSectionProps {
  staff: Staff[];
  onNavigateSpecialists: () => void;
}

export default function SpecialistsSection({
  staff,
  onNavigateSpecialists,
}: SpecialistsSectionProps) {
  if (!staff || staff.length === 0) return null;

  return (
    <section className={`${styles.catalogSection} ${styles.catalogSectionBorderTop}`}>
      <div className={styles.catalogHeader}>
        <div className={styles.catalogTitleArea}>
          <div className={styles.catalogSubBadge}>
            <WorkspacePremiumOutlinedIcon />
            EXPERT STYLISTS &amp; SPECIALISTS
          </div>
          <div className={styles.catalogContentRow}>
            <h2 className={styles.catalogHeading}>Meet Our Master Specialists</h2>
            <button
              type="button"
              onClick={onNavigateSpecialists}
              className={styles.secondaryBtn}
            >
              <span>VIEW ALL SPECIALISTS</span>
              <ArrowForwardIcon className={styles.btnIcon} />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.servicesGrid}>
        {staff.slice(0, 3).map((member: any) => (
          <StaffCard key={member.uuid || member.id} member={member} />
        ))}
      </div>
    </section>
  );
}

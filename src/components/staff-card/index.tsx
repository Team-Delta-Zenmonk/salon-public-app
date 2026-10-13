"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import EllipsisCell from "../ellipse-cell";
import ScheduleTimingDialog from "./schedule-timing-dialog";
import styles from "./staff-card.module.css";

export interface StaffCardProps {
  member: any;
  className?: string;
}

export const StaffCard: React.FC<StaffCardProps> = ({ member, className }) => {
  const navigate = useStorefrontNavigate();
  const [openSchedule, setOpenSchedule] = useState(false);
  const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Master Specialist";
  const photo = member.photos?.secure_url ?? member.photos?.url;

  return (
    <article className={clsx(styles.card, className)}>
      <div className={styles.contentWrapper}>
        <div>
          <div className={styles.headerRow}>
            <Avatar
              src={photo}
              alt={fullName}
              className={styles.avatar}
            >
              {member.first_name?.[0] || "S"}
            </Avatar>

            <div className={styles.infoWrapper}>
              <div className={styles.titleRow}>
                <EllipsisCell value={member.title || member.role || "ARTISTIC DIRECTOR"} className={styles.roleTitle} maxChars={20} />
                <Tooltip title="View Weekly Working Schedule" arrow>
                  <IconButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSchedule(true);
                    }}
                    size="small"
                    aria-label="View schedule timings"
                    className={styles.scheduleIconButton}
                  >
                    <CalendarMonthRoundedIcon className={styles.calendarIcon} />
                  </IconButton>
                </Tooltip>
              </div>
              <EllipsisCell value={fullName} className={styles.nameTitle} maxChars={10} />
              {member.rating && (
                <div className={styles.ratingRow}>
                  <span>★ {member.rating}</span>
                  {member.reviews_count && <span className={styles.reviewsCount}>({member.reviews_count} reviews)</span>}
                </div>
              )}
            </div>
          </div>

          <p className={styles.bio}>
            {member.bio ||
              "Specialized in precision dry shears, organic balayage glazes, and scalp revitalization protocols trained at European academies."}
          </p>
        </div>

        <div className={styles.availabilityRow}>
          <div className={styles.availableTag}>
            <span className={`material-symbols-outlined ${styles.scheduleIcon}`}>schedule</span>
            <span>AVAILABLE TODAY</span>
          </div>
          <button
            type="button"
            onClick={() => setOpenSchedule(true)}
            className={styles.timingsBtn}
          >
            <span>Timings</span>
            <span className={`material-symbols-outlined ${styles.chevronIcon}`}>chevron_right</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/services?specialist=${encodeURIComponent(fullName)}`)}
        className={styles.reserveBtn}
      >
        <span>BOOK WITH SPECIALIST</span>
        <span className={`material-symbols-outlined ${styles.arrowIcon}`}>arrow_forward</span>
      </button>

      <ScheduleTimingDialog
        open={openSchedule}
        onClose={() => setOpenSchedule(false)}
        specialistName={fullName}
        activeHours={member.active_hours}
        workingDays={member.working_days}
      />
    </article>
  );
};

export default StaffCard;

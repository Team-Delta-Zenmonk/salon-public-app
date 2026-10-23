"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useAppThemeMode } from "@/theme/theme-provider";
import EllipsisCell from "../ellipse-cell";
import ScheduleTimingDialog from "./schedule-timing-dialog";
import styles from "./staff-card.module.css";

export interface StaffCardProps {
  member: any;
  className?: string;
  designVariant?: "editorial" | "archVault" | "floatingGlass";
}

export const StaffCard: React.FC<StaffCardProps> = ({ member, className, designVariant }) => {
  const { themeId } = useAppThemeMode();
  const navigate = useStorefrontNavigate();
  const [openSchedule, setOpenSchedule] = useState(false);
  const activeDesign: "editorial" | "archVault" | "floatingGlass" =
    designVariant ||
    (themeId === "obsidianFlame"
      ? "archVault"
      : themeId === "lightGothic"
      ? "floatingGlass"
      : "editorial");
  const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Master Specialist";
  const photo = member.photos?.secure_url ?? member.photos?.url;

  const titleText = member.title || member.role || "Specialist";
  const genderText = member.gender ? `${member.gender.charAt(0).toUpperCase() + member.gender.slice(1).toLowerCase()} Specialist` : "";

  const renderStaffBadges = () => (
    <div className={styles.staffTagsWrapper}>
      {titleText && (
        <span className={styles.staffTag}>
          <EllipsisCell value={titleText} maxChars={22} />
        </span>
      )}
      {genderText && (
        <span className={clsx(styles.staffTag, styles.staffTagGender)}>
          {genderText}
        </span>
      )}
    </div>
  );

  const designClass =
    activeDesign === "archVault"
      ? styles.archVaultCard
      : activeDesign === "floatingGlass"
      ? styles.floatingGlassCard
      : styles.editorialCard;

  const themeClass =
    themeId === "obsidianFlame"
      ? styles.themeObsidianFlame
      : themeId === "lightGothic"
      ? styles.themeLightGothic
      : styles.themeCrimsonShear;

  return (
    <article className={clsx(styles.card, themeClass, designClass, className)}>
      <div className={styles.contentWrapper}>
        {activeDesign === "archVault" ? (
          <div className={styles.archVaultStaffWrapper}>
            <div className={styles.archVaultAvatarContainer}>
              <Avatar
                src={photo}
                alt={fullName}
                className={styles.avatar}
              >
                {member.first_name?.[0] || "S"}
              </Avatar>
              <Tooltip title="View Weekly Working Schedule" arrow>
                <IconButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSchedule(true);
                  }}
                  size="small"
                  aria-label="View schedule timings"
                  className={styles.archVaultScheduleBtn}
                >
                  <CalendarMonthRoundedIcon className={styles.calendarIcon} />
                </IconButton>
              </Tooltip>
            </div>

            <div className={styles.archVaultDetails}>
              <EllipsisCell value={fullName} className={styles.nameTitle} maxChars={16} />
              {member.rating && (
                <div className={styles.ratingRow}>
                  <span>★ {member.rating}</span>
                  {member.reviews_count && <span className={styles.reviewsCount}>({member.reviews_count} reviews)</span>}
                </div>
              )}
            </div>

            {renderStaffBadges()}

            <div className={styles.availabilityRow}>
              <div className={styles.availableTag}>
                <AccessTimeIcon className={styles.scheduleIcon} />
                <span>AVAILABLE TODAY</span>
              </div>
              <button
                type="button"
                onClick={() => setOpenSchedule(true)}
                className={styles.timingsBtn}
              >
                <span>Timings</span>
                <ChevronRightIcon className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        ) : activeDesign === "floatingGlass" ? (
          <div className={styles.glassCoverCardWrapper}>
            <div className={styles.glassCoverPhotoContainer}>
              {photo ? (
                <img
                  src={photo}
                  alt={fullName}
                  className={styles.glassCoverImg}
                />
              ) : (
                <div className={styles.glassFallbackAvatar}>
                  <span>{member.first_name?.[0] || "S"}</span>
                </div>
              )}
              <div className={styles.glassCoverOverlay} />

              <div className={styles.glassCoverTopBar}>
                <span className={styles.glassCoverTag}>FEATURED SPECIALIST</span>
                <Tooltip title="View Schedule" arrow>
                  <IconButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSchedule(true);
                    }}
                    size="small"
                    className={styles.glassCoverScheduleBtn}
                  >
                    <CalendarMonthRoundedIcon className={styles.calendarIcon} />
                  </IconButton>
                </Tooltip>
              </div>

              <div className={styles.glassCoverBottomInfo}>
                <h3 className={styles.glassCoverName}>{fullName}</h3>
                {member.rating && (
                  <div className={styles.glassCoverRating}>
                    <span>★ {member.rating}</span>
                    {member.reviews_count && <span>({member.reviews_count})</span>}
                  </div>
                )}
              </div>
            </div>

            {renderStaffBadges()}

            <div className={styles.availabilityRow}>
              <div className={styles.availableTag}>
                <AccessTimeIcon className={styles.scheduleIcon} />
                <span>AVAILABLE TODAY</span>
              </div>
              <button
                type="button"
                onClick={() => setOpenSchedule(true)}
                className={styles.timingsBtn}
              >
                <span>Timings</span>
                <ChevronRightIcon className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.editorialStaffWrapper}>
            <div className={styles.editorialStaffHeader}>
              <div className={styles.editorialRoleBadge}>
                <span className={styles.editorialMonogramDot}>✦</span>
                <EllipsisCell value={titleText} className={styles.roleTitle} maxChars={22} />
              </div>
              <Tooltip title="View Weekly Working Schedule" arrow>
                <IconButton
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSchedule(true);
                  }}
                  size="small"
                  aria-label="View schedule timings"
                  className={styles.editorialScheduleBtn}
                >
                  <CalendarMonthRoundedIcon className={styles.calendarIcon} />
                </IconButton>
              </Tooltip>
            </div>

            <div className={styles.editorialStaffBody}>
              <div className={styles.editorialPortraitFrame}>
                {photo ? (
                  <img
                    src={photo}
                    alt={fullName}
                    className={styles.editorialPortraitImg}
                  />
                ) : (
                  <div className={styles.editorialFallbackLetter}>
                    {member.first_name?.[0] || "S"}
                  </div>
                )}
              </div>

              <div className={styles.editorialStaffMeta}>
                <EllipsisCell value={fullName} className={styles.editorialStaffName} maxChars={16} />
                {member.rating && (
                  <div className={styles.editorialRatingRow}>
                    <span className={styles.editorialStar}>★ {member.rating}</span>
                    {member.reviews_count && <span className={styles.reviewsCount}>({member.reviews_count} reviews)</span>}
                  </div>
                )}
                {renderStaffBadges()}
              </div>
            </div>

            <div className={styles.editorialAvailabilityRow}>
              <div className={styles.editorialAvailableBadge}>
                <span className={styles.editorialPulseDot} />
                <span>AVAILABLE TODAY</span>
              </div>
              <button
                type="button"
                onClick={() => setOpenSchedule(true)}
                className={styles.timingsBtn}
              >
                <span>Timings</span>
                <ChevronRightIcon className={styles.chevronIcon} />
              </button>
            </div>
          </div>
        )}
      </div>

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

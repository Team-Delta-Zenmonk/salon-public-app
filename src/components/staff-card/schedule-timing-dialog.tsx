"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import {
  WEEKDAY_KEYS,
  WEEKDAY_FULL,
  getTodayKey,
} from "../../common/date.constants";
import EllipsisCell from "../ellipse-cell";

export interface ScheduleTimingDialogProps {
  open: boolean;
  onClose: () => void;
  specialistName: string;
  activeHours?: Record<string, { start_time: string; end_time: string } | null> | null;
  workingDays?: string[];
}

const formatTime = (time?: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  let hour = Number.parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

import styles from "./schedule-timing-dialog.module.css";

export const ScheduleTimingDialog: React.FC<ScheduleTimingDialogProps> = ({
  open,
  onClose,
  specialistName,
  activeHours,
  workingDays,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const todayKey = getTodayKey();

  const dayNameMap: Record<string, string> = {
    sunday: "Sunday",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="xs"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
        backdrop: { className: styles.backdrop },
      }}
    >
      <DialogTitle className={styles.dialogTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.iconCircle}>
            <AccessTimeIcon className={styles.timeIcon} />
          </div>
          <div>
            <Typography className={styles.titleHeading}>
              Weekly Working Schedule
            </Typography>
            <EllipsisCell value={specialistName} maxChars={15} className={styles.specialistName} />
          </div>
        </div>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
          className={styles.closeButton}
        >
          <CloseIcon className={styles.closeIcon} />
        </IconButton>
      </DialogTitle>

      <DialogContent className={styles.dialogContent}>
        <div className={styles.sectionSubtitle}>
          Working Hours & Weekly Availability
        </div>

        <div className={styles.daysList}>
          {WEEKDAY_KEYS.map((dayKey, index) => {
            const dayLabel = dayNameMap[dayKey] || dayKey;
            const hours =
              activeHours?.[dayKey] ??
              activeHours?.[index.toString()] ??
              activeHours?.[index as unknown as string];

            const isWorking = Boolean(
              (hours && hours.start_time && hours.end_time) ||
                (workingDays &&
                  workingDays.some(
                    (d) => d.toLowerCase() === dayKey.toLowerCase()
                  ))
            );

            const isToday = dayKey === todayKey;

            return (
              <div
                key={dayKey}
                className={`${styles.dayRow} ${
                  !isWorking
                    ? styles.dayRowNotWorking
                    : isToday
                    ? styles.dayRowToday
                    : styles.dayRowWorking
                }`}
              >
                <div className={styles.dayLeft}>
                  <span
                    className={`${styles.statusDot} ${
                      !isWorking
                        ? styles.dotNotWorking
                        : isToday
                        ? styles.dotToday
                        : styles.dotWorking
                    }`}
                  />
                  <div>
                    <span
                      className={
                        !isWorking
                          ? styles.dayNameNotWorking
                          : isToday
                          ? styles.dayNameToday
                          : styles.dayNameWorking
                      }
                    >
                      {dayLabel}
                    </span>
                    {isToday && (
                      <span className={styles.todayTag}>
                        Today
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.dayRight}>
                  {isWorking ? (
                    <>
                      <CheckCircleOutlineRoundedIcon className={styles.checkIcon} />
                      <span className={styles.timeText}>
                        {hours?.start_time && hours?.end_time
                          ? `${formatTime(hours.start_time)} – ${formatTime(
                              hours.end_time
                            )}`
                          : "Available"}
                      </span>
                    </>
                  ) : (
                    <>
                      <EventBusyOutlinedIcon className={styles.busyIcon} />
                      <span className={styles.notWorkingText}>
                        Not Working
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleTimingDialog;

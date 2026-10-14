import { Avatar, Box, Typography, Skeleton, Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { getTodayKey, WEEKDAY_KEYS, WEEKDAY_SHORT } from "../../../../../../common/date.constants";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from "./staff-detail-dialog.module.css";

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  staff: any;
  loading: boolean;
}

const today = getTodayKey();

const formatTime = (time?: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  let hour = Number.parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

export default function StaffModal({ open, onClose, staff, loading }: Readonly<StaffModalProps>) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const fullName = `${staff?.first_name ?? ""} ${staff?.last_name ?? ""}`.trim();

  const photo = staff?.photos?.secure_url ?? staff?.photos?.url;
  const initials = `${staff?.first_name?.[0] ?? ""}${staff?.last_name?.[0] ?? ""}`;

  const activeHours = staff?.active_hours ?? {};
  const todayHours = activeHours[today];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
        backdrop: { className: styles.backdrop },
      }}
    >
      <Box className={styles.headerBanner}>
        <Box className={styles.headerGlow1} />
        <Box className={styles.headerGlow2} />

        <Box
          onClick={onClose}
          className={styles.closeButton}
        >
          <CloseIcon className={styles.closeIcon} />
        </Box>

        <Box className={styles.headerContent}>
          <Avatar
            src={photo}
            className={styles.avatar}
          >
            {initials || "?"}
          </Avatar>

          <Typography className={styles.headerTitle}>{fullName || "Staff Member"}</Typography>

          {staff?.title && <Typography className={styles.headerSubtitle}>{staff.title}</Typography>}
        </Box>
      </Box>

      <DialogContent className={styles.dialogContent}>
        <Box className={styles.contentWrapper}>
          {loading ? (
            <>
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={200} />
            </>
          ) : (
            <>
              {todayHours ? (
                <Box className={`${styles.availabilityBox} ${styles.availableToday}`}>
                  <Box className={`${styles.statusDot} ${styles.dotAvailable}`} />
                  <Box className={styles.availabilityInfo}>
                    <Typography className={`${styles.availabilityBadge} ${styles.badgeTextAvailable}`}>
                      Available Today
                    </Typography>
                    <Typography className={styles.availabilityTime}>
                      {formatTime(todayHours.start_time)} – {formatTime(todayHours.end_time)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box className={`${styles.availabilityBox} ${styles.notAvailableToday}`}>
                  <Box className={`${styles.statusDot} ${styles.dotUnavailable}`} />
                  <Box className={styles.availabilityInfo}>
                    <Typography className={`${styles.availabilityBadge} ${styles.badgeTextUnavailable}`}>
                      Not Available Today
                    </Typography>
                    <Typography className={styles.availabilityOff}>
                      Staff member is off-duty today
                    </Typography>
                  </Box>
                </Box>
              )}

              {(staff?.phone_number || staff?.email) && (
                <Box>
                  <Typography className={styles.sectionTitle}>
                    Contact
                  </Typography>

                  <Box className={styles.contactList}>
                    {staff?.phone_number && (
                       <Box className={styles.contactCard}>
                        <PhoneIcon fontSize="small" />
                        <Typography>{staff.phone_number}</Typography>
                      </Box>
                    )}

                    {staff?.email && (
                      <Box className={styles.contactCard}>
                        <EmailIcon fontSize="small" />
                        <Typography className={styles.emailText}>{staff.email}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography className={styles.scheduleSectionTitle}>
                  Weekly Schedule
                </Typography>

                <Box className={styles.scheduleCard}>
                  {WEEKDAY_KEYS.map((day) => {
                    const hours = activeHours[day];
                    const isToday = day === today;

                    return (
                      <Box
                        key={day}
                        className={`${styles.scheduleRow} ${isToday ? styles.scheduleRowToday : ""}`}
                      >
                        <Typography className={styles.scheduleDayName}>
                          {WEEKDAY_SHORT[day]}
                          {isToday && (
                            <Box component="span" className={styles.todayTag}>
                              today
                            </Box>
                          )}
                        </Typography>

                        <Typography className={styles.scheduleDayHours}>
                          {hours ? `${formatTime(hours.start_time)} – ${formatTime(hours.end_time)}` : "Day off"}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

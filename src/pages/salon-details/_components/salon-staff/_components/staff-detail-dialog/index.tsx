import { Avatar, Box, Typography, Skeleton, Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { getTodayKey, WEEKDAY_KEYS, WEEKDAY_SHORT } from "../../../../../../common/date.constants";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  staff: any | null;
  loading: boolean;
}

const today = getTodayKey();

const formatTime = (time?: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

export default function StaffModal({ open, onClose, staff, loading }: StaffModalProps) {
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
          className:
            "rounded-3xl overflow-hidden border border-(--app-border) bg-(--app-surface) flex flex-col max-h-[90vh] sm:max-h-[85vh]",
        },
        backdrop: { className: "backdrop-blur-sm bg-black/35" },
      }}
    >
      <Box className="relative shrink-0 px-4 pt-5 pb-4 overflow-hidden bg-[linear-gradient(150deg,var(--app-hero-from)_0%,var(--app-hero-to)_100%)]">
        <Box className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_25%_20%,#fff_0%,transparent_45%)]" />
        <Box className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_80%_70%,#fff_0%,transparent_40%)]" />

        <Box
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/25 transition z-10"
        >
          <CloseIcon className="text-white text-[18px]" />
        </Box>

        <Box className="flex flex-col items-center text-center">
          <Avatar
            src={photo}
            className="w-20 h-20 text-[26px] bg-black/20 text-white border-[3px] border-white/30 ring-2 ring-white/20"
          >
            {initials || "?"}
          </Avatar>

          <Typography className="text-white font-extrabold text-[18px] mt-3">{fullName || "Staff Member"}</Typography>

          {staff?.title && <Typography className="text-white/60 text-sm mt-1">{staff.title}</Typography>}
        </Box>
      </Box>

      <DialogContent className="p-0 overflow-y-auto flex-1 min-h-0 [scrollbar-width:thin]">
        <Box className="px-5 sm:px-8 py-6 sm:py-7 space-y-6">
          {loading ? (
            <>
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={200} />
            </>
          ) : (
            <>
              {todayHours ? (
                <Box className="flex items-center gap-3.5 p-4 rounded-2xl border border-emerald-500/24 bg-emerald-500/8">
                  <Box className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <Box className="min-w-0">
                    <Typography className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Available Today
                    </Typography>
                    <Typography className="text-sm font-semibold text-(--app-text) mt-0.5">
                      {formatTime(todayHours.start_time)} – {formatTime(todayHours.end_time)}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box className="flex items-center gap-3.5 p-4 rounded-2xl border border-rose-500/20 bg-rose-500/6">
                  <Box className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                  <Box className="min-w-0">
                    <Typography className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-500">
                      Not Available Today
                    </Typography>
                    <Typography className="text-sm font-semibold text-(--app-muted) mt-0.5">
                      Staff member is off-duty today
                    </Typography>
                  </Box>
                </Box>
              )}

              {(staff?.phone_number || staff?.email) && (
                <Box>
                  <Typography className="text-xs font-bold text-(--app-muted) uppercase tracking-wide mb-3">
                    Contact
                  </Typography>

                  <Box className="space-y-3">
                    {staff?.phone_number && (
                      <Box className="flex items-center gap-4 bg-(--app-surface-alt) p-4 rounded-2xl border border-(--app-border)">
                        <PhoneIcon fontSize="small" />
                        <Typography>{staff.phone_number}</Typography>
                      </Box>
                    )}

                    {staff?.email && (
                      <Box className="flex items-center gap-4 bg-(--app-surface-alt) p-4 rounded-2xl border border-(--app-border)">
                        <EmailIcon fontSize="small" />
                        <Typography className="truncate">{staff.email}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography className="text-sm font-semibold text-(--app-muted) uppercase tracking-wide mb-4">
                  Weekly Schedule
                </Typography>

                <Box className="bg-(--app-surface-alt) rounded-2xl overflow-hidden border border-(--app-border)">
                  {WEEKDAY_KEYS.map((day) => {
                    const hours = activeHours[day];
                    const isToday = day === today;

                    return (
                      <Box
                        key={day}
                        className={`flex justify-between items-center px-4 sm:px-5 py-3 ${
                          isToday ? "bg-(--app-primary) text-white" : ""
                        }`}
                      >
                        <Typography className="font-medium">
                          {WEEKDAY_SHORT[day]}
                          {isToday && (
                            <Box component="span" className="ml-2 text-xs opacity-60">
                              today
                            </Box>
                          )}
                        </Typography>

                        <Typography className="font-medium">
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

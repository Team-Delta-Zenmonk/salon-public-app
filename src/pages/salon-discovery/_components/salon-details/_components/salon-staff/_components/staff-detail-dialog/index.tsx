import { Avatar, Box, Typography, Skeleton, Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { getTodayKey, WEEKDAY_KEYS, WEEKDAY_SHORT } from "../../../../../../../../common/date.constants";

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
      maxWidth="sm"
      slotProps={{
        paper: { className: "rounded-3xl overflow-hidden" },
        backdrop: {
          sx: {
            backdropFilter: "blur(6px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          },
        },
      }}
    >
      <DialogContent className="p-0">
        <Box className="relative shrink-0 px-4 pt-4 pb-3 overflow-hidden bg-[linear-gradient(160deg,#0f172a_0%,#1e3a5f_55%,#0f172a_100%)]">
          <Box
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center cursor-pointer hover:bg-white/25 transition"
          >
            <CloseIcon className="text-white text-[18px]" />
          </Box>

          <Box className="flex flex-col items-center text-center">
            <Avatar src={photo} className="w-20 h-20 text-[26px] bg-slate-800 text-white border-[3px] border-white/20">
              {initials || "?"}
            </Avatar>

            <Typography className="text-white font-extrabold text-[18px] mt-3">{fullName || "Staff Member"}</Typography>

            {staff?.title && <Typography className="text-white/60 text-sm mt-1">{staff.title}</Typography>}

            <Box
              className={`mt-3 px-3 py-1.5 rounded-lg border text-xs font-semibold
                ${
                  todayHours
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200"
                    : "bg-white/10 border-white/20 text-white/50"
                }`}
            >
              {todayHours
                ? `Available Today · ${formatTime(todayHours.start_time)} – ${formatTime(todayHours.end_time)}`
                : "Not available today"}
            </Box>
          </Box>
        </Box>

        <Box className="px-8 py-8 space-y-8">
          {loading ? (
            <>
              <Skeleton height={60} />
              <Skeleton height={60} />
              <Skeleton height={200} />
            </>
          ) : (
            <>
              {(staff?.phone_number || staff?.email) && (
                <Box>
                  <Typography className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                    Contact
                  </Typography>

                  <Box className="space-y-3">
                    {staff?.phone_number && (
                      <Box className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                        <PhoneIcon fontSize="small" />
                        <Typography>{staff.phone_number}</Typography>
                      </Box>
                    )}

                    {staff?.email && (
                      <Box className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                        <EmailIcon fontSize="small" />
                        <Typography className="truncate">{staff.email}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}

              <Box>
                <Typography className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                  Weekly Schedule
                </Typography>

                <Box className="bg-slate-50 rounded-2xl overflow-hidden">
                  {WEEKDAY_KEYS.map((day) => {
                    const hours = activeHours[day];
                    const isToday = day === today;

                    return (
                      <Box
                        key={day}
                        className={`flex justify-between items-center px-5 py-3 ${
                          isToday ? "bg-slate-900 text-white" : ""
                        }`}
                      >
                        <Typography className="font-medium">
                          {WEEKDAY_SHORT[day]}
                          {isToday && <span className="ml-2 text-xs opacity-60">today</span>}
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

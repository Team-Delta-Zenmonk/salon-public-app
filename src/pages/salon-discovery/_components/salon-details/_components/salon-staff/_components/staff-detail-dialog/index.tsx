import { Avatar, Box, Typography, Skeleton, Dialog, DialogContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

interface StaffModalProps {
  open: boolean;
  onClose: () => void;
  staff: any | null;
  loading: boolean;
}

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const DAY_SHORT: Record<string, string> = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};

const today = DAYS[new Date().getDay()];

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
        backdrop: { sx: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.3)" } },
      }}
    >
      <DialogContent className="p-0">
        <Box className=" relative shrink-0 px-3 sm:px-4 pt-3.5 sm:pt-4 pb-2.5 sm:pb-3 overflow-hidden bg-[linear-gradient(160deg,#0f172a_0%,#1e3a5f_55%,#0f172a_100%)] ">
          <Box className="absolute -top-12.5 -right-12.5 w-45 h-45 rounded-full bg-white/5" />
          <Box className="absolute -bottom-7.5 -left-7.5 w-35 h-35 rounded-full bg-white/5" />
          <Box className="absolute top-[30%] left-[40%] w-25 h-25 rounded-full bg-sky-300/10" />

          <Box
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 flex items-center justify-center cursor-pointer z-10 hover:bg-white/25 transition-colors duration-200"
          >
            <CloseIcon className="text-white text-[16px] sm:text-[18px]" />
          </Box>

          <Box className="relative z-1 flex flex-col items-center text-center">
            <Box className="relative mb-2 sm:mb-2.5">
              <Box className="p-0.75 rounded-full bg-[linear-gradient(135deg,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.1)_100%)]">
                <Avatar
                  src={photo}
                  className="w-17 h-17 sm:w-20 sm:h-20 text-[22px] sm:text-[26px] bg-slate-800 text-white border-[3px] border-white/20"
                >
                  {initials || "?"}
                </Avatar>
              </Box>

              {todayHours && (
                <Box className="absolute bottom-1 right-1 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-500  border-[2.5px] border-slate-900 " />
              )}
            </Box>

            <Typography className="text-white font-extrabold text-[16px] sm:text-[18px] leading-tight">
              {fullName || "Staff Member"}
            </Typography>

            {staff?.title && (
              <Typography className="text-white/45 text-[12px] sm:text-[14px] mt-1">{staff.title}</Typography>
            )}

            <Box
              className={`mt-1.5 sm:mt-2nline-flex items-center gap-1.5 px-2 py-1.5 rounded-[10px] border
                 ${todayHours ? "bg-emerald-500/15 border-emerald-500/40" : "bg-white/5 border-white/10"}`}
            >
              <Typography
                className={`text-[11px] sm:text-[12px] font-bold ${todayHours ? "text-emerald-200" : "text-white/40"}`}
              >
                {todayHours
                  ? `Available · ${formatTime(todayHours.start_time)} – ${formatTime(todayHours.end_time)}`
                  : "Not available today"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className="px-6 sm:px-8 py-8 space-y-8">
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
                  {DAYS.map((day) => {
                    const hours = activeHours[day];
                    const isToday = day === today;

                    return (
                      <Box
                        key={day}
                        className={`
                          flex justify-between items-center
                          px-5 py-3
                          ${isToday ? "bg-slate-900 text-white" : ""}
                        `}
                      >
                        <Typography className="font-medium">
                          {DAY_SHORT[day]}
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

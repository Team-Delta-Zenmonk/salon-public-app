import { Avatar, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getStaffAction } from "../../../../../../features/salon/staff/get-staff/get-staff.action";
import { useAppDispatch } from "../../../../../../store/hook";
import StaffModal from "./_components/staff-detail-dialog";

interface SalonStaffProps {
  staff: any[];
}

export default function SalonStaff({ staff }: SalonStaffProps) {
  const dispatch = useAppDispatch();
  const { salonId } = useParams<{ salonId: string }>();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onStaffClick = async (member: any) => {
    if (!salonId) return;
    setModalOpen(true);
    setLoading(true);
    setSelectedStaff(null);
    try {
      const data = await dispatch(getStaffAction({ staffUuid: member.uuid, salonId })).unwrap();
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
        <Typography className="text-[18px] sm:text-[22px] font-bold mb-6 tracking-[-0.02em] text-slate-900">
          Meet Our Experts
        </Typography>

        <Box className="flex flex-wrap gap-10 lg:gap-24 xl:gap-24 md:gap-24">
          {staff.map((member) => {
            const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
            const initials = `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`;
            const photo = member.photos?.secure_url ?? member.photos?.url ?? "";

            return (
              <Box
                key={member.uuid}
                className="group relative cursor-pointer select-none"
                onClick={() => onStaffClick(member)}
                style={{ width: "fit-content" }}
              >
                <Box
                  className="relative rounded-full p-0.5 transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #94a3b8, #cbd5e1, #64748b, #e2e8f0)",
                    zIndex: 1,
                  }}
                >
                  <Box className="rounded-full p-0.5 bg-white">
                    <Box className="relative rounded-full overflow-hidden w-16 h-16 sm:w-20 sm:h-20">
                      <Avatar
                        className="w-full h-full text-[22px] sm:text-[28px] bg-slate-100 text-slate-700 transition-transform duration-500 group-hover:scale-110"
                        src={photo}
                        alt={fullName}
                        style={{ width: "100%", height: "100%" }}
                      >
                        {initials || "—"}
                      </Avatar>

                      <Box
                        className="absolute inset-0 flex flex-col items-center justify-end pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                          opacity: 1,
                        }}
                      >
                        <Typography
                          className="text-white font-semibold truncate w-full text-center px-1 pb-1"
                          style={{ fontSize: "9px", letterSpacing: "0.04em" }}
                        >
                          {fullName || "Unnamed"}
                        </Typography>
                      </Box>

                      <Box
                        className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(1px)" }}
                      >
                        <Typography
                          className="text-white font-black uppercase tracking-widest"
                          style={{ fontSize: "7px", letterSpacing: "0.18em" }}
                        >
                          View
                        </Typography>
                        <Typography
                          className="text-white font-black uppercase tracking-widest"
                          style={{ fontSize: "7px", letterSpacing: "0.18em" }}
                        >
                          Profile
                        </Typography>
                      </Box>
                    </Box>
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

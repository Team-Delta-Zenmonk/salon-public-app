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
        <Typography className={`text-[18px] sm:text-[22px] font-bold mb-4 sm:mb-6 tracking-[-0.02em]  text-slate-900`}>
          Meet Our Experts
        </Typography>

        <Box className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8`}>
          {staff.map((member) => {
            const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
            const initials = `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`;
            const photo = member.photos?.secure_url ?? member.photos?.url ?? "";

            return (
              <Box
                key={member.uuid}
                onClick={() => onStaffClick(member)}
                className={`group flex flex-col items-center text-center cursor-pointer select-none`}
              >
                <Box
                  className={`relative p-0.75 rounded-full bg-slate-200 transition-[background] duration-300 group-hover:bg-[linear-gradient(135deg,#0f172a,#475569)]`}
                >
                  <Box className="p-0.75 rounded-full bg-white">
                    <Avatar
                      className={`w-16 h-16 sm:w-20 sm:h-20 text-[22px] sm:text-[28px] bg-slate-100 text-slate-900 transition-transform duration-300 group-hover:scale-105`}
                      src={photo}
                      alt={fullName}
                    >
                      {initials || "—"}
                    </Avatar>
                  </Box>

                  <Box
                    className={`absolute inset-0 rounded-full bg-black/25 opacity-0 transition-opacity duration-300 flex items-center justify-center group-hover:opacity-100`}
                  >
                    <Typography
                      className={`text-white text-[8px] sm:text-[9px] font-black tracking-[0.15em] uppercase`}
                    >
                      View
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  className={`mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] font-semibold text-slate-900 max-w-22.5 sm:max-w-27.5 overflow-hidden text-ellipsis whitespace-nowrap`}
                >
                  {fullName || "Unnamed"}
                </Typography>

                {member.title && (
                  <Typography
                    className={`text-[11px] sm:text-[12px]text-slate-400 mt-0.5 max-w-22.5 sm:max-w-27.5 overflow-hidden text-ellipsis whitespace-nowrap`}
                  >
                    {member.title}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      <StaffModal open={modalOpen} onClose={onClose} staff={selectedStaff} loading={loading} />
    </>
  );
}

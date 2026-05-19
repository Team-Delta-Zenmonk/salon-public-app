import { Avatar, Box, Typography, Chip } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getStaffAction } from "../../../../features/salon/staff/get-staff/get-staff.action";
import { useAppDispatch } from "../../../../store/hook";
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
        <Typography className="text-base sm:text-lg font-bold mb-1 tracking-[-0.015em] text-(--app-text)">
          Meet Our Experts
        </Typography>
        <Typography className="text-[0.76rem] sm:text-xs text-(--app-muted) mb-4">
          Click on a specialist to view their info and availability.
        </Typography>

        <Box className="flex md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto md:overflow-visible pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {staff.map((member) => {
            const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
            const initials = `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`;
            const photo = member.photos?.secure_url ?? member.photos?.url ?? "";
            const specialization = member.title || member.role || "Beauty Specialist";

            return (
              <Box
                key={member.uuid}
                className="min-w-52 md:min-w-0 rounded-2xl border bg-(--app-surface-alt) border-(--app-border) hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.12)] transition-all duration-250 cursor-pointer"
                onClick={() => onStaffClick(member)}
              >
                <Box className="p-3 sm:p-4 flex items-center gap-3">
                  <Box className="relative shrink-0">
                    <Avatar src={photo} alt={fullName} className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-(--app-border)">
                      {initials || "—"}
                    </Avatar>
                    <Box className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border border-(--app-surface) bg-emerald-500" />
                  </Box>

                  <Box className="min-w-0">
                    <Typography className="font-semibold text-(--app-text) text-xs sm:text-sm truncate">
                      {fullName || "Unnamed"}
                    </Typography>
                    <Typography className="text-[10px] sm:text-xs text-(--app-muted) truncate mt-0.5">
                      {specialization}
                    </Typography>
                    <Chip
                      size="small"
                      label="Available"
                      className="mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 border border-emerald-500/18 h-5.5"
                    />
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

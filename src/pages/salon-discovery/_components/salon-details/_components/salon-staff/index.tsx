import { Avatar, Box } from "@mui/material";

interface SalonStaffProps {
  staff: any[];
}

export default function SalonStaff({ staff }: SalonStaffProps) {
  return (
    <Box>
      <Box className="text-xl font-semibold mb-6 tracking-tight text-slate-900">Meet Our Experts</Box>
      <Box className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
        {staff.map((member) => {
          const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
          const initials = `${member.first_name?.[0] || ""}${member.last_name?.[0] || ""}`;

          return (
            <Box key={member.uuid} className="group flex flex-col items-center text-center cursor-pointer">
              <Box className="relative p-0.75 rounded-full bg-slate-300 transition-all duration-300">
                <Box className="p-0.75 rounded-full bg-white">
                  <Avatar
                    src={member.photos?.url || ""}
                    alt={fullName}
                    className="bg-slate-100 text-slate-800 text-2xl font-semibold transition-transform duration-300 group-hover:scale-105"
                  >
                    {initials || "—"}
                  </Avatar>
                </Box>
                <Box className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Box className="text-white text-[10px] tracking-widest uppercase font-extrabold">View Profile</Box>
                </Box>
              </Box>
              <Box className="mt-3 font-medium text-slate-900 truncate max-w-30">{fullName || "Unnamed"}</Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

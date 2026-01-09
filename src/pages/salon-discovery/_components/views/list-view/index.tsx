import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SalonCard from "../../salon-card";
import type { RootState } from "../../../../../store/store";

export default function SalonListView() {
  const salons = useSelector((state: RootState) => state.salon?.data || []);

  return (
    <Box className="space-y-4 min-h-0 px-6">
      {salons.map((salon) => (
        <SalonCard key={salon.uuid} salon={salon} variant="list" />
      ))}

      {salons.length === 0 && <Box className="text-center text-slate-500 py-10">No salons found</Box>}
    </Box>
  );
}

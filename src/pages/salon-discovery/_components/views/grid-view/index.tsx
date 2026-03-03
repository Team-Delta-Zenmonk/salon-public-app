import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SalonCard from "../../salon-card";
import type { RootState } from "../../../../../store/store";

export default function SalonGridView() {
  const salons = useSelector((state: RootState) => state.salon?.data || []);

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 min-h-0 px-2 sm:px-3 lg:px-4 pb-4">
      {salons.map((salon: any) => (
        <SalonCard key={salon.uuid} salon={salon} variant="grid" />
      ))}

      {salons.length === 0 && <Box className="col-span-full text-center text-(--app-muted) py-14">No salons found</Box>}
    </Box>
  );
}

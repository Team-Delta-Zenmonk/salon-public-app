import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SalonCard from "../../salon-card";

export default function SalonGridView() {
  const salons = useSelector((state: any) => state.salon?.data || []);

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-0 px-6">
      {salons.map((salon: any) => (
        <SalonCard
          key={salon.uuid}
          salon={salon}
          variant="grid"
          onToggleFav={(uuid, next) => console.log("fav:", uuid, next)}
        />
      ))}

      {salons.length === 0 && (
        <Box className="col-span-full text-center text-slate-500 py-10">No salons found</Box>
      )}
    </Box>
  );
}

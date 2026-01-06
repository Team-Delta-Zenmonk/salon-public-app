import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import SalonCard from "../../salon-card";

export default function SalonListView() {
  const salons = useSelector((state: any) => state.salon?.data || []);

  return (
    <Box className="space-y-4 min-h-0 px-6">
      {salons.map((salon: any) => (
        <SalonCard
          key={salon.uuid}
          salon={salon}
          variant="list"
          onToggleFav={(uuid, next) => console.log("fav:", uuid, next)}
        />
      ))}

      {salons.length === 0 && <Box className="text-center text-slate-500 py-10">No salons found</Box>}
    </Box>
  );
}

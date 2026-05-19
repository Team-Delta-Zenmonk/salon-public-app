import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import SalonCard from "../../salon-card";
import type { RootState } from "../../../../../store/store";
import clsx from "clsx";

export default function SalonGridView() {
  const salons = useSelector((state: RootState) => state.salon?.data || []);
  const context = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
  const sidebarCollapsed = context?.sidebarCollapsed;

  return (
    <Box
      className={clsx(
        "grid gap-2.5 sm:gap-4 lg:gap-5 min-h-0 px-2 sm:px-3 lg:px-4 pb-4",
        "grid-cols-2",
        sidebarCollapsed ? "min-[700px]:grid-cols-3 min-[1200px]:grid-cols-4" : "min-[1200px]:grid-cols-3",
      )}
    >
      {salons.map((salon: any) => (
        <SalonCard key={salon.uuid} salon={salon} variant="grid" />
      ))}

      {salons.length === 0 && <Box className="col-span-full text-center text-(--app-muted) py-14">No salons found</Box>}
    </Box>
  );
}

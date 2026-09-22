import { Box, Typography, Button } from "@mui/material";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import SalonStaff from "../storefront/_components/storefront-staff";

export default function SpecialistsPage() {
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();
  const staff = salon?.staff || [];

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Box>
          <Typography className="text-xl sm:text-2xl font-black text-(--app-text) tracking-tight">
            Our Specialists & Artisans
          </Typography>
          <Typography className="text-xs sm:text-sm text-(--app-muted) mt-0.5">
            Meet the talented professionals dedicated to your styling and wellness
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={() => navigate("/services")}
          endIcon={<ArrowForwardIcon className="text-[14px]" />}
          className="rounded-xl px-4 py-2 font-bold text-xs bg-(--app-primary) text-(--app-primary-contrast) self-start sm:self-auto normal-case"
        >
          Book an Appointment
        </Button>
      </Box>

      {/* Staff Grid Container */}
      {staff.length === 0 ? (
        <Box className="text-center py-16 px-4 rounded-3xl border border-dashed border-(--app-border) bg-(--app-surface)">
          <PeopleOutlineOutlinedIcon className="text-(--app-muted) text-[40px] mb-2" />
          <Typography className="font-bold text-sm text-(--app-text)">
            No specialists listed currently
          </Typography>
          <Typography className="text-xs text-(--app-muted) mt-1 max-w-sm mx-auto">
            Our salon team members will be published here soon. You can still explore and book our services!
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={() => navigate("/services")}
            className="mt-4 rounded-xl text-xs font-bold bg-(--app-primary) text-(--app-primary-contrast) normal-case"
          >
            Explore Services
          </Button>
        </Box>
      ) : (
        <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-5 sm:p-7 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
          <SalonStaff staff={staff} salonId={salon?.uuid} />
        </Box>
      )}
    </Box>
  );
}

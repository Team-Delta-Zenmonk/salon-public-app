import { Box } from "@mui/material";
import ServiceCard from "./_components/service-card";

interface SalonServicesProps {
  services: any[];
  salon: any;
}

export default function SalonServices({ services, salon }: SalonServicesProps) {
  const rootServices = services.filter((s) => s.parent_id === null);

  const subServicesMap = services.reduce<Record<number, any[]>>((acc, s) => {
    if (s.parent_id) {
      acc[s.parent_id] = acc[s.parent_id] || [];
      acc[s.parent_id].push(s);
    }
    return acc;
  }, {});

  return (
    <Box className="w-full rounded-2xl border border-(--app-border) bg-(--app-surface) p-3 sm:p-5 lg:p-6">
      <Box className="flex items-end justify-between gap-2 sm:gap-3 mb-3 sm:mb-5 pb-3 sm:pb-4 border-b border-(--app-border)">
        <Box>
          <Box className="text-[1.32rem] sm:text-2xl font-semibold text-(--app-text)">Services</Box>
          <Box className="text-[0.84rem] sm:text-sm text-(--app-muted) mt-1 leading-snug">
            Explore and add premium treatments to your cart
          </Box>
        </Box>
        <Box className="text-[0.78rem] sm:text-sm text-(--app-muted) text-right leading-tight max-w-24 sm:max-w-none">
          {services.length} services available
        </Box>
      </Box>

      <Box className="columns-1 xl:columns-2 gap-3 sm:gap-4 [column-fill:balance]">
        {rootServices.map((service) => (
          <Box key={service.uuid} className="break-inside-avoid mb-3 sm:mb-4">
            <ServiceCard service={service} subServices={subServicesMap[service.id] || []} salon={salon} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

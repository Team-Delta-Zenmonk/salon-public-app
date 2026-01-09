import { Box } from "@mui/material";
import ServiceCard from "./_components/service-card";

interface SalonServicesProps {
  services: any[];
}

export default function SalonServices({ services }: SalonServicesProps) {
  const rootServices = services.filter((s) => s.parent_id === null);

  const subServicesMap = services.reduce<Record<number, any[]>>((acc, s) => {
    if (s.parent_id) {
      acc[s.parent_id] = acc[s.parent_id] || [];
      acc[s.parent_id].push(s);
    }
    return acc;
  }, {});

  return (
    <Box className="w-full">
      <Box className="text-lg font-semibold mb-4">Services</Box>

      <Box className="space-y-3">
        {rootServices.map((service) => (
          <ServiceCard key={service.uuid} service={service} subServices={subServicesMap[service.id] || []} />
        ))}
      </Box>
    </Box>
  );
}

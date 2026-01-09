import { Box, Chip, Typography, Link } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

interface SalonInfoProps {
  salon: any;
}

export default function SalonInfo({ salon }: SalonInfoProps) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} color="text.primary" sx={{ letterSpacing: "-0.02em" }}>
        {salon.name}
      </Typography>

      {salon.address && (
        <Box display="flex" alignItems="flex-start" gap={1} mt={1}>
          <LocationOnOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
            {salon.address}
          </Typography>
        </Box>
      )}

      <Box display="flex" flexWrap="wrap" alignItems="center" gap={1.5} mt={2}>
        {salon.type && <Chip label={salon.type} size="small" />}

        {salon.map_link && (
          <Link
            href={salon.map_link}
            target="_blank"
            rel="noreferrer"
            underline="hover"
            display="flex"
            alignItems="center"
            gap={0.5}
            color="text.primary"
            sx={{ fontSize: 14, fontWeight: 500 }}
          >
            <MapOutlinedIcon fontSize="small" />
            View on map
          </Link>
        )}
      </Box>
    </Box>
  );
}

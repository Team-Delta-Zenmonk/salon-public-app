import Image from "next/image";
import { Box, Divider } from "@mui/material";

export default function SecurityFooter() {
  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        opacity: 0.4,
      }}
    >
      <Box sx={{ position: "relative", height: 12, width: 64 }}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
          alt="Stripe"
          fill
          sizes="64px"
          style={{ objectFit: "contain", filter: "grayscale(1) brightness(0)" }}
          unoptimized
        />
      </Box>
      <Divider orientation="vertical" flexItem sx={{ height: 12, my: "auto" }} />
    </Box>
  );
}

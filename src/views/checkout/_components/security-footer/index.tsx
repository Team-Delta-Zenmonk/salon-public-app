import Image from "next/image";
import { Box, Divider } from "@mui/material";

export default function SecurityFooter() {
  return (
    <Box className="mt-6 flex flex-wrap items-center justify-center gap-4 opacity-40">
      <div className="relative h-3 w-16">
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
          alt="Stripe"
          fill
          sizes="64px"
          className="object-contain filter grayscale brightness-0 dark:invert"
          unoptimized
        />
      </div>
      <Divider orientation="vertical" flexItem className="h-3 my-auto" />
    </Box>
  );
}

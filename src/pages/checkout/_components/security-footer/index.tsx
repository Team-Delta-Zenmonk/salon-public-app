import { Box, Divider } from "@mui/material";

export default function SecurityFooter() {
  return (
    <Box className="mt-6 flex flex-wrap items-center justify-center gap-4 opacity-40">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg"
        alt="Stripe"
        className="h-3 filter grayscale brightness-0 dark:invert"
      />
      <Divider orientation="vertical" flexItem className="h-3 my-auto" />
    </Box>
  );
}

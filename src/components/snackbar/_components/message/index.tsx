import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { VariantType } from "notistack";
import { IconMapper } from "./_components/icon-mapper";

import styles from "./message.module.css";

interface MessageProps {
  message: string;
  maxWidth?: number;
  variant?: VariantType;
}

export const Message = ({ message, maxWidth, variant }: MessageProps) => {

  return (
    <Box maxWidth={maxWidth ?? "100%"} className={styles.messageBox} gap="12px">
      <IconMapper variant={variant} />
      <Typography fontSize={14} component="span" data-test-id={`text-${message}`} aria-live="polite">
        {message}
      </Typography>
    </Box>
  );
};

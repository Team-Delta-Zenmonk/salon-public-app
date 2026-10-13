import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface AssistanceCardProps {
  phone?: string;
  isDesktop?: boolean;
}

export default function AssistanceCard({ phone, isDesktop = false }: Readonly<AssistanceCardProps>) {
  return (
    <Box
      sx={{
        mt: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderRadius: "1rem",
        backgroundColor: "var(--app-primary-soft)",
        border: "1px solid var(--color-hairline)",
        ...(isDesktop ? {} : { mb: 2, "@media (min-width: 1024px)": { display: "none" } }),
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ErrorOutlineIcon sx={{ color: "var(--color-primary)", fontSize: 20 }} />
      </Box>
      <Box>
        <Typography sx={{ fontSize: 13, fontWeight: 900, color: "var(--color-on-surface)", lineHeight: 1, mb: "4px" }}>
          Need help?
        </Typography>
        <Typography
          component="a"
          href={`tel:${phone || "+91 98765 43210"}`}
          sx={{
            fontSize: 11,
            color: "var(--color-tertiary)",
            textDecoration: "none",
            display: "block",
            mt: "2px",
            "&:hover": { color: "var(--color-primary)" },
            transition: "color 0.2s",
          }}
        >
          Contact salon: {phone || "+91 98765 43210"}
        </Typography>
      </Box>
    </Box>
  );
}

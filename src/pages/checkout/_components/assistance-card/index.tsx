import { Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface AssistanceCardProps {
  phone?: string;
  isDesktop?: boolean;
}

export default function AssistanceCard({ phone, isDesktop = false }: Readonly<AssistanceCardProps>) {
  return (
    <Box
      className={`
        ${isDesktop ? "mt-4 flex" : "mt-4 mb-4 flex lg:hidden"}
        p-4 rounded-[20px] !bg-[var(--app-primary-soft)]
        items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400
        border border-[var(--app-border)]
      `}
    >
      <Box className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shrink-0">
        <ErrorOutlineIcon className="text-[var(--app-primary)] text-[20px]" />
      </Box>
      <Box>
        <Typography className="text-[13px] font-black text-[var(--app-text)] leading-none mb-1">Need help?</Typography>
        <Typography
          component="a"
          href={`tel:${phone || "+91 98765 43210"}`}
          className="text-[11px] text-[var(--app-muted)] hover:text-[var(--app-primary)] transition-colors no-underline block mt-0.5"
        >
          Contact salon: {phone || "+91 98765 43210"}
        </Typography>
      </Box>
    </Box>
  );
}

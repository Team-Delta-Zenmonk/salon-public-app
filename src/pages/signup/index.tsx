import { Box, Typography } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import LoginButton from "../../components/login/login-button";
import { useStorefront } from "../../providers/storefront-provider";

export default function SignUp() {
  const { salon } = useStorefront();

  const salonName = salon?.name?.toUpperCase() || "CRIMSON & SHEAR";

  return (
    <Box className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-8 lg:py-12 space-y-8 text-[var(--app-text)]">
      {/* Editorial Sub-header breadcrumb */}
      <Box className="flex items-center justify-between pb-4 border-b border-[var(--app-border)]/30">
        <Box className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-[var(--app-primary)] tracking-widest uppercase">
            Member Sanctuary
          </span>
          <span className="text-[var(--app-border)] text-xs">/</span>
          <span className="text-[11px] font-bold text-[var(--app-muted)] tracking-wider uppercase">
            {salonName} Dossier & Authentication
          </span>
        </Box>
        <Box className="hidden sm:flex items-center gap-3 text-[10px] font-bold">
          <span className="text-[var(--app-muted)] tracking-widest uppercase">SESSION PASS #CS-8924</span>
          <span className="h-3 w-px bg-[var(--app-border)]/50" />
          <span className="text-[var(--app-primary)] tracking-widest uppercase">TIER: PRIVATE SALON CLIENT</span>
        </Box>
      </Box>

      {/* 2-Column Luxury Split Grid */}
      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Editorial Hero Showcase & Member Privileges (5 cols) */}
        <aside className="lg:col-span-5 flex flex-col gap-6">
          {/* Visual Card with Image & Dark Gradient Overlay */}
          <Box className="relative rounded-2xl overflow-hidden panel-rim bg-[var(--app-bg)] shadow-2xl group">
            <Box className="aspect-[3/4] w-full relative overflow-hidden">
              <img
                alt="Precision Hair Silhouette Model"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9MuS3xDHkjwiYKF8-kgmQ9VV1GOmKNpg6rFlOEMJ-uVHxoWnGQDxpXqsN5UTVQOkLYjCU6CSOuLXjAGh6VZrx-e5VHil70eIX7Zav-fnW6SdNaYyYVomK8vImtYk1VEY32vBra5cslZbUVPb9r1zVrfoUjw6A2NA7KRT2opCDSXOoUW2p9drgf-aejtR1YL0_I5etQ_AIElztjZTcsx9Lnm8HJxvl7oAuRYchHFwLLQHdiKmEryioof6MdFuY-yqDnB57GdEV0qQ"
              />
              <Box className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/50 to-transparent" />
              <Box className="absolute inset-0 bg-gradient-to-r from-[var(--app-bg)]/80 via-transparent to-[var(--app-bg)]/30" />
              <Box className="absolute -bottom-10 -left-10 w-48 h-48 /20 blur-3xl pointer-events-none rounded-full" />

              {/* Salon Seal Badge */}
              <Box className="absolute top-4 left-4 bg-[var(--app-surface-alt)]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--app-primary)]/30 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" />
                <span className="text-[10px] font-bold text-[var(--app-primary)] tracking-widest uppercase">
                  Master Cut & Silhouette No. 44
                </span>
              </Box>
              <Box className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded bg-[var(--app-bg)]/80 backdrop-blur-sm border border-[var(--app-border)]/40 text-[10px] font-bold text-[var(--app-muted)]">
                  COLLECTION '25
                </span>
              </Box>
            </Box>

            {/* VIP Testimonial Quote Panel */}
            <Box className="p-5 relative -mt-16 z-10 bg-gradient-to-b from-[var(--app-surface-alt)]/90 to-[var(--app-bg)]/95 backdrop-blur-md rounded-b-2xl border-t border-[var(--app-border)]/30">
              <Box className="flex items-center gap-1 text-[var(--app-primary)] mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarRoundedIcon key={s} className="text-[16px] text-[var(--app-primary)]" />
                ))}
                <span className="text-[10px] font-bold text-[var(--app-muted)] ml-2">VERIFIED PATRON</span>
              </Box>
              <Typography className="font-editorial text-lg italic text-[var(--app-text)] font-light leading-snug mb-3">
                “The attention to cranial architecture and the bespoke private suite transformed my entire silhouette. An unrivaled sanctuary.”
              </Typography>
              <Box className="flex items-center justify-between pt-2 border-t border-[var(--app-border)]/20">
                <Box>
                  <Typography className="text-xs font-bold text-[var(--app-text)]">Aria Montgomery</Typography>
                  <Typography className="text-[11px] text-[var(--app-muted)]">Private Client • Member since 2022</Typography>
                </Box>
                <VerifiedOutlinedIcon className="text-emerald-400 text-[18px]" />
              </Box>
            </Box>
          </Box>

          {/* Salon Membership Perks Teaser Box */}
          <Box className="bg-[var(--app-surface-alt)] rounded-2xl p-6 panel-rim space-y-4 shadow-xl">
            <Box className="flex items-center justify-between">
              <Typography className="font-editorial text-lg font-semibold text-[var(--app-text)] flex items-center gap-2">
                <WorkspacePremiumOutlinedIcon className="text-[var(--app-primary)]" />
                Privileges of the Member Pass
              </Typography>
              <span className="text-[9px] font-bold text-[var(--app-primary)] border border-[var(--app-primary)]/30 px-2 py-0.5 rounded">
                EXCLUSIVE
              </span>
            </Box>
            <ul className="space-y-4 p-0 m-0 list-none">
              <li className="flex items-start gap-3">
                <Box className="mt-0.5 w-6 h-6 rounded-full /40 flex items-center justify-center shrink-0">
                  <MeetingRoomOutlinedIcon className="text-[14px]" />
                </Box>
                <Box>
                  <Typography className="text-xs font-bold text-[var(--app-text)] block">Private Suite Priority</Typography>
                  <Typography className="text-xs text-[var(--app-muted)]">Guaranteed solitary studio booking with acoustic noise mitigation and personal stylist consultation.</Typography>
                </Box>
              </li>
              <li className="flex items-start gap-3">
                <Box className="mt-0.5 w-6 h-6 rounded-full /40 flex items-center justify-center shrink-0">
                  <LocalBarOutlinedIcon className="text-[14px]" />
                </Box>
                <Box>
                  <Typography className="text-xs font-bold text-[var(--app-text)] block">Complimentary Botanical Bar</Typography>
                  <Typography className="text-xs text-[var(--app-muted)]">Rare botanical infusions, artisan sparkling waters, or chilled vintage refreshments during sessions.</Typography>
                </Box>
              </li>
              <li className="flex items-start gap-3">
                <Box className="mt-0.5 w-6 h-6 rounded-full /40 flex items-center justify-center shrink-0">
                  <HistoryEduOutlinedIcon className="text-[14px]" />
                </Box>
                <Box>
                  <Typography className="text-xs font-bold text-[var(--app-text)] block">Bespoke Formulations Archive</Typography>
                  <Typography className="text-xs text-[var(--app-muted)]">Encrypted record of your custom hair pigment mixtures, pH treatments, and sensory preferences.</Typography>
                </Box>
              </li>
            </ul>
          </Box>
        </aside>

        {/* RIGHT COLUMN: Elegant Dossier Intake & Authentication Pane (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <Box className="bg-[var(--app-surface-alt)] rounded-2xl p-6 sm:p-8 panel-rim shadow-2xl relative space-y-6 border border-[var(--app-border)]/40">
            <Box className="border-b border-[var(--app-border)]/30 pb-4 space-y-2">
              <Box className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--app-primary)] tracking-widest uppercase">
                  Client Intake
                </span>
                <span className="w-1 h-1 rounded-full bg-[var(--app-border)]" />
                <span className="text-[10px] font-bold text-[var(--app-muted)] tracking-wider uppercase">
                  Confidential Protocol
                </span>
              </Box>
              <Typography className="font-editorial text-2xl sm:text-4xl font-semibold text-[var(--app-text)] tracking-tight">
                {salonName} Member Dossier
              </Typography>
              <Typography className="text-xs sm:text-sm text-[var(--app-muted)] leading-relaxed">
                Create your sanctuary profile or sign in to access tailored cranial formulations and reserve private suites.
              </Typography>
            </Box>

            <Box className="rounded-xl border border-[var(--app-border)]/40 bg-[var(--app-bg)] p-4 text-xs text-[var(--app-muted)] space-y-1">
              <span className="font-bold text-[var(--app-primary)] uppercase block text-[10px] tracking-wider">
                Sanctuary One-Tap Access
              </span>
              <span>Use Google authentication below to finish booking instantly or access your appointment history.</span>
            </Box>

            {/* Google Authentication Component */}
            <Box className="pt-2">
              <LoginButton />
            </Box>
          </Box>
        </section>
      </Box>
    </Box>
  );
}

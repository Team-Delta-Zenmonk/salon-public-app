"use client";
import { Box, Typography } from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import LocalBarOutlinedIcon from "@mui/icons-material/LocalBarOutlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";
import LoginButton from "../../components/login/login-button";
import { useStorefront } from "../../providers/storefront-provider";

export default function SignUp() {
  const { salon } = useStorefront();

  const salonName = salon?.name || "ATELIER SOLSTICE";

  return (
    <Box className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-10 lg:py-16 space-y-10 text-[#1C1C18] bg-[#FCF9F3] min-h-screen font-sans">
      <Box className="flex items-center justify-between pb-4 border-b border-[#E5DFD5]">
        <Box className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase">
            MEMBER SANCTUARY
          </span>
          <span className="text-[#E5DFD5] text-xs">/</span>
          <span className="text-[10px] font-semibold text-[#766A5E] tracking-[0.1em] uppercase">
            {salonName} Dossier Authentication
          </span>
        </Box>
        <Box className="hidden sm:flex items-center gap-4 text-[10px] font-semibold">
          <span className="text-[#766A5E] uppercase tracking-[0.12em]">AUTHENTICATION PROTOCOL</span>
          <span className="h-3 w-px bg-[#E5DFD5]" />
          <span className="text-[#1C1A17] uppercase tracking-[0.12em]">TIER: PRIVATE SALON CLIENT</span>
        </Box>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <aside className="lg:col-span-5 flex flex-col gap-6">
          <Box className="bg-[#FCFAF7] rounded-[2px] p-6 sm:p-8 border border-[#E5DFD5] space-y-5">
            <Box className="flex items-center justify-between pb-3 border-b border-[#E5DFD5]">
              <Typography className="font-serif text-xl font-medium text-[#1C1A17] flex items-center gap-2">
                <WorkspacePremiumOutlinedIcon className="text-[#A88B64]" />
                Privileges of the Member Pass
              </Typography>
            </Box>
            <ul className="space-y-4 p-0 m-0 list-none">
              <li className="flex items-start gap-3">
                <Box className="mt-0.5 w-6 h-6 rounded-[2px] bg-[#F2EEE7] text-[#1C1A17] flex items-center justify-center shrink-0 border border-[#E5DFD5]">
                  <MeetingRoomOutlinedIcon className="text-[14px]" />
                </Box>
                <Box>
                  <Typography className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">Private Suite Priority</Typography>
                  <Typography className="text-xs text-[#766A5E] mt-0.5 leading-relaxed">Guaranteed solitary studio booking with acoustic noise mitigation and personal stylist consultation.</Typography>
                </Box>
              </li>
              <li className="flex items-start gap-3">
                <Box className="mt-0.5 w-6 h-6 rounded-[2px] bg-[#F2EEE7] text-[#1C1A17] flex items-center justify-center shrink-0 border border-[#E5DFD5]">
                  <LocalBarOutlinedIcon className="text-[14px]" />
                </Box>
                <Box>
                  <Typography className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">Botanical Sensory Bar</Typography>
                  <Typography className="text-xs text-[#766A5E] mt-0.5 leading-relaxed">Rare botanical infusions, artisan sparkling waters, or chilled vintage refreshments during sessions.</Typography>
                </Box>
              </li>
              <li className="flex items-start gap-3">
                <Box className="mt-0.5 w-6 h-6 rounded-[2px] bg-[#F2EEE7] text-[#1C1A17] flex items-center justify-center shrink-0 border border-[#E5DFD5]">
                  <HistoryEduOutlinedIcon className="text-[14px]" />
                </Box>
                <Box>
                  <Typography className="text-xs font-semibold text-[#1C1A17] uppercase tracking-wider block">Formulations Archive</Typography>
                  <Typography className="text-xs text-[#766A5E] mt-0.5 leading-relaxed">Encrypted record of your custom hair pigment mixtures, pH treatments, and sensory preferences.</Typography>
                </Box>
              </li>
            </ul>
          </Box>
        </aside>

        <section className="lg:col-span-7 flex flex-col gap-6">
          <Box className="bg-[#FCFAF7] rounded-[2px] p-6 sm:p-10 border border-[#E5DFD5] shadow-xs relative space-y-6">
            <Box className="border-b border-[#E5DFD5] pb-6 space-y-2">
              <Box className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-[#A88B64] tracking-[0.14em] uppercase">
                  CONFIDENTIAL INTAKE
                </span>
                <span className="w-1 h-1 rounded-full bg-[#1C1A17]" />
                <span className="text-[10px] font-semibold text-[#766A5E] tracking-[0.1em] uppercase">
                  ATELIER PATRON PROTOCOL
                </span>
              </Box>
              <Typography className="font-serif text-3xl sm:text-4xl font-normal text-[#1C1A17] tracking-tight">
                {salonName} Member Dossier
              </Typography>
              <Typography className="text-xs sm:text-sm text-[#766A5E] leading-relaxed">
                Create your sanctuary profile or sign in to access tailored cranial formulations and reserve private suites.
              </Typography>
            </Box>

            <Box className="rounded-[2px] border border-[#E5DFD5] bg-[#F6F3ED] p-4 text-xs text-[#766A5E] space-y-1">
              <span className="font-semibold text-[#1C1A17] uppercase block text-[10px] tracking-wider">
                ONE-TAP SECURE AUTHENTICATION
              </span>
              <span>Use Google authentication below to finish booking instantly or access your appointment history.</span>
            </Box>

            <Box className="pt-4">
              <LoginButton />
            </Box>
          </Box>
        </section>
      </Box>
    </Box>
  );
}


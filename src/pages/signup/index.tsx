import { Box } from "@mui/material";
import LoginButton from "../../components/login/login-button";
import SalonLoginCarousel from "../../components/login/login-carousel";

export default function SignUp() {
  return (
    <Box className="min-h-screen grid place-items-center px-4 py-8 ">
      <Box className="w-full max-w-280 overflow-hidden rounded-3xl border border-slate-200/60 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)] bg-white">
        <Box className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] md:min-h-160">
          <Box className="flex flex-col justify-center gap-8 p-8 md:p-12 lg:p-16 bg-white">
            <Box className="space-y-6">
              <Box className="inline-block px-3 py-1.5 text-sm font-semibold bg-blue-50 text-(--primary-900) border border-blue-200 rounded-lg">
                Salon Portal
              </Box>
              <Box className="text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
                Sign up to get started
              </Box>
              <Box className="text-lg text-slate-600 leading-relaxed">
                Discover nearby salons and book your beauty services instantly.
              </Box>
            </Box>
            <LoginButton />
          </Box>
          <Box className="hidden md:flex items-center justify-center p-8">
            <SalonLoginCarousel />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

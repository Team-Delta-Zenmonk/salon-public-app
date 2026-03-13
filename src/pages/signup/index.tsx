import { Box } from "@mui/material";
import LoginButton from "../../components/login/login-button";
import SalonLoginCarousel from "../../components/login/login-carousel";

export default function SignUp() {
  return (
    <Box className="relative min-h-screen overflow-hidden bg-(--app-bg) px-4 py-8 sm:px-6 lg:px-10">
      <Box className="pointer-events-none absolute inset-0 opacity-70">
        <Box className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-(--app-primary-soft) blur-3xl" />
        <Box className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-(--app-primary-soft) blur-3xl" />
      </Box>

      <Box className="relative mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-280 place-items-center">
        <Box className="w-full overflow-hidden rounded-3xl border border-(--app-border) bg-(--app-surface) shadow-[0_24px_80px_-28px_var(--app-primary-soft)]">
          <Box className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] md:min-h-160">
            <Box className="flex flex-col justify-center gap-8 p-8 md:p-12 lg:p-16">
              <Box className="space-y-6">
                <Box className="inline-flex items-center gap-2 rounded-full border border-(--app-border) bg-(--app-surface-alt) px-3 py-1.5 text-sm font-semibold text-(--app-text)">
                  <Box className="h-2 w-2 rounded-full bg-(--app-primary)" />
                  Salon Portal
                </Box>
                <Box className="text-4xl font-semibold leading-tight text-(--app-text) md:text-5xl">
                  Sign in to continue booking
                </Box>
                <Box className="text-lg leading-relaxed text-(--app-muted)">
                  Discover nearby salons, compare services, and secure your preferred time slot in minutes.
                </Box>
              </Box>
              <Box className="rounded-2xl border border-(--app-border) bg-(--app-surface-alt) p-4">
                <Box className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-(--app-muted)">
                  Quick Access
                </Box>
                <Box className="text-sm text-(--app-muted)">
                  Use Google sign-in to continue from your cart and finish booking instantly.
                </Box>
              </Box>

              <LoginButton />
            </Box>

            <Box className="hidden items-center justify-center border-l border-(--app-border) bg-(--app-surface-alt) p-6 md:flex lg:p-8">
              <SalonLoginCarousel />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

"use client";
import { Box, Typography, Button, Avatar } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";

export default function SpecialistsPage() {
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();
  const staff = salon?.staff || [];

  return (
    <Box className="space-y-10 pb-24 text-(--app-text)">
      {/* Editorial Header Section (Stitch 1:1 Spec) */}
      <section className="relative overflow-hidden pt-6 pb-8 px-4 md:px-12 bg-gradient-to-b from-(--app-bg) via-(--app-bg) to-(--app-bg) border-b border-(--app-border)/20 rounded-xl">
        <Box className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Box className="space-y-2">
            <Box className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-(--app-primary-soft) border border-(--app-primary)/40 text-(--app-primary) text-[10px] font-bold uppercase tracking-widest">
                <WorkspacePremiumOutlinedIcon className="text-[14px]" />
                CERTIFIED ARTISANS & STYLISTS
              </span>
            </Box>
            <Typography className="font-editorial text-3xl sm:text-5xl font-bold text-(--app-text) tracking-tight">
              Master Specialists <span className="italic font-normal text-(--app-primary)">& Staff Dossier</span>
            </Typography>
            <Typography className="text-xs sm:text-sm text-(--app-muted) max-w-2xl">
              Personalized consultations tailored to your cranial geometry, hair porosity, and lifestyle profile.
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/services")}
            endIcon={<ArrowForwardIcon className="text-[16px]" />}
            className="px-6 py-3 rounded-lg text-xs font-bold crimson-glow hover:brightness-110 active:scale-[0.98] transition-all normal-case border-0 self-start md:self-auto"
          >
            Reserve Session with Specialist
          </Button>
        </Box>
      </section>

      {/* Main Staff Dossier Grid */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-12">
        {staff.length === 0 ? (
          <Box className="text-center py-20 px-4 rounded-xl border border-dashed border-(--app-border) bg-(--app-bg)">
            <WorkspacePremiumOutlinedIcon className="text-(--app-muted) text-[48px] mb-3" />
            <Typography className="font-editorial text-xl font-bold text-(--app-text)">
              Artisans Presently Conducting Consultations
            </Typography>
            <Typography className="text-xs text-(--app-muted) mt-1.5 max-w-md mx-auto">
              Our resident master specialists are currently taking appointments. Explore available treatments to book your session!
            </Typography>
            <Button
              size="small"
              variant="contained"
              onClick={() => navigate("/services")}
              className="mt-6 rounded-lg px-6 py-2.5 text-xs font-bold normal-case"
            >
              Explore Treatment Menu
            </Button>
          </Box>
        ) : (
          <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staff.map((member: any) => {
              const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim() || "Master Specialist";
              const photo = member.photos?.secure_url ?? member.photos?.url;

              return (
                <Box
                  key={member.uuid || member.id}
                  className="group bg-(--app-surface-alt) rounded-2xl panel-rim p-6 flex flex-col justify-between crimson-border-hover transition-all duration-300 shadow-xl relative overflow-hidden"
                >
                  <Box className="space-y-4">
                    <Box className="flex items-start gap-4">
                      <Box className="relative shrink-0">
                        <Avatar
                          src={photo}
                          alt={fullName}
                          className="w-20 h-20 rounded-2xl border-2 border-(--app-border) object-cover bg-(--app-surface-alt) group-hover:border-(--app-primary) transition-colors capitalize"
                        >
                          {member.first_name?.[0] || "S"}
                        </Avatar>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-(--app-surface-alt)" />
                      </Box>

                      <Box className="min-w-0 flex-1">
                        <Box className="flex items-center gap-1 text-(--app-primary) text-xs font-bold mb-0.5">
                          <span>4.9</span>
                          <StarRoundedIcon className="text-[14px] text-(--app-primary)" />
                          <span className="text-(--app-muted) font-normal text-[11px]">(140 Sessions)</span>
                        </Box>
                        <Typography className="font-editorial text-lg font-bold text-(--app-text) group-hover:text-(--app-primary) transition-colors truncate capitalize">
                          {fullName}
                        </Typography>
                        <Typography className="text-xs text-(--app-primary) font-semibold uppercase tracking-wider mt-0.5 capitalize">
                          {member.title || member.role || "Artistic Director & Colorist"}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography className="text-xs text-(--app-muted) leading-relaxed line-clamp-3">
                      {member.bio ||
                        "Specialized in precision dry shears, organic balayage glazes, and scalp revitalization protocols trained at European academies."}
                    </Typography>

                    <Box className="flex items-center gap-2 pt-2 border-t border-(--app-border)/20 text-[11px] text-(--app-muted)">
                      <CalendarTodayOutlinedIcon className="text-[14px] text-(--app-primary)" />
                      <span>Available for Booking Today</span>
                    </Box>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => navigate(`/services?specialist=${encodeURIComponent(fullName)}`)}
                    endIcon={<ArrowForwardIcon className="text-[16px] capitalize" />}
                    className="mt-6"
                  >
                    Select Specialist for Ritual
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </main>
    </Box>
  );
}

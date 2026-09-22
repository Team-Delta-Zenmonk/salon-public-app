import { useState, useMemo } from "react";
import { Box, Typography, Button, Avatar, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import CleanHandsOutlinedIcon from "@mui/icons-material/CleanHandsOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import StorefrontGallery from "../storefront/_components/storefront-gallery";
import { PREDEFINED_CATEGORIES } from "../../common/predefined-categories";

export default function HomePage() {
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();
  const [heroSearch, setHeroSearch] = useState("");

  const services: any[] = salon?.services || [];
  const staff: any[] = salon?.staff || [];
  const photos: any[] = salon?.photos || [];

  const rootServices = useMemo(() => services.filter((s: any) => s.parent_id === null), [services]);
  const featuredServices = useMemo(() => rootServices.slice(0, 3), [rootServices]);
  const featuredStaff = useMemo(() => staff.slice(0, 4), [staff]);

  // Compute live open status from real business_hours
  const currentDayIndex = new Date().getDay();
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const currentDayKey = daysOfWeek[currentDayIndex];

  const getTodayHours = () => {
    const raw = salon?.business_hours?.[currentDayKey] ?? salon?.business_hours?.[currentDayKey.slice(0, 3)];
    if (!raw) return { label: "09:00 AM - 08:00 PM", isOpen: true };
    if (typeof raw === "string") {
      const isClosed = raw.toLowerCase() === "closed";
      return { label: raw, isOpen: !isClosed };
    }
    if (raw.is_closed) return { label: "Closed Today", isOpen: false };
    const start = raw.start_time || raw.open || "09:00 AM";
    const end = raw.end_time || raw.close || "08:00 PM";
    return { label: `${start} - ${end}`, isOpen: true };
  };

  const todayHours = getTodayHours();
  const firstPhoto = photos[0];
  const heroPhoto =
    typeof firstPhoto === "string"
      ? firstPhoto
      : firstPhoto?.secure_url || firstPhoto?.url || null;

  // Compute bento categories with service count and starting prices
  const bentoCategories = useMemo(() => {
    const iconsMap: Record<string, any> = {
      "Haircut & Styling": ContentCutOutlinedIcon,
      "Hair Coloring": BrushOutlinedIcon,
      "Facial & Skincare": FaceOutlinedIcon,
      "Manicure & Pedicure": CleanHandsOutlinedIcon,
      "Makeup": BrushOutlinedIcon,
      "Waxing": AutoAwesomeOutlinedIcon,
      "Massage & Spa": SpaOutlinedIcon,
      "Bridal & Grooming Packages": WorkspacePremiumOutlinedIcon,
    };

    return PREDEFINED_CATEGORIES.map((cat) => {
      const keyword = cat.name.split(" ")[0].toLowerCase();
      const matchingServices = rootServices.filter(
        (s: any) =>
          s.category?.name?.toLowerCase() === cat.name.toLowerCase() ||
          s.name?.toLowerCase().includes(keyword)
      );

      const minPrice = matchingServices.reduce(
        (min: number, s: any) => (s.price < min ? s.price : min),
        matchingServices[0]?.price || 0
      );

      const IconComponent = iconsMap[cat.name] || AutoAwesomeOutlinedIcon;
      const slugId = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        id: slugId,
        label: cat.name,
        description: cat.description,
        count: matchingServices.length,
        minPrice,
        IconComponent,
      };
    }).filter(
      (cat) =>
        cat.count > 0 ||
        cat.label.includes("Haircut") ||
        cat.label.includes("Facial") ||
        cat.label.includes("Manicure")
    );
  }, [rootServices]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/services?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/services");
    }
  };

  return (
    <Box className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. CINEMATIC EDITORIAL HERO (21st.dev Style) */}
      <section className="relative w-full overflow-hidden rounded-[2.5rem] bg-(--app-surface) border border-(--app-border) p-6 sm:p-10 lg:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)]">
        {/* Ambient mesh glows */}
        <Box className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
          <Box className="absolute -top-32 -left-32 w-120 h-120 rounded-full bg-linear-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl" />
          <Box className="absolute top-1/2 -right-32 w-110 h-110 rounded-full bg-linear-to-bl from-amber-500/15 via-rose-500/10 to-transparent blur-3xl" />
        </Box>

        <Box className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <Box className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Live Operational Status Capsule */}
            <Box className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-(--app-surface-alt) border border-(--app-border) shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                {todayHours.isOpen && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    todayHours.isOpen ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
              </span>
              <span className="text-xs font-bold text-(--app-text) tracking-wide">
                {todayHours.isOpen ? "Open Today" : "Closed Today"}
              </span>
              <span className="text-(--app-muted) text-xs">•</span>
              <span className="text-xs text-(--app-muted)">{todayHours.label}</span>
              <span className="hidden sm:inline text-(--app-muted) text-xs">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                <BoltIcon className="text-[14px]" /> Instant Slot Confirmation
              </span>
            </Box>

            {/* Master Headline */}
            <Box className="space-y-3">
              <Typography className="text-xs font-extrabold uppercase tracking-[0.25em] text-(--app-primary) flex items-center gap-2">
                <AutoAwesomeOutlinedIcon className="text-[14px]" />
                {salon?.type ? `${salon.type.toUpperCase()} ATELIER` : "BOUTIQUE SALON & SPA"}
              </Typography>
              <Typography
                component="h1"
                className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-extrabold text-(--app-text) tracking-tight leading-[1.08]"
              >
                {salon?.name || "ZenMonk Atelier"}
              </Typography>
              <Typography className="text-sm sm:text-base text-(--app-muted) max-w-xl leading-relaxed pt-1">
                {salon?.about ||
                  "Immerse yourself in precision cuts, customized hair coloring, and advanced skincare therapies crafted with tailored precision."}
              </Typography>
            </Box>

            {/* Interactive Hero Search Bar */}
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={0}
              className="w-full max-w-xl rounded-full border border-(--app-border) bg-(--app-surface-alt)/80 backdrop-blur-md p-1.5 flex items-center gap-2 shadow-xs transition-all focus-within:border-(--app-primary) focus-within:ring-2 focus-within:ring-(--app-primary)/20"
            >
              <Box className="pl-3.5 text-(--app-muted) flex items-center">
                <SearchIcon className="text-[20px]" />
              </Box>
              <InputBase
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="Search haircut, facial, manicure, spa rituals..."
                className="flex-1 text-xs sm:text-sm font-medium text-(--app-text)"
              />
              <Button
                type="submit"
                variant="contained"
                className="rounded-full px-5 py-2 text-xs font-bold bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110 normal-case shadow-none"
              >
                Search
              </Button>
            </Paper>

            {/* Trending Category Pills */}
            <Box className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-(--app-muted)">Trending:</span>
              {bentoCategories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/services?category=${cat.id}`)}
                  type="button"
                  className="px-3 py-1 rounded-full bg-(--app-surface-alt) hover:bg-(--app-primary-soft) hover:text-(--app-primary) border border-(--app-border) text-(--app-text) font-semibold text-xs transition-all cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}
            </Box>

            {/* Micro Highlights Badges */}
            <Box className="pt-4 w-full grid grid-cols-3 gap-3 sm:gap-6 border-t border-(--app-border)">
              <Box>
                <Box className="flex items-center gap-1.5 text-(--app-text)">
                  <StarRoundedIcon className="text-amber-400 text-[20px]" />
                  <span className="font-extrabold text-sm sm:text-base">5.0 Star</span>
                </Box>
                <Typography className="text-[11px] text-(--app-muted) mt-0.5 font-medium">
                  Verified Reviews
                </Typography>
              </Box>
              <Box>
                <Box className="flex items-center gap-1.5 text-(--app-text)">
                  <ContentCutOutlinedIcon className="text-(--app-primary) text-[18px]" />
                  <span className="font-extrabold text-sm sm:text-base">{services.length}+ Rituals</span>
                </Box>
                <Typography className="text-[11px] text-(--app-muted) mt-0.5 font-medium">
                  Custom Treatments
                </Typography>
              </Box>
              <Box>
                <Box className="flex items-center gap-1.5 text-(--app-text)">
                  <ShieldOutlinedIcon className="text-emerald-500 text-[18px]" />
                  <span className="font-extrabold text-sm sm:text-base">ZenMonk</span>
                </Box>
                <Typography className="text-[11px] text-(--app-muted) mt-0.5 font-medium">
                  Certified Venue
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right Column: Multi-Layer Visual Card Collage */}
          <Box className="lg:col-span-5 relative flex justify-center items-center">
            <Box className="relative w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden shadow-2xl bg-(--app-surface-alt) border border-(--app-border) group">
              {heroPhoto ? (
                <img
                  src={heroPhoto}
                  alt={salon?.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <Box className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-linear-to-br from-(--app-primary-soft) via-(--app-surface-alt) to-(--app-surface)">
                  <Avatar className="w-28 h-28 rounded-3xl bg-(--app-primary) text-(--app-primary-contrast) font-editorial text-5xl mb-4 shadow-xl border-4 border-(--app-surface)">
                    {salon?.name?.[0] || "S"}
                  </Avatar>
                  <Typography className="font-editorial font-bold text-2xl text-(--app-text)">
                    {salon?.name}
                  </Typography>
                  <Typography className="text-xs text-(--app-muted) mt-1 uppercase tracking-widest font-semibold">
                    {salon?.type || "Boutique"} Atelier
                  </Typography>
                </Box>
              )}

              {/* Floating Widget 1 (Top Right): Live Reservation Dot */}
              <Box className="absolute top-4 right-4 px-3.5 py-2 rounded-2xl bg-(--app-surface)/95 backdrop-blur-md border border-(--app-border) shadow-lg flex items-center gap-2 animate-float-gentle">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-(--app-text)">Instant Booking</span>
              </Box>

              {/* Floating Widget 2 (Bottom): Specialist & Guarantee Capsule */}
              <Box className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-(--app-surface)/95 backdrop-blur-md border border-(--app-border) shadow-xl flex items-center justify-between gap-3 animate-float-gentle" style={{ animationDelay: "1.5s" }}>
                <Box className="flex items-center gap-3 min-w-0">
                  <Box className="p-2 rounded-xl bg-(--app-primary-soft) text-(--app-primary) shrink-0">
                    <WorkspacePremiumOutlinedIcon className="text-[20px]" />
                  </Box>
                  <Box className="min-w-0">
                    <Typography className="font-bold text-xs text-(--app-text) truncate">
                      Atelier Distinction
                    </Typography>
                    <Typography className="text-[10px] text-(--app-muted) truncate">
                      {staff.length > 0 ? `${staff.length} Master Stylists on duty` : "Certified Partner"}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate("/services")}
                  className="rounded-xl px-3 py-1 text-[11px] font-bold bg-(--app-primary) text-(--app-primary-contrast) normal-case shrink-0"
                >
                  Book Slot
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </section>

      {/* 2. INTERACTIVE SPECIALTIES BENTO GRID (21st.dev Style) */}
      <section className="space-y-6">
        <Box className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <Box>
            <Box className="flex items-center gap-2 mb-1">
              <span className="h-px w-6 bg-(--app-primary)" />
              <Typography className="text-[11px] font-bold uppercase tracking-widest text-(--app-primary)">
                Explore Categories
              </Typography>
            </Box>
            <Typography className="font-editorial text-2xl sm:text-4xl font-bold text-(--app-text)">
              Curated Treatment Specialties
            </Typography>
            <Typography className="text-xs sm:text-sm text-(--app-muted) mt-1">
              Select a specialty to explore treatments, durations, and pricing
            </Typography>
          </Box>
          <Button
            onClick={() => navigate("/services")}
            endIcon={<ArrowForwardIcon className="text-[14px]" />}
            className="font-bold text-xs text-(--app-primary) normal-case self-start sm:self-auto hover:bg-(--app-primary-soft) rounded-full px-4 py-2"
          >
            All Categories ({rootServices.length} Treatments)
          </Button>
        </Box>

        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {bentoCategories.map((cat) => {
            const Icon = cat.IconComponent;
            return (
              <Box
                key={cat.id}
                onClick={() => navigate(`/services?category=${cat.id}`)}
                className="group relative p-6 rounded-3xl border border-(--app-border) bg-(--app-surface) hover:border-(--app-primary)/60 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative background accent on hover */}
                <Box className="absolute top-0 right-0 w-24 h-24 rounded-full bg-(--app-primary)/5 blur-2xl group-hover:scale-150 transition-transform duration-500" />

                <Box className="space-y-4">
                  <Box className="w-12 h-12 rounded-2xl bg-(--app-surface-alt) group-hover:bg-(--app-primary) text-(--app-primary) group-hover:text-(--app-primary-contrast) flex items-center justify-center transition-all duration-300 shadow-2xs">
                    <Icon className="text-[24px]" />
                  </Box>

                  <Box>
                    <Typography className="font-editorial text-lg font-bold text-(--app-text) group-hover:text-(--app-primary) transition-colors">
                      {cat.label}
                    </Typography>
                    <Typography className="text-xs text-(--app-muted) mt-1 leading-relaxed line-clamp-2">
                      {cat.description}
                    </Typography>
                  </Box>
                </Box>

                <Box className="mt-6 pt-4 border-t border-(--app-border) flex items-center justify-between">
                  <span className="text-xs font-extrabold text-(--app-text)">
                    {cat.minPrice > 0 ? `From ₹${cat.minPrice}` : `${cat.count} Treatments`}
                  </span>
                  <Box className="w-8 h-8 rounded-full bg-(--app-surface-alt) group-hover:bg-(--app-primary) group-hover:text-(--app-primary-contrast) flex items-center justify-center transition-all">
                    <ArrowForwardIcon className="text-[14px]" />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </section>

      {/* 3. SIGNATURE TREATMENTS SHOWCASE */}
      {featuredServices.length > 0 && (
        <section className="space-y-6">
          <Box className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <Box>
              <Box className="flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-(--app-primary)" />
                <Typography className="text-[11px] font-bold uppercase tracking-widest text-(--app-primary)">
                  Handcrafted Rituals
                </Typography>
              </Box>
              <Typography className="font-editorial text-2xl sm:text-4xl font-bold text-(--app-text)">
                Signature Treatments
              </Typography>
              <Typography className="text-xs sm:text-sm text-(--app-muted) mt-1">
                Our most requested bespoke experiences, customized for your wellness
              </Typography>
            </Box>
            <Button
              onClick={() => navigate("/services")}
              endIcon={<ArrowForwardIcon className="text-[14px]" />}
              className="font-bold text-xs text-(--app-primary) normal-case self-start sm:self-auto hover:bg-(--app-primary-soft) rounded-full px-4 py-2"
            >
              View Full Menu ({rootServices.length})
            </Button>
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service: any, idx: number) => (
              <Box
                key={service.uuid || service.id}
                className="group p-6 sm:p-7 rounded-3xl border border-(--app-border) bg-(--app-surface) hover:border-(--app-primary)/50 hover:shadow-[0_20px_45px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <Box className="space-y-3">
                  <Box className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-(--app-surface-alt) text-(--app-muted)">
                      {idx === 0 ? "★ Popular Choice" : "Signature Treatment"}
                    </span>
                    <span className="text-sm font-black text-(--app-primary) bg-(--app-primary-soft) px-3 py-1 rounded-full">
                      {service.price_type === "from" ? `From ₹${service.price}` : `₹${service.price}`}
                    </span>
                  </Box>

                  <Typography className="font-editorial text-xl font-bold text-(--app-text) group-hover:text-(--app-primary) transition-colors leading-snug">
                    {service.name}
                  </Typography>

                  {service.description && (
                    <Typography className="text-xs text-(--app-muted) leading-relaxed line-clamp-2">
                      {service.description}
                    </Typography>
                  )}

                  <Box className="flex items-center gap-3 text-xs text-(--app-muted) pt-2">
                    <Box className="flex items-center gap-1">
                      <AccessTimeIcon className="text-[14px] text-(--app-primary)" />
                      <span>{service.duration} mins</span>
                    </Box>
                    {service.gender && (
                      <span className="capitalize">• {service.gender}</span>
                    )}
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="small"
                  onClick={() => navigate(`/services?search=${encodeURIComponent(service.name)}`)}
                  endIcon={<ArrowForwardIcon className="text-[14px]" />}
                  className="mt-6 rounded-2xl py-2.5 text-xs font-bold bg-(--app-surface-alt) text-(--app-text) hover:bg-(--app-primary) hover:text-(--app-primary-contrast) transition-all shadow-none normal-case"
                >
                  Reserve Treatment
                </Button>
              </Box>
            ))}
          </Box>
        </section>
      )}

      {/* 4. THE ATELIER EXPERIENCE / WHY CHOOSE US (Refero & MotionSites Vibe) */}
      <section className="relative rounded-[2.5rem] bg-linear-to-b from-(--app-surface-alt)/70 to-(--app-surface) border border-(--app-border) p-8 sm:p-12 lg:p-16">
        <Box className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <Typography className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--app-primary)">
            The ZenMonk Standard
          </Typography>
          <Typography className="font-editorial text-2xl sm:text-4xl font-bold text-(--app-text)">
            Why Clients Trust {salon?.name}
          </Typography>
          <Typography className="text-xs sm:text-sm text-(--app-muted)">
            Elevating your grooming and wellness with uncompromising standards of hygiene and care
          </Typography>
        </Box>

        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Box className="p-6 rounded-3xl bg-(--app-surface) border border-(--app-border) space-y-3 shadow-xs">
            <Box className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <BoltIcon className="text-[22px]" />
            </Box>
            <Typography className="font-bold text-sm text-(--app-text)">
              Zero Wait Guarantee
            </Typography>
            <Typography className="text-xs text-(--app-muted) leading-relaxed">
              Your appointment time is locked in real-time. No crowded waiting lounges or overlapping slots.
            </Typography>
          </Box>

          <Box className="p-6 rounded-3xl bg-(--app-surface) border border-(--app-border) space-y-3 shadow-xs">
            <Box className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <WorkspacePremiumOutlinedIcon className="text-[22px]" />
            </Box>
            <Typography className="font-bold text-sm text-(--app-text)">
              Master Specialists
            </Typography>
            <Typography className="text-xs text-(--app-muted) leading-relaxed">
              Every stylist and esthetician undergoes rigorous skill assessments and personal consultation training.
            </Typography>
          </Box>

          <Box className="p-6 rounded-3xl bg-(--app-surface) border border-(--app-border) space-y-3 shadow-xs">
            <Box className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
              <SpaOutlinedIcon className="text-[22px]" />
            </Box>
            <Typography className="font-bold text-sm text-(--app-text)">
              Clean Formulations
            </Typography>
            <Typography className="text-xs text-(--app-muted) leading-relaxed">
              Dermatologically validated, premium salon-grade botanicals crafted for skin vitality.
            </Typography>
          </Box>

          <Box className="p-6 rounded-3xl bg-(--app-surface) border border-(--app-border) space-y-3 shadow-xs">
            <Box className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <CheckCircleOutlineIcon className="text-[22px]" />
            </Box>
            <Typography className="font-bold text-sm text-(--app-text)">
              Transparent Pricing
            </Typography>
            <Typography className="text-xs text-(--app-muted) leading-relaxed">
              Honest menu prices with clear duration. Pay online securely or upon service completion at venue.
            </Typography>
          </Box>
        </Box>
      </section>

      {/* 5. MASTER SPECIALISTS SPOTLIGHT */}
      {featuredStaff.length > 0 && (
        <section className="space-y-6">
          <Box className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <Box>
              <Box className="flex items-center gap-2 mb-1">
                <span className="h-px w-6 bg-(--app-primary)" />
                <Typography className="text-[11px] font-bold uppercase tracking-widest text-(--app-primary)">
                  Artisans & Stylists
                </Typography>
              </Box>
              <Typography className="font-editorial text-2xl sm:text-4xl font-bold text-(--app-text)">
                Meet Master Specialists
              </Typography>
              <Typography className="text-xs sm:text-sm text-(--app-muted) mt-1">
                Personalized consultations tailored to your face structure, hair texture, and lifestyle
              </Typography>
            </Box>
            <Button
              onClick={() => navigate("/specialists")}
              endIcon={<ArrowForwardIcon className="text-[14px]" />}
              className="font-bold text-xs text-(--app-primary) normal-case self-start sm:self-auto hover:bg-(--app-primary-soft) rounded-full px-4 py-2"
            >
              All Specialists ({staff.length})
            </Button>
          </Box>

          <Box className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {featuredStaff.map((member: any) => {
              const fullName = `${member.first_name || ""} ${member.last_name || ""}`.trim();
              const photo = member.photos?.secure_url ?? member.photos?.url;

              return (
                <Box
                  key={member.uuid || member.id}
                  onClick={() => navigate("/specialists")}
                  className="group p-5 sm:p-6 rounded-3xl border border-(--app-border) bg-(--app-surface) text-center flex flex-col items-center gap-3 cursor-pointer hover:border-(--app-primary)/50 hover:shadow-lg transition-all duration-300"
                >
                  <Box className="relative">
                    <Avatar
                      src={photo}
                      alt={fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-(--app-border) object-cover bg-(--app-surface-alt) group-hover:ring-3 group-hover:ring-(--app-primary) transition-all"
                    >
                      {member.first_name?.[0] || "S"}
                    </Avatar>
                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-(--app-surface)" />
                  </Box>
                  <Box className="min-w-0 w-full">
                    <Typography className="font-bold text-xs sm:text-sm text-(--app-text) truncate group-hover:text-(--app-primary) transition-colors">
                      {fullName || "Specialist"}
                    </Typography>
                    <Typography className="text-[11px] text-(--app-muted) truncate capitalize mt-0.5">
                      {member.title || member.role || "Senior Stylist"}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </section>
      )}

      {/* 6. STUDIO AMBIENCE & GALLERY */}
      {photos.length > 0 && (
        <section className="space-y-4">
          <Box className="space-y-1">
            <Typography className="text-[11px] font-bold uppercase tracking-widest text-(--app-primary)">
              Studio Aesthetics
            </Typography>
            <Typography className="font-editorial text-2xl sm:text-4xl font-bold text-(--app-text)">
              The Atelier Ambience
            </Typography>
          </Box>
          <StorefrontGallery photos={photos} />
        </section>
      )}

      {/* 7. LIVE HOURS & VENUE LOCATION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hours Card */}
        <Box className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border border-(--app-border) bg-(--app-surface) space-y-4">
          <Box className="flex items-center gap-2">
            <CalendarTodayOutlinedIcon className="text-(--app-primary) text-[20px]" />
            <Typography className="font-editorial text-lg sm:text-xl font-bold text-(--app-text)">
              Working Hours
            </Typography>
          </Box>
          <Box className="space-y-2 pt-2">
            {daysOfWeek.map((day) => {
              const isToday = day === currentDayKey;
              const raw = salon?.business_hours?.[day] ?? salon?.business_hours?.[day.slice(0, 3)];
              let hoursStr = "09:00 AM - 08:00 PM";
              if (raw) {
                if (typeof raw === "string") hoursStr = raw;
                else if (raw.is_closed) hoursStr = "Closed";
                else hoursStr = `${raw.start_time || raw.open || "09:00 AM"} - ${raw.end_time || raw.close || "08:00 PM"}`;
              }

              return (
                <Box
                  key={day}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs font-semibold ${
                    isToday ? "bg-(--app-primary-soft) text-(--app-primary)" : "text-(--app-text)"
                  }`}
                >
                  <span className="capitalize flex items-center gap-2">
                    {isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {day}
                  </span>
                  <span className={isToday ? "font-extrabold" : "text-(--app-muted)"}>
                    {hoursStr}
                  </span>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Location & Contact Card */}
        <Box className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border border-(--app-border) bg-(--app-surface) flex flex-col justify-between space-y-6">
          <Box className="space-y-4">
            <Box className="flex items-center gap-2">
              <LocationOnOutlinedIcon className="text-(--app-primary) text-[22px]" />
              <Typography className="font-editorial text-lg sm:text-xl font-bold text-(--app-text)">
                Location & Venue
              </Typography>
            </Box>
            <Typography className="text-sm text-(--app-text) font-semibold leading-relaxed">
              {salon?.address || "Address available upon booking"}
            </Typography>
            {salon?.phone && (
              <Box className="flex items-center gap-2 text-xs text-(--app-muted)">
                <PhoneOutlinedIcon className="text-[16px] text-(--app-primary)" />
                <span>Concierge: {salon.phone}</span>
              </Box>
            )}
            <Typography className="text-xs text-(--app-muted) leading-relaxed">
              Free parking available for salon guests. Please arrive 10 minutes prior to your scheduled consultation.
            </Typography>
          </Box>

          <Box className="flex flex-wrap items-center gap-3 pt-4 border-t border-(--app-border)">
            {salon?.map_link && (
              <Button
                component="a"
                href={salon.map_link}
                target="_blank"
                rel="noreferrer"
                variant="contained"
                startIcon={<NorthEastIcon className="text-[14px]" />}
                className="rounded-full px-5 py-2.5 text-xs font-bold bg-(--app-primary) text-(--app-primary-contrast) normal-case shadow-none"
              >
                Open in Google Maps
              </Button>
            )}
            {salon?.phone && (
              <Button
                component="a"
                href={`tel:${salon.phone}`}
                variant="outlined"
                startIcon={<PhoneOutlinedIcon className="text-[14px]" />}
                className="rounded-full px-5 py-2.5 text-xs font-bold border-(--app-border) text-(--app-text) normal-case"
              >
                Call Concierge
              </Button>
            )}
          </Box>
        </Box>
      </section>

      {/* 8. VIP RESERVATION CALL-TO-ACTION BANNER */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-slate-900 via-neutral-900 to-emerald-950 text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
        <Box className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <Box className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-300">
            <AutoAwesomeOutlinedIcon className="text-[14px]" />
            Personalized Salon Experience
          </span>
          <Typography className="font-editorial text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Ready to elevate your personal care?
          </Typography>
          <Typography className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-lg">
            Reserve your bespoke appointment online with real-time confirmation. Select your preferred specialist, view clear pricing, and enjoy zero wait times.
          </Typography>
          <Box className="pt-4 flex flex-wrap items-center gap-4">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/services")}
              endIcon={<ArrowForwardIcon className="text-[16px]" />}
              className="rounded-full px-8 py-3.5 text-xs sm:text-sm font-black bg-white text-black hover:bg-white/90 shadow-xl normal-case"
            >
              Reserve an Appointment
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/specialists")}
              className="rounded-full px-6 py-3.5 text-xs sm:text-sm font-bold border-white/30 text-white hover:bg-white/10 normal-case"
            >
              Meet the Team
            </Button>
          </Box>
        </Box>
      </section>
    </Box>
  );
}

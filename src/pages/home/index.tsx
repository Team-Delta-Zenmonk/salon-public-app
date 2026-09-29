import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Button, Avatar } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { calculateTotals } from "../../common/cart.utils";

export default function HomePage() {
  const navigate = useStorefrontNavigate();
  const dispatch = useAppDispatch();
  const { salon } = useStorefront();

  const services: any[] = salon?.services || [];
  const staff: any[] = salon?.staff || [];
  const photos: any[] = salon?.photos || [];

  const cart = useAppSelector((state) => state.cart);
  const { isAuthenticated, customer } = useAppSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [addingItemIds, setAddingItemIds] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const fallbackPhotos = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDg4fWQGY7q01kQEu7Azo-ZxML-xjADF9Algitpt7Ou5sct21_1ua4IwDBx4jGE1pKbAzk6X4b7Tc3z055WSJ-jWOYfOUxzhwKfGYwhm6m4_IHkLoBbjPFJiXN8PaaPHxG56I1j5s0IwbflHjDOE3nSfXTxCTCukrnB2J2fhzv7PJVD2Cvoap0pFNZB9Ju8Jito4BmDcyjiVxQt9eMTS3aoL8UFBE7oamYkIWM52o4E00IFOp6Ie-skBv75NSxqd3h6gB6P_J4FHEU",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAFMkai6tqROm_DonJ_7nSmEjMzHFcmPJmUMfjP1sVIpqOtPImAtz70lBJCodNCeDqojEQm4L1jcmAdG3RqYu-Sgtqtbrr2FSquSgP5if7Vyz2sRcyzD9DJ8C19QuCSwqfDmaVWJgEPWTlB7YSjFEEgrHUdIAMqlagl_kBx8qXcgLQ0dWeWMqILJo5yCvRfa_Zyj8wdnuNZRiE3x0Dii-W70sbseI2Ozcm6paYV-LffI7W_QHG1Tl5H70D0-iV2HhWI9l_EyZdZvA4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCrw5TTPmKj4iyxLRJcfvYzsFy0Is8HDNZX88J0zbU17I2S5PfH8IJe9mM5LMYSJUJ8h9yIUzxv9-xSoZtrvPUnqiBtZ0rdCNqzmUXephKg8iOIOA-PJz9Y5ZEcNCzRdQ3euTyBVjoc-ZnRCr62fTqc3xjU3S0-Mp_n8P4116iDauWQYLlvDL6Oxx1FHl3BDFFeK38FvLfGRC-iVB47xq8P2bPbGLwimA7bZf6Oxg3tIO-N3DinnhUdsZcVqi7FGIWBtdNowsqgES4",
  ];

  const galleryImages = useMemo(() => {
    const urls = photos.map((p) => p?.secure_url || p?.url).filter(Boolean);
    return urls.length > 0 ? urls : fallbackPhotos;
  }, [photos]);

  useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const rootServices = useMemo(() => services.filter((s: any) => s.parent_id === null), [services]);
  const salonCategories: any[] = salon?.categories || [];

  const categorySanctuaries = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "all", label: "All Services" }];
    const seen = new Set<string>();

    salonCategories.forEach((cat) => {
      if (cat.name && !seen.has(cat.name.toLowerCase())) {
        seen.add(cat.name.toLowerCase());
        list.push({ id: String(cat.id || cat.uuid || cat.name).toLowerCase(), label: cat.name });
      }
    });

    services.forEach((s) => {
      if (s.category?.name && !seen.has(s.category.name.toLowerCase())) {
        seen.add(s.category.name.toLowerCase());
        list.push({ id: s.category.name.toLowerCase(), label: s.category.name });
      }
    });

    return list;
  }, [salonCategories, services]);

  const isAdded = (serviceId: string) =>
    cart.items.some((i: any) => i.service?.uuid === serviceId || i.service_id === serviceId);


  const filteredServices = useMemo(() => {
    return rootServices.filter((s) => {
      if (selectedGender !== "all") {
        const sg = s.gender?.toLowerCase() || "unisex";
        if (sg !== "unisex" && sg !== selectedGender) return false;
      }
      if (selectedCategory !== "all") {
        const catName = s.category?.name?.toLowerCase() || "";
        const catId = String(s.category?.id || s.category_id || "").toLowerCase();
        if (selectedCategory !== catName && selectedCategory !== catId && !catName.includes(selectedCategory)) {
          return false;
        }
      }
      return true;
    });
  }, [rootServices, selectedGender, selectedCategory]);

  const { totalPrice } = calculateTotals(cart.items);

  const heroPhoto =
    typeof photos[0] === "string" ? photos[0] : photos[0]?.secure_url || photos[0]?.url;

  return (
    <Box className="space-y-16 pb-36 text-[var(--app-text)]">
      {/* 1. HERO BANNER & EDITORIAL SHOWCASE (Stitch 1:1 Spec) */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-8 px-4 md:px-12 max-w-[1440px] mx-auto w-full">
        {/* Ambient Backdrop Lights */}
        <Box className="absolute -top-32 -left-32 w-96 h-96 rounded-full /20 blur-3xl pointer-events-none" />
        <Box className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full /10 blur-[120px] pointer-events-none" />

        <Box className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          {/* Left Column: Copy & Value Proposition */}
          <Box className="lg:col-span-6 flex flex-col items-start gap-5">
            {/* Glow Subtitle Badge */}
            <Box className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--app-primary-soft)] border border-[var(--app-primary)]/40 text-[var(--app-primary)] text-[10px] font-bold uppercase tracking-widest">
                <AutoAwesomeOutlinedIcon className="text-[14px]" />
                FLAGSHIP SANCTUARY & ATELIER
              </span>
            </Box>

            {/* Main Editorial Headline */}
            <Typography
              component="h1"
              className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-[var(--app-text)] leading-[1.1] tracking-tight"
            >
              Precision Craft, <br />
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[var(--app-primary)] to-[var(--app-primary)]">
                Sculpted Silhouettes
              </span>{" "}
              <br />
              & Avant-Garde Beauty
            </Typography>

            <Typography className="text-base sm:text-lg text-[var(--app-muted)] max-w-xl leading-relaxed">
              {salon?.about ||
                "An intimate, sanctuary-level atelier where master scissorsmiths and clinical facialists transform the sensory ritual of luxury grooming into contemporary art."}
            </Typography>

            {/* Live Status Tag */}
            <Box className="flex items-center gap-3 py-2 px-3.5 rounded-lg bg-[var(--app-surface-alt)] panel-rim">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Typography className="text-xs font-semibold text-[var(--app-text)]">
                Open Today
              </Typography>
            </Box>

            {/* CTA Buttons */}
            <Box className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                component="a"
                href="#services-matrix"
                variant="contained"
                endIcon={<ArrowDownwardIcon className="text-[18px]" />}
                className="px-6 py-3 rounded-lg text-xs font-bold crimson-glow hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[var(--app-primary)]/20 normal-case border-0"
              >
                Explore Service Menu
              </Button>
              <Button
                onClick={() => navigate("/specialists")}
                variant="outlined"
              >
                Meet Resident Stylists
              </Button>
            </Box>
          </Box>

          {/* Right Column: Split Luxury Salon Gallery Bento with image shifting */}
          <Box className="lg:col-span-6 grid grid-cols-2 gap-4">
            {/* Showcase Tile 1: Main Tall Box */}
            <Box className="group relative rounded-xl overflow-hidden panel-rim bg-[var(--app-surface-alt)] aspect-[4/5] row-span-2 shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              {galleryImages.map((imgUrl: string, idx: number) => {
                const isVisible = idx === carouselIndex % galleryImages.length;
                return (
                  <img
                    key={`bento-1-${imgUrl}`}
                    alt="Sanctuary Showcase 1"
                    src={imgUrl}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
                      isVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  />
                );
              })}
              <Box className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/20 to-transparent z-10 pointer-events-none" />
              <Box className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                <span className="text-[11px] font-bold text-[var(--app-primary)] uppercase tracking-widest block">
                  Haute Atelier
                </span>
                <Typography className="font-editorial text-lg text-[var(--app-text)] font-semibold mt-0.5 capitalize">
                  {salon?.name || "Sanctuary Ambience"}
                </Typography>
                <Typography className="text-xs text-[#f6dce3] mt-1">
                  Bespoke hair sculpture & precision design
                </Typography>
              </Box>
            </Box>

            {/* Showcase Tile 2: Top Right Square Box */}
            <Box className="group relative rounded-xl overflow-hidden panel-rim bg-[var(--app-surface-alt)] aspect-square shadow-xl transition-all duration-300 hover:scale-[1.01]">
              {galleryImages.map((imgUrl: string, idx: number) => {
                const isVisible = idx === (carouselIndex + 1) % galleryImages.length;
                return (
                  <img
                    key={`bento-2-${imgUrl}`}
                    alt="Sanctuary Showcase 2"
                    src={imgUrl}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
                      isVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  />
                );
              })}
              <Box className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/30 to-transparent z-10 pointer-events-none" />
              <Box className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
                <span className="text-[10px] font-bold text-[var(--app-primary)] uppercase tracking-widest block">
                  Clinical Dermal
                </span>
                <Typography className="font-editorial text-sm text-[var(--app-text)] font-semibold leading-tight">
                  Hydro-dermal therapy
                </Typography>
              </Box>
            </Box>

            {/* Showcase Tile 3: Bottom Right Square Box */}
            <Box className="group relative rounded-xl overflow-hidden panel-rim bg-[var(--app-surface-alt)] aspect-square shadow-xl transition-all duration-300 hover:scale-[1.01]">
              {galleryImages.map((imgUrl: string, idx: number) => {
                const isVisible = idx === (carouselIndex + 2) % galleryImages.length;
                return (
                  <img
                    key={`bento-3-${imgUrl}`}
                    alt="Sanctuary Showcase 3"
                    src={imgUrl}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out group-hover:scale-105 ${
                      isVisible ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  />
                );
              })}
              <Box className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/30 to-transparent z-10 pointer-events-none" />
              <Box className="absolute bottom-3 left-3 right-3 z-20 pointer-events-none">
                <span className="text-[10px] font-bold text-[var(--app-primary)] uppercase tracking-widest block">
                  Botanical Rituals
                </span>
                <Typography className="font-editorial text-sm text-[var(--app-text)] font-semibold leading-tight">
                  Sensory botanical rinse
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </section>

      {/* 2. SERVICES GRID & FILTER SYSTEM (Stitch 1:1 Spec) */}
      <section className="px-4 md:px-12 max-w-[1440px] mx-auto w-full py-10" id="services-matrix">
        {/* Section Header */}
        <Box className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[var(--app-border)]/30 pb-6">
          <Box>
            <Box className="flex items-center gap-2 text-[var(--app-primary)] text-[11px] font-bold tracking-widest uppercase mb-1">
              <ContentCutOutlinedIcon className="text-[16px]" />
              Bespoke Sanctuary Ceremonies
            </Box>
            <Typography className="font-editorial text-3xl sm:text-5xl font-bold text-[var(--app-text)]">
              Curated Treatment Menu
            </Typography>
          </Box>
          <Typography className="text-xs sm:text-sm text-[var(--app-muted)] max-w-md">
            Select tailored sessions formulated with botanical actives, French glazes, and surgical-grade styling implements.
          </Typography>
        </Box>

        {/* Category Tabs (Dynamic from Backend) */}
        <Box className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-[var(--app-border)]/20 mb-6 [scrollbar-width:none]">
          {categorySanctuaries.map((cat) => {
            const isSel = selectedCategory === cat.id;
            const tabClass = isSel
              ? "px-5 py-2 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all bg-[var(--app-surface-alt)] text-[var(--app-text)] border border-[var(--app-primary)]/50 shadow-sm capitalize"
              : "px-5 py-2 rounded-full text-xs font-semibold shrink-0 cursor-pointer transition-all bg-[var(--app-surface-alt)] text-[var(--app-muted)] hover:text-[var(--app-primary)] capitalize";

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={tabClass}
              >
                {cat.label}
              </button>
            );
          })}
        </Box>

        {/* Sub-Filter Bar (Gender Segmentation) */}
        <Box className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <Box className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[var(--app-muted)] uppercase mr-2">Client Focus:</span>
            {[
              { id: "all", label: "All" },
              { id: "female", label: "Female" },
              { id: "male", label: "Male" },
              { id: "unisex", label: "Unisex" },
            ].map((g) => {
              const isSel = selectedGender === g.id;
              const genderClass = isSel
                ? "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-[var(--app-primary)] text-white"
                : "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer bg-[var(--app-surface-alt)] text-[var(--app-muted)] hover:text-[var(--app-text)] hover:bg-[var(--app-surface-alt)]";

              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGender(g.id)}
                  className={genderClass}
                >
                  {g.label}
                </button>
              );
            })}
          </Box>
          <Box className="text-[var(--app-muted)] text-xs flex items-center gap-1.5">
            <VerifiedOutlinedIcon className="text-[16px] text-emerald-400" />
            <span>All rituals include complimentary botanical sensory rinse</span>
          </Box>
        </Box>

        {/* Treatment Cards Grid */}
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => {
            const added = isAdded(service.uuid);
            const assignedStaff = staff[0];
            const staffName = assignedStaff
              ? `${assignedStaff.first_name || ""} ${assignedStaff.last_name || ""}`.trim()
              : "";

            const btnClass = "px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[var(--app-primary)]/20 transition-all active:scale-95 normal-case border-0 bg-[var(--app-primary)] text-white hover:brightness-110";

            return (
              <Box
                key={service.uuid || service.id}
                className="group bg-[var(--app-surface-alt)] rounded-xl panel-rim p-6 flex flex-col justify-between crimson-border-hover transition-all duration-300 shadow-xl relative overflow-hidden"
              >
                <Box className="absolute top-0 right-0 w-28 h-28 /5 rounded-full blur-xl pointer-events-none" />
                <Box className="space-y-4">
                  <Box className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded /30 border border-[var(--app-primary)] text-[10px] font-bold uppercase">
                      {service.gender || "Unisex"} Focus
                    </span>
                  </Box>

                  <Typography className="font-editorial text-xl font-semibold text-[var(--app-text)] group-hover:text-[var(--app-primary)] transition-colors leading-snug capitalize">
                    {service.name}
                  </Typography>

                  <Typography className="text-xs text-[var(--app-muted)] leading-relaxed line-clamp-2 capitalize">
                    {service.description ||
                      "Bespoke dry shears tailored to cranial geometry, finished with Japanese camellia heat therapy and an architectural movement blowout."}
                  </Typography>

                  {/* Metrics: Duration & Stylist */}
                  <Box className="flex items-center gap-4 py-2.5 px-3 rounded-lg bg-[var(--app-surface-alt)] border border-[var(--app-border)]/20">
                    <Box className="flex items-center gap-1.5 text-[var(--app-muted)] text-xs">
                      <ScheduleOutlinedIcon className="text-[18px] text-[var(--app-primary)]" />
                      <span>{service.duration || 60} Min</span>
                    </Box>
                    <Box className="h-3 w-px bg-[var(--app-border)]/30" />
                    {assignedStaff && (
                      <Box className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="w-6 h-6 rounded-full /20 font-bold text-[10px] capitalize">
                          {staffName[0]}
                        </Avatar>
                        <Box className="flex-1 truncate">
                          <Typography className="text-[11px] font-bold text-[var(--app-text)] truncate capitalize">
                            {staffName}
                          </Typography>
                          <Typography className="text-[9px] text-[#f6dce3] leading-none capitalize">
                            {assignedStaff.role || "Stylist"}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>

                {/* Footer Action & Price */}
                <Box className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--app-border)]/20">
                  <Box>
                    <span className="text-[10px] text-[var(--app-muted)] block uppercase font-semibold">
                      Investment Tier
                    </span>
                    <span className="font-editorial text-xl text-[var(--app-text)] font-bold">
                      ₹{service.price}
                    </span>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => navigate("/services")}
                    className={btnClass}
                  >
                    {"Book Now"}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </section>

      {/* 3. FLOATING ACTIVE RESERVATION ALERT BAR (Stitch BottomNavBar Spec) */}
      {cart.items.length > 0 && (
        <aside className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col md:flex-row items-center justify-between px-6 py-3.5 w-[calc(100%-2.5rem)] max-w-4xl bg-[var(--app-surface-alt)] rounded-xl border border-[var(--app-border)]/40 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,43,78,0.15)] backdrop-blur-lg">
          <Box className="flex items-center gap-3 w-full md:w-auto mb-2 md:mb-0">
            <Box className="w-10 h-10 rounded-lg bg-[var(--app-surface-alt)] border border-[var(--app-primary)]/40 flex items-center justify-center text-[var(--app-primary)] shrink-0 shadow-inner">
              <ShoppingBagOutlinedIcon className="text-[22px]" />
            </Box>
            <Box className="flex flex-col">
              <Box className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[var(--app-primary)] tracking-wider uppercase">
                  Active Reservation
                </span>
                <span className="h-1.5 w-1.5 rounded-full" />
                <span className="text-[11px] text-[#f6dce3] font-medium">
                  {cart.items.length} Treatment{cart.items.length > 1 ? "s" : ""} Selected
                </span>
              </Box>
              <Typography className="text-xs text-[var(--app-text)] font-semibold truncate max-w-md capitalize">
                {cart.items[0]?.name || "Service Selected"}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/cart")}
            endIcon={<ArrowForwardIcon className="text-[18px]" />}
            className="w-full md:w-auto rounded-lg px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[var(--app-primary)]/20 hover:brightness-110 active:scale-[0.99] transition-all normal-case border-0"
          >
            Instant Checkout ({cart.items.length} Items • ₹{totalPrice})
          </Button>
        </aside>
      )}
    </Box>
  );
}

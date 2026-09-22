import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import ServiceCard from "../storefront/_components/storefront-services/_components/service-card";
import StorefrontBasket from "../storefront/_components/storefront-basket";
import { useSearchParams } from "react-router-dom";
import { PREDEFINED_CATEGORIES } from "../../common/predefined-categories";

export default function ServicesPage() {
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get("search");
    if (q !== null && q !== undefined) setSearchQuery(q);
  }, [searchParams]);

  const services: any[] = salon?.services || [];
  const salonCategories: any[] = salon?.categories || [];

  const rootServices = useMemo(() => services.filter((s) => s.parent_id === null), [services]);

  const subServicesMap = useMemo(() => {
    return services.reduce<Record<number, any[]>>((acc, s) => {
      if (s.parent_id) {
        acc[s.parent_id] = acc[s.parent_id] || [];
        acc[s.parent_id].push(s);
      }
      return acc;
    }, {});
  }, [services]);

  // Build categories list blending standard categories and salon's categories with accurate counts
  const categoryOptions = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: "all", label: "All Treatments", count: rootServices.length },
    ];
    const seen = new Set<string>();

    // 1. Add salon's configured categories
    salonCategories.forEach((cat) => {
      if (cat.name && !seen.has(cat.name.toLowerCase())) {
        seen.add(cat.name.toLowerCase());
        const count = rootServices.filter(
          (s) =>
            s.category?.name?.toLowerCase() === cat.name.toLowerCase() ||
            String(s.category?.id || s.category_id) === String(cat.id || cat.uuid)
        ).length;
        list.push({ id: String(cat.id || cat.uuid || cat.name), label: cat.name, count });
      }
    });

    // 2. Add categories present on services
    services.forEach((s) => {
      if (s.category?.name && !seen.has(s.category.name.toLowerCase())) {
        seen.add(s.category.name.toLowerCase());
        const count = rootServices.filter(
          (item) => item.category?.name?.toLowerCase() === s.category.name.toLowerCase()
        ).length;
        list.push({ id: String(s.category.id || s.category.name), label: s.category.name, count });
      }
    });

    // 3. Add predefined industry categories from management app if they match any services
    PREDEFINED_CATEGORIES.forEach((pre) => {
      const matchingServices = rootServices.filter(
        (s) =>
          s.category?.name?.toLowerCase() === pre.name.toLowerCase() ||
          s.name?.toLowerCase().includes(pre.name.toLowerCase())
      );
      if (matchingServices.length > 0 && !seen.has(pre.name.toLowerCase())) {
        seen.add(pre.name.toLowerCase());
        list.push({ id: pre.name.toLowerCase(), label: pre.name, count: matchingServices.length });
      }
    });

    return list;
  }, [salonCategories, services, rootServices]);

  const genderOptions = [
    { id: "all", label: "All" },
    { id: "female", label: "Women" },
    { id: "male", label: "Men" },
    { id: "unisex", label: "Unisex" },
  ];

  // Filter root services based on search, category, and gender
  const filteredRootServices = useMemo(() => {
    return rootServices.filter((service) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = service.name?.toLowerCase().includes(q);
        const matchesDesc = service.description?.toLowerCase().includes(q);

        const subs = subServicesMap[service.id] || [];
        const matchesSub = subs.some(
          (sub) => sub.name?.toLowerCase().includes(q) || sub.description?.toLowerCase().includes(q)
        );

        if (!matchesName && !matchesDesc && !matchesSub) return false;
      }

      // 2. Gender Filter
      if (selectedGender !== "all") {
        const sg = service.gender?.toLowerCase() || "unisex";
        if (sg !== "unisex" && sg !== selectedGender) return false;
      }

      // 3. Category Filter
      if (selectedCategory !== "all") {
        const serviceCatName = service.category?.name?.toLowerCase() || "";
        const serviceCatId = String(service.category?.id || service.category_id || "");
        const target = selectedCategory.toLowerCase();

        const matchesDirect = serviceCatName === target || serviceCatId === target;
        const matchesFuzzy = service.name?.toLowerCase().includes(target);

        if (!matchesDirect && !matchesFuzzy) return false;
      }

      return true;
    });
  }, [rootServices, searchQuery, selectedGender, selectedCategory, subServicesMap]);

  return (
    <Box className="space-y-4">
      {/* Editorial Header Section (Stitch Screen 2 Reference) */}
      <Box className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-(--app-border)">
        <Box className="space-y-1.5">
          <Box className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <Typography className="text-[11px] font-bold text-(--app-primary) tracking-widest uppercase">
              Curated Treatment Menu
            </Typography>
          </Box>
          <Typography className="font-editorial text-2xl sm:text-4xl font-bold text-(--app-text) tracking-tight">
            Rituals, Therapies & Artistry
          </Typography>
          <Typography className="text-xs sm:text-sm text-(--app-muted) max-w-xl leading-relaxed">
            Every service is individualized to your hair, skin, and personal care profile.
          </Typography>
        </Box>

        {/* Quick Trust Badges */}
        <Box className="flex items-center gap-6 self-start md:self-auto bg-(--app-surface-alt) px-5 py-3 rounded-2xl border border-(--app-border)">
          <Box>
            <Typography className="text-[10px] font-bold uppercase tracking-wider text-(--app-muted)">
              Services
            </Typography>
            <Typography className="font-bold text-xs sm:text-sm text-(--app-text)">
              {rootServices.length} Treatments
            </Typography>
          </Box>
          <Box className="h-6 w-px bg-(--app-border)" />
          <Box>
            <Typography className="text-[10px] font-bold uppercase tracking-wider text-(--app-muted)">
              Standard
            </Typography>
            <Box className="flex items-center gap-1 text-(--app-text)">
              <VerifiedOutlinedIcon className="text-emerald-500 text-[14px]" />
              <span className="font-bold text-xs sm:text-sm">Verified</span>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Filter Control Bar: Search & Gender Segmented Toggle */}
      <Box className="space-y-4">
        <Box className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <Box className="lg:col-span-8 relative">
            <TextField
              fullWidth
              size="small"
              placeholder="Search treatments, subservices, and rituals (e.g. Balayage, Facial, Pedicure)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className="text-(--app-muted) text-[20px]" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery("")}>
                        <ClearIcon className="text-[16px]" />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                  className: "rounded-full bg-(--app-surface) text-xs border-(--app-border) py-0.5",
                },
              }}
            />
          </Box>

          {/* Gender Segmented Toggle (Stitch Style) */}
          <Box className="lg:col-span-4 flex items-center justify-start lg:justify-end">
            <Box className="inline-flex p-1 rounded-full bg-(--app-surface-alt) border border-(--app-border)">
              {genderOptions.map((g) => {
                const isSelected = selectedGender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGender(g.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "bg-(--app-primary) text-(--app-primary-contrast) shadow-xs"
                        : "text-(--app-muted) hover:text-(--app-text)"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </Box>
          </Box>
        </Box>

        {/* Horizontal Scrollable Category Rail with Count Pills */}
        <Box className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoryOptions.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full font-bold text-xs shadow-xs transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-(--app-primary) text-(--app-primary-contrast)"
                    : "bg-(--app-surface) text-(--app-text) border border-(--app-border) hover:bg-(--app-surface-alt)"
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-(--app-surface-alt) text-(--app-muted)"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </Box>
      </Box>

      {/* Main Content: 70% Left Services / 30% Right Sticky Basket (Stitch Reference) */}
      <Box className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Services & Subservices */}
        <Box className="lg:col-span-8 flex flex-col gap-6">
          {filteredRootServices.length === 0 ? (
            <Box className="text-center py-16 px-4 rounded-3xl border border-dashed border-(--app-border) bg-(--app-surface)">
              <ContentCutOutlinedIcon className="text-(--app-muted) text-[40px] mb-2" />
              <Typography className="font-bold text-sm text-(--app-text)">
                No treatments match your filters
              </Typography>
              <Typography className="text-xs text-(--app-muted) mt-1 max-w-sm mx-auto">
                Try searching for a different service or reset category filters.
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedGender("all");
                }}
                className="mt-4 rounded-full px-5 py-2 text-xs font-bold text-(--app-primary) normal-case"
              >
                Reset Filters
              </Button>
            </Box>
          ) : (
            filteredRootServices.map((service) => (
              <ServiceCard
                key={service.uuid || service.id}
                service={service}
                subServices={subServicesMap[service.id] || []}
                salon={salon}
              />
            ))
          )}
        </Box>

        {/* Right Sticky Desktop Basket */}
        <Box className="lg:col-span-4 sticky top-20">
          <StorefrontBasket
            salon={salon}
            variant="both"
            onProceed={() => navigate("/cart")}
          />
        </Box>
      </Box>
    </Box>
  );
}

import { useState, useMemo } from "react";
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
import TuneIcon from "@mui/icons-material/Tune";
import ServiceCard from "./_components/service-card";
import StorefrontBasket from "../storefront-basket";

interface StorefrontServicesProps {
  salon: any;
  onProceedToBook: () => void;
}

export default function StorefrontServices({
  salon,
  onProceedToBook,
}: Readonly<StorefrontServicesProps>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");

  const services: any[] = salon?.services || [];
  const categories: any[] = salon?.categories || [];

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

  const categoryOptions = useMemo(() => {
    const list: { id: string; label: string }[] = [{ id: "all", label: "All Treatments" }];
    const seen = new Set<string>();

    categories.forEach((cat) => {
      if (cat.name && !seen.has(cat.name.toLowerCase())) {
        seen.add(cat.name.toLowerCase());
        list.push({ id: String(cat.id || cat.uuid || cat.name), label: cat.name });
      }
    });

    services.forEach((s) => {
      if (s.category?.name && !seen.has(s.category.name.toLowerCase())) {
        seen.add(s.category.name.toLowerCase());
        list.push({ id: String(s.category.id || s.category.name), label: s.category.name });
      }
    });

    return list;
  }, [categories, services]);

  const genderOptions = [
    { id: "all", label: "All Genders" },
    { id: "female", label: "Women" },
    { id: "male", label: "Men" },
    { id: "unisex", label: "Unisex" },
  ];

  const filteredRootServices = useMemo(() => {
    return rootServices.filter((service) => {
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

      if (selectedCategory !== "all") {
        const catId = String(service.category_id || service.category?.id || service.category?.name || "");
        const catName = (service.category?.name || "").toLowerCase();
        const matchesCatId = catId === selectedCategory;
        const matchesCatName = catName === selectedCategory.toLowerCase();

        if (!matchesCatId && !matchesCatName) return false;
      }

      if (selectedGender !== "all") {
        const serviceGender = (service.gender || "unisex").toLowerCase();
        if (serviceGender !== selectedGender && serviceGender !== "unisex") {
          const subs = subServicesMap[service.id] || [];
          const anySubMatches = subs.some(
            (sub) => (sub.gender || "unisex").toLowerCase() === selectedGender || sub.gender === "unisex"
          );
          if (!anySubMatches) return false;
        }
      }

      return true;
    });
  }, [rootServices, subServicesMap, searchQuery, selectedCategory, selectedGender]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedGender("all");
  };

  return (
    <Box className="pb-16">
      <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-4 sm:p-6 mb-6 shadow-[0_10px_26px_rgba(15,23,42,0.05)] space-y-4">
        <Box className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <Box>
            <Typography className="text-xl sm:text-2xl font-black text-(--app-text) tracking-tight">
              Treatments & Services
            </Typography>
            <Typography className="text-xs text-(--app-muted) mt-0.5">
              Select treatments tailored to your lifestyle. Options and sub-services expand with full transparent pricing.
            </Typography>
          </Box>

          <Box className="text-xs font-semibold text-(--app-muted) bg-(--app-surface-alt) px-3 py-1.5 rounded-xl border border-(--app-border) self-start md:self-auto shrink-0">
            {filteredRootServices.length} {filteredRootServices.length === 1 ? "treatment" : "treatments"} available
          </Box>
        </Box>

        <TextField
          fullWidth
          placeholder="Search treatments by name, haircut, balayage, facial..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
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
              className: "rounded-2xl bg-(--app-surface-alt) border-(--app-border) text-xs sm:text-sm",
            },
          }}
        />

        {categoryOptions.length > 1 && (
          <Box className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryOptions.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Chip
                  key={cat.id}
                  label={cat.label}
                  clickable
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`font-bold text-xs h-8 px-2 transition-all shrink-0 rounded-xl ${
                    isActive
                      ? "bg-(--app-primary) text-(--app-primary-contrast) shadow-sm"
                      : "bg-(--app-surface-alt) text-(--app-muted) border border-(--app-border) hover:text-(--app-text)"
                  }`}
                />
              );
            })}
          </Box>
        )}

        <Box className="flex items-center gap-2 pt-1 border-t border-(--app-border)/60 flex-wrap">
          <Typography className="text-[11px] font-bold text-(--app-muted) uppercase tracking-wider mr-1">
            Target:
          </Typography>
          {genderOptions.map((opt) => {
            const isActive = selectedGender === opt.id;
            return (
              <Chip
                key={opt.id}
                label={opt.label}
                size="small"
                clickable
                onClick={() => setSelectedGender(opt.id)}
                className={`font-semibold text-[11px] h-6 px-1 rounded-lg ${
                  isActive
                    ? "bg-(--app-primary-soft) text-(--app-primary) border border-(--app-primary)/30"
                    : "bg-transparent text-(--app-muted) border border-(--app-border) hover:bg-(--app-surface-alt)"
                }`}
              />
            );
          })}
        </Box>
      </Box>

      <Box className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start">
        <Box className="space-y-4">
          {filteredRootServices.length === 0 ? (
            <Box className="rounded-3xl border border-(--app-border) bg-(--app-surface) p-12 text-center">
              <TuneIcon className="text-4xl text-(--app-muted) mb-2 opacity-50" />
              <Typography className="text-base font-bold text-(--app-text)">
                No treatments match your search
              </Typography>
              <Typography className="text-xs text-(--app-muted) mt-1 max-w-sm mx-auto">
                Try adjusting your search terms, changing the category, or resetting filters.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={resetFilters}
                className="mt-4 rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </Button>
            </Box>
          ) : (
            filteredRootServices.map((service) => (
              <ServiceCard
                key={service.uuid}
                service={service}
                subServices={subServicesMap[service.id] || []}
                salon={salon}
              />
            ))
          )}
        </Box>

        <Box className="hidden lg:block self-start">
          <StorefrontBasket salon={salon} variant="desktop-card" onProceed={onProceedToBook} />
        </Box>
      </Box>

      <StorefrontBasket salon={salon} variant="mobile-floating" onProceed={onProceedToBook} />
    </Box>
  );
}

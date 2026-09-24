import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";
import { useStorefront } from "../../providers/storefront-provider";
import ServiceCard from "../storefront/_components/storefront-services/_components/service-card";
import { useSearchParams } from "react-router-dom";

export default function ServicesPage() {
  const navigate = useStorefrontNavigate();
  const { salon } = useStorefront();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("curated");

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

  // Build category sanctuaries list
  const categorySanctuaries = useMemo(() => {
    const list: { id: string; label: string; count: number }[] = [
      { id: "all", label: "All Services", count: rootServices.length },
    ];
    const seen = new Set<string>();

    salonCategories.forEach((cat) => {
      if (cat.name && !seen.has(cat.name.toLowerCase())) {
        seen.add(cat.name.toLowerCase());
        const count = rootServices.filter(
          (s) =>
            s.category?.name?.toLowerCase() === cat.name.toLowerCase() ||
            String(s.category?.id || s.category_id) === String(cat.id || cat.uuid)
        ).length;
        list.push({ id: String(cat.id || cat.uuid || cat.name).toLowerCase(), label: cat.name, count });
      }
    });

    services.forEach((s) => {
      if (s.category?.name && !seen.has(s.category.name.toLowerCase())) {
        seen.add(s.category.name.toLowerCase());
        const count = rootServices.filter(
          (item) => item.category?.name?.toLowerCase() === s.category.name.toLowerCase()
        ).length;
        list.push({ id: s.category.name.toLowerCase(), label: s.category.name, count });
      }
    });

    return list;
  }, [salonCategories, services, rootServices]);

  // Filter root services
  const filteredServices = useMemo(() => {
    let result = rootServices.filter((service) => {
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

      if (selectedGender !== "all") {
        const sg = service.gender?.toLowerCase() || "unisex";
        if (sg !== "unisex" && sg !== selectedGender) return false;
      }

      if (selectedCategory !== "all") {
        const serviceCatName = service.category?.name?.toLowerCase() || "";
        const serviceCatId = String(service.category?.id || service.category_id || "").toLowerCase();
        const target = selectedCategory.toLowerCase();
        const matchesDirect = serviceCatName.includes(target) || serviceCatId.includes(target);
        const matchesFuzzy = service.name?.toLowerCase().includes(target);
        if (!matchesDirect && !matchesFuzzy) return false;
      }

      return true;
    });

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [rootServices, searchQuery, selectedGender, selectedCategory, sortBy, subServicesMap]);

  return (
    <Box className="space-y-6 pb-24 text-[var(--app-text)]">
      {/* HERO / ATELIER CONTEXT BAR (Stitch Spec) */}
      <section className="w-full bg-gradient-to-b from-[var(--app-bg)] via-[var(--app-bg)] to-[var(--app-bg)] border-b border-[var(--app-border)]/20 pt-6 pb-8 px-4 md:px-12 rounded-xl">
        <Box className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Box className="space-y-2">
            <Box className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--app-primary-soft)] border border-[var(--app-primary)]/40 text-[var(--app-primary)] text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" />
                HAUTE APPOINTMENTS OPEN
              </span>
            </Box>
            <Typography className="font-editorial text-3xl sm:text-5xl font-bold text-[var(--app-text)] tracking-tight">
              Salon Services & <span className="italic font-normal text-[var(--app-primary)]">Haute Formulations</span>
            </Typography>
            <Typography className="text-xs sm:text-sm text-[var(--app-muted)] max-w-2xl">
              Curated botanical therapies, architectural color precision, and tailored Japanese scalp rituals executed by certified master stylists.
            </Typography>
          </Box>

          {/* Location Selector Dropdown & Active Sanctuary Banner */}
          <Box className="flex items-center gap-3 bg-[var(--app-surface-alt)] p-3 rounded-xl border border-[var(--app-border)]/30">
            <Box className="w-10 h-10 rounded-lg bg-[var(--app-surface-alt)] flex items-center justify-center text-[var(--app-primary)]">
              <StorefrontOutlinedIcon className="text-[20px]" />
            </Box>
            <Box>
              <Box className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-[var(--app-muted)] uppercase tracking-wider">
                  ACTIVE SANCTUARY
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </Box>
              <Typography className="text-xs font-bold text-[var(--app-text)]">
                {salon?.name || "Flagship Salon — Main Studio"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </section>

      {/* MAIN CATALOG 2-COLUMN SECTION (Stitch 1:1) */}
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-4">
        <Box className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT FILTER SIDEBAR (approx 320px) */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Search Input */}
            <Box className="bg-[var(--app-surface-alt)] rounded-xl p-4 border border-[var(--app-border)]/30 shadow-lg space-y-4">
              <Box className="relative">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search rituals, color, actives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon className="text-[var(--app-muted)] text-[20px]" />
                        </InputAdornment>
                      ),
                      endAdornment: searchQuery ? (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => setSearchQuery("")} className="text-[var(--app-muted)]">
                            <CloseIcon className="text-[16px]" />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                      className: "rounded-lg bg-[var(--app-bg)] text-xs text-[var(--app-text)] border-[var(--app-border)]/40 py-0.5",
                    },
                  }}
                />
              </Box>

              {/* Service Sanctuaries Categories */}
              <Box>
                <Box className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[var(--app-muted)] tracking-wider uppercase">
                    SERVICE SANCTUARIES
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                      setSelectedGender("all");
                    }}
                    className="text-[10px] font-bold text-[var(--app-primary)] bg-transparent border-0 cursor-pointer uppercase hover:underline"
                  >
                    RESET
                  </button>
                </Box>
                <ul className="space-y-1 p-0 m-0 list-none">
                  {categorySanctuaries.map((cat) => {
                    const isSel = selectedCategory === cat.id;
                    const catBtnClass = isSel
                      ? "w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--app-surface-alt)] border-l-4 border-[var(--app-primary)] text-[var(--app-primary)] font-semibold text-xs transition-all text-left border-y-0 border-r-0 cursor-pointer"
                      : "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[var(--app-muted)] hover:bg-[var(--app-surface-alt)] text-xs transition-all text-left border-0 bg-transparent cursor-pointer";

                    return (
                      <li key={cat.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={catBtnClass}
                        >
                          <span className="capitalize">{cat.label}</span>
                          <span className={isSel ? "text-[10px] bg-[var(--app-primary)]/20 text-[var(--app-primary)] px-2 py-0.5 rounded-full font-bold" : "text-[10px] bg-[var(--app-surface-alt)] px-2 py-0.5 rounded-full text-[var(--app-muted)]"}>
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </Box>

              {/* Target Guest Demographic Filter */}
              <Box className="pt-2 border-t border-[var(--app-border)]/20">
                <Typography className="block text-[10px] font-bold text-[var(--app-muted)] tracking-wider uppercase mb-2">
                  TARGET GUEST
                </Typography>
                <Box className="grid grid-cols-2 gap-2">
                  {[
                    { id: "all", label: "All" },
                    { id: "female", label: "Female" },
                    { id: "male", label: "Male" },
                    { id: "unisex", label: "Unisex" },
                  ].map((g) => {
                    const isSel = selectedGender === g.id;
                    const gBtnClass = isSel
                      ? "px-3 py-1.5 rounded-lg bg-[var(--app-surface-alt)] border border-[var(--app-primary)] text-[var(--app-primary)] text-xs font-semibold text-center cursor-pointer"
                      : "px-3 py-1.5 rounded-lg border border-[var(--app-border)]/30 text-[var(--app-muted)] hover:border-[var(--app-primary)] text-xs transition-all text-center bg-transparent cursor-pointer";

                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGender(g.id)}
                        className={gBtnClass}
                      >
                        {g.label}
                      </button>
                    );
                  })}
                </Box>
              </Box>
            </Box>

            {/* Bespoke Consultation Note */}
            <Box className="p-4 rounded-xl bg-[var(--app-surface-alt)] border border-[var(--app-primary)]/30 relative overflow-hidden">
              <Box className="flex items-center gap-2 mb-2 text-[var(--app-primary)]">
                <AutoAwesomeOutlinedIcon className="text-[18px]" />
                <span className="text-[10px] font-bold tracking-widest uppercase">
                  BESPOKE CONSULTATION
                </span>
              </Box>
              <Typography className="text-xs text-[var(--app-muted)] leading-relaxed">
                Every hair sculpture includes a micro-digital scalp & strand elasticity diagnosis prior to chemical contact.
              </Typography>
            </Box>
          </aside>

          {/* MAIN CATALOG GRID */}
          <section className="lg:col-span-8 xl:col-span-9 space-y-4">
            {/* Controls Bar */}
            <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[var(--app-border)]/20">
              <Box>
                <Typography className="text-xl font-semibold text-[var(--app-text)] capitalize">
                  {selectedCategory === "all" ? "All Salon Offerings" : selectedCategory}
                </Typography>
                <Typography className="text-xs text-[var(--app-muted)]">
                  Showing {filteredServices.length} offerings
                </Typography>
              </Box>

              <Box className="flex items-center gap-2 bg-[var(--app-surface-alt)] px-3 py-1.5 rounded-lg border border-[var(--app-border)]/30">
                <span className="text-[10px] font-bold text-[var(--app-muted)] uppercase">SORT BY:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[var(--app-text)] text-xs border-none focus:outline-none cursor-pointer"
                >
                  <option value="curated" className="bg-[var(--app-surface-alt)] text-[var(--app-text)]">Curated Order</option>
                  <option value="price-desc" className="bg-[var(--app-surface-alt)] text-[var(--app-text)]">Price: High to Low</option>
                  <option value="price-asc" className="bg-[var(--app-surface-alt)] text-[var(--app-text)]">Price: Low to High</option>
                </select>
              </Box>
            </Box>

            {/* Services List */}
            <Box className="flex flex-col gap-6 pt-2">
              {filteredServices.length === 0 ? (
                <Box className="text-center py-16 px-4 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg)]">
                  <ContentCutOutlinedIcon className="text-[var(--app-muted)] text-[40px] mb-2" />
                  <Typography className="font-bold text-sm text-[var(--app-text)]">
                    No treatments match your current filters
                  </Typography>
                  <Typography className="text-xs text-[var(--app-muted)] mt-1 max-w-sm mx-auto">
                    Try clearing search terms or selecting another service sanctuary.
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedGender("all");
                    }}
                    className="mt-4 rounded-full px-5 py-2 text-xs font-bold text-[var(--app-primary)] normal-case"
                  >
                    Reset Filters
                  </Button>
                </Box>
              ) : (
                filteredServices.map((service) => (
                  <ServiceCard
                    key={service.uuid || service.id}
                    service={service}
                    subServices={subServicesMap[service.id] || []}
                    salon={salon}
                  />
                ))
              )}
            </Box>
          </section>
        </Box>
      </main>
    </Box>
  );
}

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
import styles from "./storefront-services.module.css";

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

  const services: any[] = useMemo(() => salon?.services || [], [salon?.services]);
  const categories: any[] = useMemo(() => salon?.categories || [], [salon?.categories]);

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
    <Box>
      <Box className={styles.headerCard}>
        <Box className={styles.titleRow}>
          <Box>
            <Typography className={styles.title}>
              Treatments & Services
            </Typography>
            <Typography className={styles.subtitle}>
              Select treatments tailored to your lifestyle. Options and sub-services expand with full transparent pricing.
            </Typography>
          </Box>

          <Box className={styles.countBadge}>
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
                  <SearchIcon sx={{ color: "var(--app-muted)", fontSize: "20px" }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <ClearIcon sx={{ fontSize: "16px" }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              className: styles.searchInput,
            },
          }}
        />

        {categoryOptions.length > 1 && (
          <Box className={styles.categoriesStrip}>
            {categoryOptions.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <Chip
                  key={cat.id}
                  label={cat.label}
                  clickable
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`${styles.categoryChip} ${isActive ? styles.categoryChipActive : ""}`}
                />
              );
            })}
          </Box>
        )}

        <Box className={styles.genderRow}>
          <Typography className={styles.genderLabel}>
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
                className={`${styles.genderChip} ${isActive ? styles.genderChipActive : ""}`}
              />
            );
          })}
        </Box>
      </Box>

      <Box className={styles.mainGrid}>
        <Box className={styles.servicesList}>
          {filteredRootServices.length === 0 ? (
            <Box className={styles.emptyState}>
              <TuneIcon className={styles.emptyIcon} />
              <Typography className={styles.emptyTitle}>
                No treatments match your search
              </Typography>
              <Typography className={styles.emptySubtitle}>
                Try adjusting your search terms, changing the category, or resetting filters.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={resetFilters}
                className={styles.resetBtn}
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

        <Box className={styles.desktopBasketCol}>
          <StorefrontBasket salon={salon} variant="desktop-card" onProceed={onProceedToBook} />
        </Box>
      </Box>

      <StorefrontBasket salon={salon} variant="mobile-floating" onProceed={onProceedToBook} />
    </Box>
  );
}

import { Box, CircularProgress, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import SearchBar from "../../../../components/searchbar";
import Select from "../../../../components/form/select";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useEffect } from "react";

type FiltersForm = {
  category: string;
};

type Option = { label: string; value: string };

interface DiscoveryFiltersProps {
  categoryOptions: Option[];
  onSearch: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  locationStatus?: "idle" | "loading" | "success" | "error";
  hasLocation?: boolean;
}

export default function DiscoveryFilters({
  categoryOptions,
  onSearch,
  onCategoryChange,
  locationStatus = "idle",
  hasLocation = false,
}: DiscoveryFiltersProps) {
  const { control, watch } = useForm<FiltersForm>({
    defaultValues: { category: "" },
  });

  const category = watch("category");

  useEffect(() => {
    if (onCategoryChange) onCategoryChange(category);
  }, [category, onCategoryChange]);

  return (
    <Grid container spacing={2} className="w-full items-center">
      <Grid size={{ xs: 12, md: 5 }}>
        <Box className="w-full">
          <SearchBar placeholder="Search salons by name" onSearch={onSearch} />
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Box className="w-full flex justify-center">
          <Box className="w-full max-w-90 md:max-w-[320px]">
            <Select
              name="category"
              placeholder="All Categories"
              identifier="salon-category"
              options={categoryOptions}
              control={control}
            />
          </Box>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }}>
        <Box className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 min-w-30">
        {locationStatus === "loading" && (
          <Box className="flex items-center gap-1.5 px-2.5 py-1.5 bg-(--app-primary-soft) border border-(--app-border) rounded-xl text-xs text-(--app-text)">
            <CircularProgress size={14} />
            <Typography component="span" className="text-xs">
              Locating...
            </Typography>
          </Box>
        )}

        {locationStatus === "success" && hasLocation && (
          <Box className="flex items-center gap-1 px-2.5 py-1.5 bg-(--app-primary-soft) border border-(--app-border) rounded-xl text-xs text-(--app-text)">
            <LocationOnOutlinedIcon fontSize="inherit" />
            <Typography component="span" className="text-xs font-semibold">
              Nearby
            </Typography>
          </Box>
        )}

        {locationStatus === "error" && (
          <Typography className="text-xs text-(--app-muted) text-right leading-tight">
            Enable location for nearby
          </Typography>
        )}

        {locationStatus === "idle" && (
          <Typography className="text-xs text-(--app-muted) text-right">
            Loading...
          </Typography>
        )}
        </Box>
      </Grid>
    </Grid>
  );
}

import { Box, CircularProgress, Typography } from "@mui/material";
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
  const { control, watch, setValue } = useForm<FiltersForm>({
    defaultValues: { category: "" },
  });

  const category = watch("category");

  useEffect(() => {
    if (onCategoryChange) onCategoryChange(category);
  }, [category, onCategoryChange]);

  return (
    <Box className="flex flex-col md:flex-row md:items-center gap-4 w-full">
      <Box className="flex-1">
        <SearchBar placeholder="Search salons by name" onSearch={onSearch} />
      </Box>
      <Box className="w-full md:w-65">
        <Select
          name="category"
          placeholder="All Categories"
          identifier="salon-category"
          options={categoryOptions}
          control={control}
        />
      </Box>
      <Box className="flex flex-col items-end gap-1 min-w-30">
        {locationStatus === "loading" && (
          <Box className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            <CircularProgress size={14} />
            <span>Locating...</span>
          </Box>
        )}

        {locationStatus === "success" && hasLocation && (
          <Box className="flex items-center gap-1 px-2 py-1.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
            <LocationOnOutlinedIcon fontSize="inherit" />
            <span>Nearby</span>
          </Box>
        )}

        {locationStatus === "error" && (
          <Box className="text-xs text-slate-500 text-right leading-tight">
            Enable location
            <br />
            <span className="text-slate-400">for nearby</span>
          </Box>
        )}

        {locationStatus === "idle" && <Box className="text-xs text-slate-400 text-right">Loading...</Box>}
      </Box>
    </Box>
  );
}

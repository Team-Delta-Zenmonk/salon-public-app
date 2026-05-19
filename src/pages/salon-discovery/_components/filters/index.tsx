import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import SearchBar from "../../../../components/searchbar";
import Autocomplete from "../../../../components/form/autocomplete";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import CloseIcon from "@mui/icons-material/Close";
import TuneIcon from "@mui/icons-material/Tune";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { TOP_INDIAN_CITIES } from "../../constants/cities";
import type { LocationStatus } from "../../constants/location-status.type";
import type { ViewMode } from "../../constants/view-mode.type";
import DiscoveryViewSwitch from "../views/view-switch";

type FiltersForm = {
  category: string;
  city: string;
};

type Option = { label: string; value: string };

interface DiscoveryFiltersProps {
  categoryOptions: Option[];
  onSearch: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onCityChange?: (value: string) => void;
  onRequestLocation?: () => void;
  locationStatus?: LocationStatus;
  hasLocation?: boolean;
  initialSearch?: string;
  initialCategory?: string;
  initialCity?: string;
  viewMode: ViewMode;
  onViewModeChange: (value: ViewMode) => void;
}

export default function DiscoveryFilters({
  categoryOptions,
  onSearch,
  onCategoryChange,
  onCityChange,
  onRequestLocation,
  locationStatus = "idle",
  hasLocation = false,
  initialSearch = "",
  initialCategory = "",
  initialCity = "",
  viewMode,
  onViewModeChange,
}: DiscoveryFiltersProps) {
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const { control, watch, reset, setValue } = useForm<FiltersForm>({
    defaultValues: {
      category: initialCategory,
      city: initialCity,
    },
  });

  const category = watch("category");
  const city = watch("city");

  const cityOptions = useMemo(() => {
    return TOP_INDIAN_CITIES;
  }, []);

  useEffect(() => {
    reset({
      category: initialCategory,
      city: initialCity,
    });
  }, [initialCategory, initialCity, reset]);

  const handleCityChange = (selectedOption: any) => {
    const selectedCityValue = selectedOption ? selectedOption.value : "";
    setValue("city", selectedCityValue);
  };

  const handleApply = () => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    if (onCityChange) {
      onCityChange(city);
    }
    setIsFilterDialogOpen(false);
  };

  const handleClose = () => {
    setIsFilterDialogOpen(false);
    reset({
      category: initialCategory,
      city: initialCity,
    });
  };

  const activeFilters = useMemo(() => {
    const list = [];
    if (initialCategory) {
      const catLabel = categoryOptions.find((o) => o.value === initialCategory)?.label || initialCategory;
      list.push({ type: "category" as const, label: `Category: ${catLabel}`, value: initialCategory });
    }
    if (initialCity) {
      const cityLabel = cityOptions.find((o) => o.value === initialCity)?.label || initialCity;
      list.push({ type: "city" as const, label: `City: ${cityLabel}`, value: initialCity });
    }
    return list;
  }, [initialCategory, initialCity, categoryOptions, cityOptions]);

  const hasActiveFilters = activeFilters.length > 0;

  const renderLocationWidget = () => {
    return (
      <Box className="flex items-center gap-2">
        {locationStatus === "loading" && (
          <Box className="flex items-center gap-2 h-10 sm:h-12 px-2.5 sm:px-4 rounded-xl sm:rounded-[14px] bg-(--app-primary-soft)/30 border border-(--app-primary)/20 text-xs sm:text-sm text-(--app-primary) animate-pulse shadow-xs font-semibold">
            <CircularProgress size={12} color="inherit" thickness={6} />
            <Typography component="span" className="text-xs sm:text-sm font-semibold">
              Locating...
            </Typography>
          </Box>
        )}

        {locationStatus === "success" && hasLocation && !initialCity && (
          <Box className="flex items-center gap-2 h-10 sm:h-12 px-2.5 sm:px-4 rounded-xl sm:rounded-[14px] bg-emerald-500/10 border border-emerald-500/20 text-xs sm:text-sm text-emerald-600 font-semibold shadow-xs">
            <Box className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <GpsFixedIcon fontSize="inherit" className="text-[16px] sm:text-[18px]" />
            <Typography component="span" className="text-xs sm:text-sm font-bold uppercase tracking-wider">
              GPS Active
            </Typography>
          </Box>
        )}

        {(locationStatus === "error" || initialCity || (locationStatus === "idle" && !hasLocation)) && (
          <Box
            className="flex items-center gap-2 h-10 sm:h-12 px-2.5 sm:px-4 rounded-xl sm:rounded-[14px] bg-(--app-surface) hover:bg-(--app-primary-soft)/40 border border-(--app-border) hover:border-(--app-primary) text-xs sm:text-sm text-(--app-text) font-semibold cursor-pointer transition-all duration-300 shadow-xs"
            onClick={() => {
              setValue("city", "");
              if (onCityChange) onCityChange("");
              if (onRequestLocation) onRequestLocation();
            }}
            title={initialCity ? "Click to clear manual city and use GPS" : "Click to request GPS location"}
          >
            <LocationOnOutlinedIcon fontSize="inherit" className="text-[16px] sm:text-[18px] text-(--app-primary)" />
            <Typography component="span" className="text-xs sm:text-sm font-semibold">
              {initialCity ? `Use GPS` : "Enable GPS"}
            </Typography>
            {initialCity ? (
              <Typography
                component="span"
                className="text-[9px] sm:text-[10px] font-bold text-(--app-muted) uppercase tracking-wider bg-(--app-surface-alt) px-1.5 py-0.5 rounded-md ml-0.5"
              >
                Manual
              </Typography>
            ) : (
              <Typography
                component="span"
                className="text-[9px] sm:text-[10px] font-bold text-(--app-primary) uppercase tracking-wider bg-(--app-primary-soft) px-1.5 py-0.5 rounded-md ml-0.5"
              >
                Near me
              </Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className="w-full flex flex-col gap-2 sm:gap-2.5">
      <Box className="w-full flex flex-row items-center gap-2 sm:gap-2.5">
        <Box className="flex-1 min-[1200px]:flex-initial min-[1200px]:w-[320px]">
          <SearchBar placeholder="Search salons by name" onSearch={onSearch} initialValue={initialSearch} />
        </Box>

        <Box
          onClick={() => setIsFilterDialogOpen(true)}
          className={clsx(
            "flex items-center justify-center gap-1.5 h-10 sm:h-12 px-3 sm:px-4 rounded-xl sm:rounded-[14px] border cursor-pointer transition-all duration-300 font-semibold text-xs sm:text-sm shrink-0 shadow-xs",
            hasActiveFilters
              ? "bg-(--app-primary-soft)/40 border-(--app-primary) text-(--app-primary)"
              : "bg-(--app-surface) border-(--app-border) hover:border-(--app-primary) text-(--app-text) hover:bg-(--app-surface-alt)/40",
          )}
        >
          <TuneIcon className="text-[16px] sm:text-[18px]" />
          <Typography component="span">Filters</Typography>
          {hasActiveFilters && (
            <Box
              component="span"
              className="flex items-center justify-center w-5 h-5 rounded-full bg-(--app-primary) text-white text-[10px] font-bold ml-0.5"
            >
              {activeFilters.length}
            </Box>
          )}
        </Box>

        <Box className="hidden min-[1200px]:flex flex-row items-center gap-4 ml-auto">
          {renderLocationWidget()}
          <DiscoveryViewSwitch value={viewMode} onChange={onViewModeChange} />
        </Box>
      </Box>

      <Box className="flex min-[1200px]:hidden flex-row items-center justify-between gap-4 w-full mt-0.5">
        {renderLocationWidget()}
        <DiscoveryViewSwitch value={viewMode} onChange={onViewModeChange} />
      </Box>

      {activeFilters.length > 0 && (
        <Box className="flex flex-row flex-wrap items-center gap-2 mt-1">
          {activeFilters.map((filter) => (
            <Box
              key={filter.type}
              className="flex items-center gap-1 px-2.5 py-1 bg-(--app-primary-soft)/45 border border-(--app-primary)/20 rounded-full shadow-xs shrink-0"
            >
              <Typography
                component="span"
                className="text-[10px] sm:text-[11px] font-bold text-(--app-primary) uppercase tracking-wider leading-none"
              >
                {filter.label}
              </Typography>
              <CloseIcon
                className="text-[11px] sm:text-[12px] text-(--app-primary)/70 cursor-pointer hover:text-rose-500 transition-colors ml-1"
                onClick={() => {
                  setValue(filter.type, "");
                  if (filter.type === "city" && onCityChange) onCityChange("");
                  if (filter.type === "category" && onCategoryChange) onCategoryChange("");
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      <Dialog
        open={isFilterDialogOpen}
        onClose={handleClose}
        PaperProps={{
          className: "rounded-[20px] bg-(--app-surface) bg-none",
        }}
      >
        <DialogTitle className="flex items-center justify-between border-b border-(--app-border)/40 pb-3.5 px-5">
          <Typography className="font-bold text-base sm:text-lg text-(--app-text)">Filters</Typography>
          <IconButton onClick={handleClose} size="small" className="text-(--app-muted)">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent className="pt-5 pb-6 px-5 min-w-[280px] sm:min-w-[400px]">
          <Box className="flex flex-col gap-6">
            <Box className="flex flex-col gap-2">
              <Typography className="text-xs font-bold text-(--app-text) opacity-80 uppercase tracking-wider">
                Category
              </Typography>
              <Autocomplete
                name="category"
                placeholder="All Categories"
                identifier="salon-category"
                options={categoryOptions}
                control={control}
              />
            </Box>

            <Box className="flex flex-col gap-2">
              <Typography className="text-xs font-bold text-(--app-text) opacity-80 uppercase tracking-wider">
                City
              </Typography>
              <Autocomplete
                name="city"
                placeholder="Select City"
                identifier="salon-city"
                options={cityOptions}
                control={control}
                onChangeCallback={handleCityChange}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className="border-t border-(--app-border)/40 p-4 px-5 flex items-center justify-between gap-3">
          <Button
            onClick={() => {
              reset({ category: "", city: "" });
              if (onCategoryChange) onCategoryChange("");
              if (onCityChange) onCityChange("");
            }}
            className="text-xs font-bold text-(--app-muted) hover:text-(--app-primary) normal-case transition-colors"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            variant="contained"
            className="bg-(--app-primary) hover:bg-(--app-primary)/90 text-white font-bold text-xs rounded-xl px-5 py-2.5 normal-case shadow-xs"
          >
            Show Salons
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

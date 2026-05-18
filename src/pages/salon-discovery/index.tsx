import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SalonListView from "./_components/views/list-view";
import SalonGridView from "./_components/views/grid-view";
import { MapView } from "./_components/views/map-view";
import DiscoveryFilters from "./_components/filters";
import DiscoveryViewSwitch from "./_components/views/view-switch";
import type { ViewMode } from "./constants/view-mode.type";
import { listSalonsAction } from "../../features/salon/list-salons/list-salons.action";
import { SALON_PAGE_LIMIT } from "./constants/pagination.constants";
import { useAppDispatch } from "../../store/hook";
import { presetCategories } from "./constants/preset-categories";

export default function SalonDiscovery() {
  const dispatch = useAppDispatch();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const categoryOptions = useMemo(() => presetCategories.map((c: any) => ({ label: c.name, value: c.name })), []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setUserLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationStatus("success");
        },
        () => {
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 }, // Cache 5min
      );
    }
  }, []);

  const fetchSalons = () => {
    dispatch(
      listSalonsAction({
        page: 1,
        limit: SALON_PAGE_LIMIT,
        search,
        category: category || undefined,
        ...(userLocation && { latitude: userLocation.lat, longitude: userLocation.lng }),
      }),
    );
  };

  useEffect(() => {
    fetchSalons();
  }, [dispatch]);

  useEffect(() => {
    fetchSalons();
  }, [search, category, userLocation]);

  return (
    <Box className="flex flex-col h-full min-h-0">
      <Box className="flex-none space-y-4 p-3 sm:p-4">
        <Box className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 bg-(--app-surface) px-3 sm:px-5 py-3 sm:py-4 border border-(--app-border) rounded-2xl shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <Box className="flex-1 p-2">
            <DiscoveryFilters
              categoryOptions={categoryOptions.length ? categoryOptions : [{ label: "All", value: "" }]}
              onSearch={(value) => setSearch(value)}
              onCategoryChange={(value) => setCategory(value)}
              locationStatus={locationStatus}
              hasLocation={!!userLocation}
            />
          </Box>
          <DiscoveryViewSwitch value={viewMode} onChange={setViewMode} />
        </Box>
      </Box>

      <Box className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6">
        {viewMode === "list" && <SalonListView />}
        {viewMode === "grid" && <SalonGridView />}
        {viewMode === "map" && <MapView />}
      </Box>
    </Box>
  );
}

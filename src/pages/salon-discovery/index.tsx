import { Box } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import SalonListView from "./_components/views/list-view";
import SalonGridView from "./_components/views/grid-view";
import { MapView } from "./_components/views/map-view";
import DiscoveryFilters from "./_components/filters";
import DiscoveryViewSwitch from "./_components/views/view-switch";
import type { ViewMode } from "./constants/view-mode.type";
import { listCategoriesAction } from "../../features/category/list-categories/list-categories.action";
import { listSalonsAction } from "../../features/salon/list-salons/list-salons.action";
import { CATEGORY_PAGE_LIMIT, SALON_PAGE_LIMIT } from "./constants/pagination.constants";
import { useAppDispatch, useAppSelector } from "../../store/hook";

export default function SalonDiscovery() {
  const dispatch = useAppDispatch();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const categories = useAppSelector((state) => state.category?.data || []);

  const categoryOptions = useMemo(() => categories.map((c: any) => ({ label: c.name, value: c.name })), [categories]);

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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 } // Cache 5min
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
      })
    );
  };

  useEffect(() => {
    dispatch(listCategoriesAction({ page: 1, limit: CATEGORY_PAGE_LIMIT }));
    fetchSalons();
  }, [dispatch]);

  useEffect(() => {
    fetchSalons();
  }, [search, category, userLocation]);

  return (
    <Box className="flex flex-col h-full min-h-0">
      <Box className="flex-none space-y-5 p-4">
        <Box className="flex flex-col md:flex-row md:items-center gap-4 bg-white px-4 sm:px-6 py-4 border border-slate-200 rounded-2xl">
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

      <Box className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-4">
        {viewMode === "list" && <SalonListView />}
        {viewMode === "grid" && <SalonGridView />}
        {viewMode === "map" && <MapView />}
      </Box>
    </Box>
  );
}

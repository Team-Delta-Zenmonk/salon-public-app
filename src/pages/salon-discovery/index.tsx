import { Box, CircularProgress, Fade, Typography } from "@mui/material";
import { SalonCardSkeleton } from "./_components/salon-skeleton";
import { useEffect, useMemo, useState } from "react";
import SalonListView from "./_components/views/list-view";
import SalonGridView from "./_components/views/grid-view";
import { MapView } from "./_components/views/map-view";
import DiscoveryFilters from "./_components/filters";
import type { ViewMode } from "./constants/view-mode.type";
import type { LocationStatus } from "./constants/location-status.type";
import { listSalonsAction } from "../../features/salon/list-salons/list-salons.action";
import { SALON_PAGE_LIMIT } from "./constants/pagination.constants";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { presetCategories } from "./constants/preset-categories";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from "react-router-dom";
import { TOP_INDIAN_CITIES } from "./constants/cities";

export default function SalonDiscovery() {
  const dispatch = useAppDispatch();
  const { data: salons, total, page } = useAppSelector((state) => state.salon);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const city = searchParams.get("city") || "";
  const viewMode = (searchParams.get("view") as ViewMode) || "grid";

  const manualLocation = useMemo(() => {
    if (!city) return null;
    const found = TOP_INDIAN_CITIES.find((c) => c.value === city);
    return found ? { lat: found.lat, lng: found.lng } : null;
  }, [city]);

  console.log(salons, "salons from state");
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");

  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  const activeLocation = manualLocation || gpsLocation || null;

  const categoryOptions = useMemo(() => presetCategories.map((c: any) => ({ label: c.name, value: c.name })), []);

  const requestGpsLocation = () => {
    if ("geolocation" in navigator) {
      setLocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setGpsLocation({ lat: coords.latitude, lng: coords.longitude });
          setLocationStatus("success");
        },
        () => {
          setLocationStatus("error");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5 * 60 * 1000 },
      );
    } else {
      setLocationStatus("error");
    }
  };

  useEffect(() => {
    requestGpsLocation();
  }, []);

  const updateFilters = (updates: Record<string, string | null>) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, val]) => {
          if (val === null || val === "") {
            next.delete(key);
          } else {
            next.set(key, val);
          }
        });
        return next;
      },
      { replace: true },
    );
  };

  const fetchSalons = async () => {
    console.log(activeLocation, "fetching salons with location");
    setIsLoadingInitial(true);
    await dispatch(
      listSalonsAction({
        page: 1,
        limit: SALON_PAGE_LIMIT,
        search,
        category: category || undefined,
        ...(activeLocation && { latitude: activeLocation.lat, longitude: activeLocation.lng }),
      }),
    );
    setIsLoadingInitial(false);
  };

  useEffect(() => {
    fetchSalons();
  }, [search, category, activeLocation]);

  const fetchMoreData = async () => {
    if (!isFetchingMore && total > 0 && salons.length < total) {
      setIsFetchingMore(true);
      await dispatch(
        listSalonsAction({
          page: page + 1,
          limit: SALON_PAGE_LIMIT,
          search,
          category: category || undefined,
          ...(activeLocation && { latitude: activeLocation.lat, longitude: activeLocation.lng }),
        }),
      );
      setIsFetchingMore(false);
    }
  };

  return (
    <Box className="flex flex-col h-full min-h-0">
      <Box className="flex-none p-3 sm:p-4">
        <Box className="bg-transparent sm:bg-(--app-surface) px-0 py-1.5 sm:px-5 sm:py-4 border-0 sm:border border-(--app-border) rounded-none sm:rounded-2xl shadow-none sm:shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
          <Box className="w-full">
            <DiscoveryFilters
              categoryOptions={categoryOptions.length ? categoryOptions : [{ label: "All", value: "" }]}
              onSearch={(value) => updateFilters({ search: value })}
              onCategoryChange={(value) => updateFilters({ category: value })}
              onCityChange={(value) => updateFilters({ city: value })}
              onRequestLocation={requestGpsLocation}
              locationStatus={locationStatus}
              hasLocation={!!gpsLocation}
              initialSearch={search}
              initialCategory={category}
              initialCity={city}
              viewMode={viewMode}
              onViewModeChange={(value) => updateFilters({ view: value })}
            />
          </Box>
        </Box>
      </Box>

      <Box
        id="scrollable-discovery"
        className={
          viewMode === "map"
            ? "flex-1 min-h-0 overflow-hidden px-0 pb-0"
            : "flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 lg:px-6 pb-4 sm:pb-6"
        }
      >
        {viewMode === "map" ? (
          <MapView />
        ) : isLoadingInitial ? (
          viewMode === "list" ? (
            <Box className="space-y-3 sm:space-y-4 px-2 sm:px-3 lg:px-4 pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SalonCardSkeleton key={i} variant="list" />
              ))}
            </Box>
          ) : (
            <Box className="grid gap-2.5 sm:gap-4 lg:gap-5 px-2 sm:px-3 lg:px-4 pb-4 grid-cols-2 min-[1200px]:grid-cols-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <SalonCardSkeleton key={i} variant="grid" />
              ))}
            </Box>
          )
        ) : salons.length === 0 ? (
          <Box className="py-12 text-center bg-(--app-surface) rounded-2xl border border-(--app-border) border-dashed mx-2 sm:mx-3 lg:mx-4">
            <Typography variant="h6" className="text-(--app-muted) mb-1 font-semibold">
              No salons found
            </Typography>
            <Typography variant="body2" className="text-(--app-muted) opacity-80">
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
          </Box>
        ) : (
          <InfiniteScroll
            scrollableTarget="scrollable-discovery"
            dataLength={salons.length}
            next={fetchMoreData}
            hasMore={total > 0 && salons.length < total}
            loader={
              <Box className="flex justify-center py-6">
                <CircularProgress size={32} />
              </Box>
            }
            endMessage={
              salons.length > 0 ? (
                <Box className="pb-8 pt-4">
                  <Typography variant="body2" className="text-(--app-muted) text-center font-medium opacity-60">
                    You've reached the end of the list
                  </Typography>
                </Box>
              ) : null
            }
          >
            <Fade in timeout={400}>
              <Box>
                {viewMode === "list" && <SalonListView />}
                {viewMode === "grid" && <SalonGridView />}
              </Box>
            </Fade>
          </InfiniteScroll>
        )}
      </Box>
    </Box>
  );
}

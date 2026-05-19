"use client";
import { Box, Typography, Button, Link } from "@mui/material";
import L from "leaflet";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import marker2x from "leaflet/dist/images/marker-icon-2x.png";
import marker from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { useAppSelector } from "../../../../../store/hook";

const DefaultIcon = L.icon({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: shadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

type LatLng = [number, number];

function FitBounds({ points }: { points: LatLng[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    if (points.length === 1) {
      map.setView(points[0], 14, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [140, 140] });
  }, [map, points]);

  return null;
}

export function MapView() {
  const salons = useAppSelector((state: any) => state.salon?.data || []);

  const points = useMemo<LatLng[]>(() => {
    return salons
      .map((s: any) => [Number(s.latitude), Number(s.longitude)] as LatLng)
      .filter(([lat, lng]: LatLng) => Number.isFinite(lat) && Number.isFinite(lng));
  }, [salons]);

  const validSalons = salons.filter(
    (salon: any) => Number.isFinite(Number(salon.latitude)) && Number.isFinite(Number(salon.longitude)),
  );

  return (
    <Box className="relative h-full min-h-[400px] w-full rounded-2xl overflow-hidden border border-(--app-border) bg-(--app-surface) shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
      <MapContainer zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%", zIndex: 0 }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds points={points} />

        {validSalons.map((salon: any) => {
          const lat = Number(salon.latitude);
          const lng = Number(salon.longitude);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

          return (
            <Marker key={salon.uuid} position={[lat, lng]}>
              <Popup>
                <Box className="w-64 p-4 max-w-sm">
                  <Box className="w-full h-24 rounded-xl overflow-hidden bg-(--app-surface-alt) mb-3 shadow-sm border border-(--app-border)">
                    {salon.logo ? (
                      <Box
                        component="img"
                        src={salon.logo}
                        alt={salon.name || "Salon"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Box className="h-full w-full bg-linear-to-br from-(--app-surface-alt) to-(--app-bg) flex items-center justify-center">
                        <Typography variant="caption" color="text.secondary" className="text-xs">
                          No photo
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="subtitle1" fontWeight="bold" className="mb-2 text-(--app-text) text-sm">
                    {salon.name || "Unnamed Salon"}
                  </Typography>

                  <Typography
                    variant="caption"
                    className="block px-2.5 py-1.5 bg-(--app-primary-soft) rounded-full mb-3 w-fit text-xs font-medium text-(--app-text)"
                  >
                    {salon.type ? String(salon.type).toUpperCase() : "UNISEX"}
                  </Typography>
                  <Typography variant="body2" className="text-(--app-muted) mb-4 text-xs leading-4 line-clamp-3">
                    {salon.address || "Address not available"}
                  </Typography>
                  {salon.map_link && (
                    <Link href={salon.map_link} target="_blank" rel="noreferrer" underline="none" className="block">
                      <Button
                        fullWidth
                        variant="outlined"
                        className="rounded-xl font-semibold"
                        endIcon={<ArrowForwardIcon />}
                      >
                        Open Directions
                      </Button>
                    </Link>
                  )}
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {validSalons.length === 0 && (
        <Box className="absolute inset-0 flex flex-col items-center justify-center bg-(--app-surface)/95 backdrop-blur-sm gap-3 p-8 text-center z-10">
          <LocationOnOutlinedIcon fontSize="large" color="disabled" />
          <Typography color="text.secondary" className="font-medium text-lg">
            No salons found
          </Typography>
          <Typography variant="body2" color="text.secondary" className="max-w-sm">
            Try adjusting your search filters to find what you're looking for.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

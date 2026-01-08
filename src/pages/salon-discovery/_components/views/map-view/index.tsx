"use client";
import { Box, Typography } from "@mui/material";
import L from "leaflet";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
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
    (salon: any) => Number.isFinite(Number(salon.latitude)) && Number.isFinite(Number(salon.longitude))
  );

  return (
    <Box className="relative min-h-0 h-[90%] w-[90%] rounded-2xl overflow-auto border border-slate-200 bg-white shadow-sm">
      <MapContainer zoom={12} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
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
                  <Box className="w-full h-24 rounded-xl overflow-hidden bg-slate-100 mb-3 shadow-sm border">
                    {salon.logo ? (
                      <img src={salon.logo} alt={salon.name || "Salon"} className="h-full w-full object-cover" />
                    ) : (
                      <Box className="h-full w-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Typography variant="caption" color="text.secondary" className="text-xs">
                          No photo
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="subtitle1" fontWeight="bold" className="mb-2 text-slate-900 text-sm">
                    {salon.name || "Unnamed Salon"}
                  </Typography>

                  <Typography
                    variant="caption"
                    className="block px-2.5 py-1.5 bg-blue-50  rounded-full mb-3 w-fit text-xs font-medium"
                  >
                    {salon.type ? String(salon.type).toUpperCase() : "UNISEX"}
                  </Typography>
                  <Typography variant="body2" className="text-slate-600 mb-4 text-xs leading-4 line-clamp-3">
                    {salon.address || "Address not available"}
                  </Typography>
                  {salon.map_link && (
                    <a
                      href={salon.map_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full text-sm font-semibold text-slate-900! hover:text-white! hover:bg-slate-900 px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm border border-slate-200"
                    >
                      <span>Open Directions</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </a>
                  )}
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {validSalons.length === 0 && (
        <Box className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm gap-3 p-8 text-center z-10">
          <LocationOnOutlinedIcon fontSize="large" color="disabled" />
          <Typography color="text.secondary" className="font-medium text-lg">
            No salons found nearby
          </Typography>
          <Typography variant="body2" color="text.secondary" className="max-w-sm">
            Try adjusting your search filters or change your location
          </Typography>
        </Box>
      )}
    </Box>
  );
}

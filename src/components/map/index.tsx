"use client";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import type { LatLngValue } from "./_components/location-map";
import { Box, Skeleton } from "@mui/material";
import { reverseGeocode } from "../../features/maps/mapbox-geocode.service";

import styles from "./map.module.css";

const MapPicker = dynamic(() => import("./_components/location-map"), {
  ssr: false,
  loading: () => <Skeleton variant="rounded" height={300} className={styles.skeleton} />,
});

type LocationMapProps = {
  control: any;
  latitude: string;
  longitude: string;
  label?: string;
  disabled?: boolean;
  setValue: any;
  clearErrors: any;
};

export default function LocationMap({ control, latitude, longitude, label, disabled, setValue, clearErrors }: Readonly<LocationMapProps>) {
  const handleLocationChange = async (
    coords: LatLngValue,
    latFieldOnChange: (v: any) => void,
    lngFieldOnChange: (v: any) => void
  ) => {
    const { lat, lng } = coords;

    latFieldOnChange(lat);
    lngFieldOnChange(lng);
    const result = await reverseGeocode(lat, lng);
    if (result?.formattedAddress) {
      setValue("address.address", result.formattedAddress);
      setValue("address.map_link", `https://www.google.com/maps?q=${lat},${lng}`);
      clearErrors("address.address");
    }
  };

  return (
    <Box className={styles.mapWrapper}>
      {label && <Box className={styles.mapLabel}>{label}</Box>}
      <Controller
        control={control}
        name={latitude as any}
        render={({ field: latField }) => (
          <Controller
            control={control}
            name={longitude as any}
            render={({ field: lngField }) => {
              const value: LatLngValue | null =
                latField.value != null && lngField.value != null ? { lat: latField.value, lng: lngField.value } : null;

              return (
                <MapPicker
                  value={value}
                  disabled={disabled}
                  onChange={(coords) => {
                    handleLocationChange(coords, latField.onChange, lngField.onChange);
                  }}
                />
              );
            }}
          />
        )}
      />
    </Box>
  );
}

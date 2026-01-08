import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Chip, Rating, Divider, CircularProgress, Breadcrumbs } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../../../../store/hook";
import { getSalon } from "../../../../features/salon/get-salon/get-salon.service";

export default function SalonDetail() {
  const params = useParams();
  const salonUuid = params.uuid as string;
  const dispatch = useAppDispatch();

  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cachedSalon = useAppSelector((state: any) => state.salon.data.find((s: any) => s.uuid === salonUuid));

  useEffect(() => {
    const fetchSalon = async () => {
      if (cachedSalon) {
        setSalon(cachedSalon);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getSalon(salonUuid);
        setSalon(data);
      } catch (err: any) {
        setError(err.message || "Failed to load salon details");
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, [salonUuid, cachedSalon]);

  if (loading) {
    return (
      <Box className="min-h-screen flex items-center justify-center py-12">
        <CircularProgress size={56} thickness={4} />
        <Typography variant="h6" className="ml-4 text-slate-600">
          Loading salon...
        </Typography>
      </Box>
    );
  }

  if (error || !salon) {
    return (
      <Box className="min-h-screen flex items-center justify-center py-12">
        <Box className="text-center p-12 max-w-md space-y-4">
          <Typography variant="h4" color="error" className="font-semibold">
            Salon Not Found
          </Typography>
          <Typography className="mb-6">
            The salon you're looking for doesn't exist or has been removed.
          </Typography>
          <Link
            to="/discovery"
            className="inline-flex items-center gap-2 bg-slate-900  px-6 py-3 rounded-xl hover:bg-slate-800 transition-all font-medium shadow-lg"
          >
            <ArrowBack fontSize="small" />
            Back to Discovery
          </Link>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen ">
      <Box className=" shadow-2xl">
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs className="py-6 text-blue-100 max-w-2xl">
            <Link to="/discovery" className="hover:text-white transition-colors">
              Discovery
            </Link>
            <Typography color="inherit" className="font-semibold">
              {salon.name}
            </Typography>
          </Breadcrumbs>

          <Box className="flex flex-col lg:flex-row gap-8 pb-12 items-start lg:items-center">
            <Box className="shrink-0 -mt-12 lg:-mt-16">
              <img
                src={salon.logo}
                alt={salon.name}
                className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-8 border-white/80 ring-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-salon.jpg";
                }}
              />
            </Box>

            <Box className="flex-1 min-w-0">
              <Typography variant="h1" className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                {salon.name}
              </Typography>

              {/* Stats */}
              <Box className="flex flex-wrap items-center gap-4 mb-6">
                <Chip
                  label={salon.type?.toUpperCase() || "UNISEX"}
                  color="secondary"
                  variant="filled"
                  className="font-bold shadow-md"
                />
                {salon.categories?.[0] && <Chip label={salon.categories[0].name} color="primary" variant="outlined" />}
                <Rating value={salon.rating || 4.5} precision={0.5} readOnly size="large" className="ml-auto!" />
                <Typography variant="h6" className=" font-semibold">
                  {salon.rating || 4.5} (124 reviews)
                </Typography>
              </Box>

              <Box className="text-lg mb-6 leading-relaxed">
                <Typography>{salon.address}</Typography>
                {salon.distance && (
                  <Typography className="mt-1">
                    <span className="font-semibold">{salon.distance.toFixed(1)} km</span> away
                  </Typography>
                )}
              </Box>

              <Box className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-8 py-4 bg-white/20 backdrop-blur-sm  font-bold text-lg rounded-2xl shadow-2xl hover:bg-white/30 border-2 border-white/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl">
                  📅 Book Now
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm font-bold text-lg rounded-2xl hover:bg-white/20 border-2 border-white/20 transition-all duration-300">
                  📞 Call {salon.phone || salon.owner_name}
                </button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

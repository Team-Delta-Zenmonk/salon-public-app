"use client";
import { Box, Button, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useStorefrontNavigate } from "../../common/hooks/useStorefrontNavigate";

export default function NotFoundPage() {
  const theme = useTheme();
  const navigate = useStorefrontNavigate();
  const params = useParams();
  const salonSlug = params?.salonSlug as string | undefined;

  const homePath = salonSlug ? `/salons/${salonSlug}` : "/";
  const servicesPath = salonSlug ? `/salons/${salonSlug}/services` : "/services";

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(homePath);
    }
  };

  const primaryColor = theme.palette.primary.main;
  const primaryContrast = theme.palette.primary.contrastText;
  const textPrimary = theme.palette.text.primary;
  const textSecondary = theme.palette.text.secondary;
  const borderColor = theme.palette.divider;
  const surfaceBg = theme.palette.background.paper;

  return (
    <Box className="min-h-[70vh] flex items-center justify-center p-4 sm:p-6 my-auto">
      <Box
        className="max-w-lg w-full text-center rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-2xl transition-all duration-300"
        style={{
          backgroundColor: surfaceBg,
          border: `1px solid ${borderColor}`,
          boxShadow: `0 0 30px ${primaryColor}15`,
        }}
      >
        <Box
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-300"
          style={{ backgroundColor: `${primaryColor}20` }}
        />
        <Box
          className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full blur-3xl pointer-events-none transition-colors duration-300"
          style={{ backgroundColor: `${primaryColor}15` }}
        />

        <Box className="flex justify-center mb-6">
          <Box
            className="w-20 h-20 rounded-2xl flex items-center justify-center border shadow-lg transition-all duration-300"
            style={{
              backgroundColor: `${primaryColor}18`,
              borderColor: `${primaryColor}35`,
              color: primaryColor,
            }}
          >
            <SearchOffIcon style={{ fontSize: 42 }} />
          </Box>
        </Box>

        <Box className="mb-2">
          <Typography
            variant="h1"
            className="text-5xl sm:text-6xl font-bold tracking-tight font-serif"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: textPrimary,
            }}
          >
            404
          </Typography>
        </Box>

        <Typography
          variant="h5"
          className="text-xl sm:text-2xl font-semibold mb-3"
          style={{ color: textPrimary }}
        >
          Page Not Found
        </Typography>

        <Typography
          className="text-sm mb-6 leading-relaxed"
          style={{ color: textSecondary }}
        >
          The page or salon service you are looking for doesn&apos;t exist, was moved, or is temporarily unavailable.
        </Typography>

        <Box className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outlined"
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer"
            style={{
              borderColor: borderColor,
              color: textPrimary,
            }}
          >
            Go Back
          </Button>

          <Button
            component={Link}
            href={homePath}
            variant="contained"
            disableElevation
            startIcon={<HomeIcon />}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            style={{
              backgroundColor: primaryColor,
              color: primaryContrast,
              boxShadow: `0 4px 16px ${primaryColor}40`,
            }}
          >
            Return to Storefront
          </Button>
        </Box>

        <Box className="mt-6 pt-6 border-t" style={{ borderColor: borderColor }}>
          <Link
            href={servicesPath}
            className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline transition-all"
            style={{ color: primaryColor }}
          >
            <ContentCutIcon style={{ fontSize: 16 }} />
            <span>Explore Salon Services</span>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

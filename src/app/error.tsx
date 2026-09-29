"use client";
import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <Box className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <Box className="w-18 h-18 rounded-2xl bg-(--app-surface) border border-(--app-border) flex items-center justify-center mb-4 shadow-lg text-rose-400">
        <ErrorOutlineIcon className="text-[36px]" />
      </Box>
      <Typography variant="h5" className="font-bold text-(--app-text) mb-2">
        Something went wrong
      </Typography>
      <Typography className="text-sm text-(--app-muted) max-w-md mb-6 leading-relaxed">
        An unexpected error occurred while processing your request. Please try refreshing the page.
      </Typography>
      <Button
        variant="contained"
        onClick={() => reset()}
        startIcon={<RefreshIcon className="text-[18px]" />}
        className="rounded-xl px-6 py-2.5 font-bold text-xs bg-(--app-primary) text-(--app-primary-contrast) hover:brightness-110"
      >
        Try Again
      </Button>
    </Box>
  );
}

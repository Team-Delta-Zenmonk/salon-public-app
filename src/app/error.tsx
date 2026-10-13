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
    <Box
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <Box
        style={{
          width: "4.5rem",
          height: "4.5rem",
          borderRadius: "1rem",
          backgroundColor: "var(--app-surface)",
          border: "1px solid var(--app-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1rem",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          color: "#fb7185",
        }}
      >
        <ErrorOutlineIcon style={{ fontSize: "36px" }} />
      </Box>
      <Typography
        variant="h5"
        style={{
          fontWeight: "bold",
          color: "var(--app-text)",
          marginBottom: "0.5rem",
        }}
      >
        Something went wrong
      </Typography>
      <Typography
        style={{
          fontSize: "0.875rem",
          color: "var(--app-muted)",
          maxWidth: "28rem",
          marginBottom: "1.5rem",
          lineHeight: "1.625",
        }}
      >
        An unexpected error occurred while processing your request. Please try refreshing the page.
      </Typography>
      <Button
        variant="contained"
        onClick={() => reset()}
        startIcon={<RefreshIcon style={{ fontSize: "18px" }} />}
        style={{
          borderRadius: "0.75rem",
          padding: "0.625rem 1.5rem",
          fontWeight: "bold",
          fontSize: "0.75rem",
          backgroundColor: "var(--app-primary)",
          color: "var(--app-surface)",
        }}
      >
        Try Again
      </Button>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./payment-processing.module.scss";

const PROCESSING_STEPS = [
  { label: "Payment received", delay: 0 },
  { label: "Confirming your booking", delay: 1200 },
  { label: "Securing your slot", delay: 2400 },
  { label: "Almost done...", delay: 3400 },
] as const;

const TOTAL_DURATION_MS = 4500;

interface PaymentProcessingProps {
  salonName: string;
  onComplete: () => void;
}

export default function PaymentProcessing({ salonName, onComplete }: Readonly<PaymentProcessingProps>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    PROCESSING_STEPS.forEach((step, index) => {
      if (index === 0) return;
      timers.push(setTimeout(() => setCurrentStep(index), step.delay));
    });

    timers.push(
      setTimeout(() => {
        setIsDone(true);
      }, TOTAL_DURATION_MS - 600),
    );

    timers.push(setTimeout(onComplete, TOTAL_DURATION_MS));

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <Box className={styles.processingPage}>
      <Box className="flex flex-col items-center gap-8 px-6 max-w-sm w-full">
        <Box className="relative flex items-center justify-center">
          {!isDone ? (
            <>
              <Box
                className={`w-20 h-20 rounded-full border-[3px] border-(--app-border) border-t-[var(--app-primary)] ${styles.spinRing}`}
              />
              <Box className={`absolute inset-0 flex items-center justify-center ${styles.iconPulse}`}>
                <Box className="w-10 h-10 rounded-full bg-(--app-primary)/10 flex items-center justify-center">
                  <Box className="w-5 h-5 rounded-full bg-(--app-primary)" />
                </Box>
              </Box>
            </>
          ) : (
            <Box className={`flex items-center justify-center ${styles.checkPop}`}>
              <CheckCircleIcon className="text-[72px] text-[#10b981]" />
            </Box>
          )}
        </Box>

        <Box className="text-center space-y-2">
          <Typography className="font-black text-[22px] sm:text-[26px] text-(--app-text) tracking-tight leading-tight">
            {isDone ? "Booking Confirmed!" : "Processing Payment"}
          </Typography>
          <Typography className="text-[13px] text-(--app-muted) font-medium">
            {isDone ? `Your appointment at ${salonName} is confirmed` : "Please don't close this page"}
          </Typography>
        </Box>

        <Box className="w-full space-y-4">
          <Box className="w-full h-1.5 bg-(--app-border) rounded-full overflow-hidden">
            <Box
              className={`h-full bg-(--app-primary) rounded-full ${styles.progressBar}`}
              style={{ "--processing-duration": `${TOTAL_DURATION_MS}ms` } as React.CSSProperties}
            />
          </Box>

          <Box className="space-y-3">
            {PROCESSING_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || isDone;

              return (
                <Box
                  key={step.label}
                  className={`flex items-center gap-3 transition-all duration-300 ${isActive || isCompleted ? "opacity-100" : "opacity-30"
                    }`}
                >
                  <Box
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isCompleted
                        ? "bg-[#10b981]"
                        : isActive
                          ? "bg-(--app-primary)"
                          : "bg-(--app-border)"
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="text-white text-[14px]" />
                    ) : isActive ? (
                      <Box className="flex gap-0.5">
                        {[0, 1, 2].map((dot) => (
                          <Box key={dot} className={`w-1 h-1 rounded-full bg-white ${styles.dot}`} />
                        ))}
                      </Box>
                    ) : (
                      <Box className="w-1.5 h-1.5 rounded-full bg-(--app-muted)" />
                    )}
                  </Box>
                  <Typography
                    className={`text-[13px] font-semibold transition-colors duration-300 ${isCompleted
                        ? "text-[#10b981]"
                        : isActive
                          ? "text-(--app-text)"
                          : "text-(--app-muted)"
                      }`}
                  >
                    {step.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Typography className="text-[10px] text-(--app-muted) font-medium tracking-wide opacity-50 mt-2">
          Secured by Stripe • 256-bit encryption
        </Typography>
      </Box>
    </Box>
  );
}

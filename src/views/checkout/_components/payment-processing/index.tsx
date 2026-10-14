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
      <Box className={styles.contentWrapper}>
        <Box className={styles.spinnerContainer}>
          {!isDone ? (
            <>
              <Box className={`${styles.spinnerRing} ${styles.spinRing}`} />
              <Box className={`${styles.iconPulseBox} ${styles.iconPulse}`}>
                <Box className={styles.innerPulseCircle}>
                  <Box className={styles.centerDot} />
                </Box>
              </Box>
            </>
          ) : (
            <Box className={`${styles.spinnerContainer} ${styles.checkPop}`}>
              <CheckCircleIcon className={styles.checkIcon} />
            </Box>
          )}
        </Box>

        <Box className={styles.textCenter}>
          <Typography className={styles.title}>
            {isDone ? "Booking Confirmed!" : "Processing Payment"}
          </Typography>
          <Typography className={styles.subtitle}>
            {isDone ? `Your appointment at ${salonName} is confirmed` : "Please don't close this page"}
          </Typography>
        </Box>

        <Box className={styles.stepsSection}>
          <Box className={styles.progressTrack}>
            <Box
              className={`${styles.progressFill} ${styles.progressBar}`}
            />
          </Box>

          <Box className={styles.stepsList}>
            {PROCESSING_STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || isDone;

              return (
                <Box
                  key={step.label}
                  className={`${styles.stepRow} ${
                    isActive || isCompleted ? styles.stepActive : styles.stepInactive
                  }`}
                >
                  <Box
                    className={`${styles.stepBadge} ${
                      isCompleted
                        ? styles.stepBadgeCompleted
                        : isActive
                          ? styles.stepBadgeActive
                          : styles.stepBadgePending
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className={styles.stepCheckIcon} />
                    ) : isActive ? (
                      <Box className={styles.stepDots}>
                        {[0, 1, 2].map((dot) => (
                          <Box key={dot} className={`${styles.stepSingleDot} ${styles.dot}`} />
                        ))}
                      </Box>
                    ) : (
                      <Box className={styles.stepPendingDot} />
                    )}
                  </Box>
                  <Typography
                    className={`${styles.stepLabel} ${
                      isCompleted
                        ? styles.stepLabelCompleted
                        : isActive
                          ? styles.stepLabelActive
                          : styles.stepLabelPending
                    }`}
                  >
                    {step.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Typography className={styles.securityNote}>
          Secured by Stripe • 256-bit encryption
        </Typography>
      </Box>
    </Box>
  );
}

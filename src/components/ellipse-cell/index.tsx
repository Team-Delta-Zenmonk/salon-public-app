"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";
import styles from "./ellipse-cell.module.css";

export interface EllipsisCellProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string;
  maxLines?: number;
  maxChars?: number;
  className?: string;
  forceTooltip?: boolean;
  children?: React.ReactNode;
}

export const EllipsisCell: React.FC<EllipsisCellProps> = ({
  value,
  maxLines = 1,
  maxChars = 50,
  className,
  forceTooltip = false,
  children,
  ...props
}) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isCharTruncated = Boolean(maxChars && value && value.length > maxChars);
  const displayValue = isCharTruncated ? `${value.slice(0, maxChars)}...` : (value || "");

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const checkOverflow = () => {
      const target = (element.querySelector("input, textarea") as HTMLElement) || element;
      setIsOverflowing(
        isCharTruncated ||
        target.scrollWidth > target.clientWidth ||
        target.scrollHeight > target.clientHeight
      );
    };

    checkOverflow();

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [value, maxChars, isCharTruncated]);

  const touchStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const positionTooltip = useCallback((el?: HTMLDivElement | null) => {
    const tooltipEl = el || tooltipRef.current;
    if (!elementRef.current || !tooltipEl) return;
    const target = (elementRef.current.querySelector("input, textarea") as HTMLElement) || elementRef.current;
    const rect = target.getBoundingClientRect();

    const tooltipHeight = tooltipEl.offsetHeight || 36;
    const tooltipWidth = tooltipEl.offsetWidth || 180;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeBottom = spaceAbove < tooltipHeight + 16 && spaceBelow > spaceAbove;

    const top = placeBottom ? rect.bottom + 8 : rect.top - 8;

    const halfWidth = tooltipWidth / 2;
    const targetCenter = rect.left + rect.width / 2;
    const minLeft = halfWidth + 12;
    const maxLeft = window.innerWidth - halfWidth - 12;
    const left = Math.max(minLeft, Math.min(maxLeft, targetCenter));

    tooltipEl.style.setProperty("--tooltip-top", `${top}px`);
    tooltipEl.style.setProperty("--tooltip-left", `${left}px`);
    tooltipEl.dataset.placement = placeBottom ? "bottom" : "top";
  }, []);

  const setTooltipRef = useCallback((el: HTMLDivElement | null) => {
    tooltipRef.current = el;
    if (el) {
      positionTooltip(el);
    }
  }, [positionTooltip]);

  useEffect(() => {
    if (!showTooltip) return;
    const handleDismiss = () => setShowTooltip(false);
    window.addEventListener("scroll", handleDismiss, { passive: true, capture: true });
    window.addEventListener("resize", handleDismiss, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleDismiss, { capture: true });
      window.removeEventListener("resize", handleDismiss);
    };
  }, [showTooltip]);

  const checkCurrentlyOverflowing = (): boolean => {
    const element = elementRef.current;
    if (!element) return isOverflowing;
    const target = (element.querySelector("input, textarea") as HTMLElement) || element;
    const overflowing =
      isCharTruncated ||
      target.scrollWidth > target.clientWidth ||
      target.scrollHeight > target.clientHeight;
    if (overflowing !== isOverflowing) {
      setIsOverflowing(overflowing);
    }
    return overflowing;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const overflowing = checkCurrentlyOverflowing();
    if (overflowing || forceTooltip || isCharTruncated) {
      setShowTooltip(true);
      positionTooltip();
    }
    props.onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowTooltip(false);
    props.onMouseLeave?.(e);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLSpanElement>) => {
    const overflowing = checkCurrentlyOverflowing();
    if (overflowing || forceTooltip || isCharTruncated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowTooltip(true);
        positionTooltip();
      }, 200);
    }
    props.onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    props.onMouseUp?.(e);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLSpanElement>) => {
    const touch = e.touches[0];
    if (touch) {
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    }
    const overflowing = checkCurrentlyOverflowing();
    if (overflowing || forceTooltip || isCharTruncated) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowTooltip(true);
        positionTooltip();
      }, 200);
    }
    props.onTouchStart?.(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLSpanElement>) => {
    const touch = e.touches[0];
    if (touch) {
      const dx = Math.abs(touch.clientX - touchStartPos.current.x);
      const dy = Math.abs(touch.clientY - touchStartPos.current.y);
      if (dx > 10 || dy > 10) {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setShowTooltip(false);
      }
    }
    props.onTouchMove?.(e);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLSpanElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setTimeout(() => setShowTooltip(false), 1500);
    props.onTouchEnd?.(e);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const portalContent = showTooltip && Boolean(value) && typeof window !== "undefined" && (
    <div
      ref={setTooltipRef}
      className={styles.tooltip}
    >
      {value}
    </div>
  );

  return (
    <>
      <span
        ref={elementRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => {
          if (showTooltip) e.preventDefault();
        }}
        className={clsx(
          children ? styles.cell : styles.cellTruncated,
          maxLines === 1 && !children ? styles.singleLine : "",
          maxLines === 2 ? styles.multiLine2 : "",
          maxLines === 3 ? styles.multiLine3 : "",
          maxLines >= 4 ? styles.multiLine4 : "",
          className
        )}
        {...props}
      >
        {children || displayValue}
      </span>
      {portalContent && ReactDOM.createPortal(portalContent, document.body)}
    </>
  );
};

export default EllipsisCell;

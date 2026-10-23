"use client";
import React, { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./custom-select.module.css";

export interface CustomSelectOption {
  id: string | number;
  label: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string | number;
  options: CustomSelectOption[];
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  buttonSize?: "sm" | "md" | "lg";
  rounded?: "default" | "sm" | "md" | "lg" | "4px";
  menuWidth?: string | number;
  maxChars?: number;
  menuMaxChars?: number;
  align?: "left" | "right";
}

export default function CustomSelect({
  label,
  value,
  options,
  onChange,
  className = "",
  buttonClassName = "",
  buttonSize,
  rounded,
  menuWidth = 200,
  maxChars = 20,
  menuMaxChars = 30,
  align = "right",
}: Readonly<CustomSelectProps>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const selectedOption = options.find((opt) => String(opt.id) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : String(value);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (nextVal: string | number) => {
    onChange(String(nextVal));
    handleClose();
  };

  const sizeClass =
    buttonSize === "sm"
      ? styles.buttonSm
      : buttonSize === "lg"
      ? styles.buttonLg
      : buttonSize === "md"
      ? styles.buttonMd
      : "";

  const roundedClass = rounded === "4px" ? styles.buttonRounded4 : "";

  return (
    <div className={`${styles.root} ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className={`${styles.button} ${sizeClass} ${roundedClass} ${buttonClassName}`.trim()}
      >
        <div className={`${styles.value} ${align === "right" ? styles.valueRight : ""}`}>
          {label && (
            <span className={styles.label}>
              {label}
            </span>
          )}
          <span className={`${styles.valueText} ${align === "right" ? styles.valueTextRight : ""}`}>
            <EllipsisCell value={displayLabel} maxChars={maxChars} className="capitalize" />
          </span>
        </div>
        <ArrowDropDownIcon className={styles.icon} />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        transitionDuration={0}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            className: styles.menuPaper,
            style: {
              width: anchorEl ? `${anchorEl.offsetWidth}px` : undefined,
              minWidth: anchorEl ? `${anchorEl.offsetWidth}px` : (typeof menuWidth === "number" ? `${menuWidth}px` : menuWidth),
            },
          },
        }}
      >
        {options.map((option) => {
          const isSelected = String(option.id) === String(value);
          return (
            <MenuItem
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={`${styles.menuItem} ${isSelected ? styles.menuItemSelected : styles.menuItemHover}`}
            >
              <EllipsisCell value={option.label} maxChars={menuMaxChars} className="capitalize" />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}

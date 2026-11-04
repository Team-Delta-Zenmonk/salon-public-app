"use client";

import React, { forwardRef, useId } from "react";
import EllipsisCell from "@/components/ellipse-cell";
import styles from "./custom-input.module.css";

export interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "pattern"> {
  label?: string;
  error?: string;
  helperText?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  pattern?: RegExp;
  extraSpacesNotAllowed?: boolean;
  onChange?: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  wrapperClassName?: string;
  inputClassName?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      helperText,
      startAdornment,
      endAdornment,
      pattern,
      extraSpacesNotAllowed = true,
      onChange,
      value,
      type = "text",
      id,
      disabled,
      maxLength,
      className,
      wrapperClassName,
      inputClassName,
      placeholder,
      onKeyDown,
      ...restProps
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const valString = value !== undefined && value !== null ? String(value) : "";
    const hasError = Boolean(error);

    const handleNumberKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !/\d/.test(evt.key) &&
        evt.key !== "Backspace" &&
        evt.key !== "Delete" &&
        evt.key !== "ArrowLeft" &&
        evt.key !== "ArrowRight" &&
        evt.key !== "ArrowUp" &&
        evt.key !== "ArrowDown" &&
        evt.key !== "Tab"
      ) {
        evt.preventDefault();
      }
    };

    const handleBeforeInput = (e: any) => {
      if (!e.data) return;
      const target = e.target as HTMLInputElement;
      const { selectionStart, selectionEnd, value: curVal } = target;
      const start = selectionStart ?? curVal.length;
      const end = selectionEnd ?? curVal.length;
      const nextVal = curVal.slice(0, start) + e.data + curVal.slice(end);

      if (extraSpacesNotAllowed && !curVal.trim() && !nextVal.trim()) {
        e.preventDefault();
        return;
      }

      if (pattern && !pattern.test(nextVal)) {
        e.preventDefault();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawVal = e.target.value;

      if (extraSpacesNotAllowed) {
        rawVal = rawVal.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
      }

      if (!pattern || pattern.test(rawVal)) {
        onChange?.(rawVal, e);
      }
    };

    return (
      <div className={`${styles.root} ${wrapperClassName || ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`${styles.label} ${hasError ? styles.labelError : ""} ${
              disabled ? styles.labelDisabled : ""
            }`}
          >
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          {startAdornment && (
            <div className={styles.startAdornment}>{startAdornment}</div>
          )}

          <EllipsisCell value={valString} className={styles.ellipsisWrapper}>
            <input
              id={inputId}
              ref={ref}
              type={type}
              value={valString}
              disabled={disabled}
              maxLength={maxLength}
              placeholder={placeholder}
              onBeforeInput={handleBeforeInput}
              onKeyDown={(e) => {
                if (type === "number" || (pattern && pattern.source.includes("\\d*"))) {
                  if (type === "number") handleNumberKeyDown(e);
                }
                onKeyDown?.(e);
              }}
              onChange={handleChange}
              className={`${styles.input} ${
                startAdornment ? styles.inputWithStart : ""
              } ${endAdornment ? styles.inputWithEnd : ""} ${
                hasError ? styles.inputError : ""
              } ${disabled ? styles.inputDisabled : ""} ${
                inputClassName || ""
              } ${className || ""}`}
              {...restProps}
            />
          </EllipsisCell>

          {endAdornment && <div className={styles.endAdornment}>{endAdornment}</div>}
        </div>

        {hasError ? (
          <span className={styles.errorText}>{error}</span>
        ) : helperText ? (
          <span className={styles.helperText}>{helperText}</span>
        ) : null}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;

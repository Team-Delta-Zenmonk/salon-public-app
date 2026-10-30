import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import styles from "./arrow-buttons.module.scss";
import clsx from "clsx";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import type { FieldError, FieldValues, Path, PathValue } from "react-hook-form";

type ArrowButtonsProps<T extends FieldValues> = {
  endAdornmentClassName?: string;
  onChange: (...event: any[]) => void;
  value: PathValue<T, Path<T>>;
  error: FieldError | undefined;
  identifier: string;
  disabled?: boolean;
};

function ArrowButtons<T extends FieldValues>({
  endAdornmentClassName,
  onChange,
  value,
  error,
  identifier,
  disabled = false,
}: Readonly<ArrowButtonsProps<T>>)  {
  const handleUp = () => {
    if (disabled) return;
    const newValue = value ? Math.min(1000000, Number(value) + 1) : 1;
    onChange(String(newValue));
  };

  const handleDown = () => {
    if (disabled) return;
    const newValue = value && Number(value) > 1 ? Number(value) - 1 : 1;
    onChange(String(newValue));
  };

  return (
    <InputAdornment
      className={endAdornmentClassName && clsx(error ? styles.endAdornmentError : styles[endAdornmentClassName])}
      position="end"
    >
      <Stack>
        <IconButton
          className={styles.arrowBtn}
          onClick={handleUp}
          disabled={disabled}
          data-test-id={`btn-number-input-arrow-up-${identifier}`}
        >
          <ArrowDropUpIcon className="iconSizeStyles" />
        </IconButton>
        <IconButton
          className={styles.arrowBtn}
          onClick={handleDown}
          disabled={disabled}
          data-test-id={`btn-number-input-arrow-down-${identifier}`}
        >
          <ArrowDropDownIcon className="iconSizeStyles" />
        </IconButton>
      </Stack>
    </InputAdornment>
  );
}

export default ArrowButtons;

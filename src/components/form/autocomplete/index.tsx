import { Autocomplete as MuiAutocomplete, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import clsx from "clsx";
import { Controller, type FieldValues } from "react-hook-form";
import styles from "./autocomplete.module.scss";
import type { CustomAutocompleteProps } from "./autocomplete.type";

const Autocomplete = <T extends FieldValues>({
  placeholder,
  name,
  options,
  control,
  identifier,
  disabled = false,
  onChangeCallback,
}: CustomAutocompleteProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find((opt) => opt.value === value) || null;

        return (
          <FormControl fullWidth error={!!error?.type}>
            <MuiAutocomplete
              disabled={disabled}
              options={options}
              value={selectedOption}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, val) => option.value === val.value}
              onChange={(_, newValue) => {
                const val = newValue ? newValue.value : "";
                onChange(val);
                if (onChangeCallback) onChangeCallback(newValue);
              }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps} className={clsx(props.className, styles.option)}>
                    <Typography variant="paragraphMd" color="secondary">
                      {option.label}
                    </Typography>
                  </li>
                );
              }}
              classes={{
                root: clsx(styles.autocompleteRoot, value && value !== "" && styles.autocompleteActive),
                paper: styles.paper,
                option: styles.option,
              }}
              data-test-id={`autocomplete-${identifier}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={placeholder}
                  error={!!error?.type}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    className: clsx(params.InputLabelProps?.className, styles.label, { [styles.disabledLabel]: disabled }),
                  }}
                  data-test-id={`input-autocomplete-${identifier}`}
                />
              )}
            />
            {error && (
              <FormHelperText data-test-id={`text-error-${identifier}`}>{error?.message}</FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default Autocomplete;

import type { Control, FieldValues, Path } from "react-hook-form";

export type CustomAutocompleteProps<T extends FieldValues> = {
  placeholder: string;
  name: Path<T>;
  options: Array<{ value: string; label: string; [key: string]: any }>;
  control: Control<T>;
  identifier: string;
  disabled?: boolean;
  onChangeCallback?: (value: any) => void;
};

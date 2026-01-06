import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import SearchBar from "../../../../components/searchbar";
import Select from "../../../../components/form/select";

type FiltersForm = {
  category: string;
};

type Option = { label: string; value: string };

interface DiscoveryFiltersProps {
  categoryOptions: Option[];
  onSearch: (value: string) => void;
  onCategoryChange?: (value: string) => void;
}

export default function DiscoveryFilters({ categoryOptions, onSearch, onCategoryChange }: DiscoveryFiltersProps) {
  const { control, watch } = useForm<FiltersForm>({
    defaultValues: { category: "" },
  });

  const category = watch("category");

  return (
    <Box className="flex flex-col md:flex-row md:items-center gap-4">
      <Box className="flex-1">
        <SearchBar placeholder="Search salons" onSearch={onSearch} />
      </Box>

      <Box className="w-full md:w-65">
        <Select
          name="category"
          placeholder="Category"
          identifier="salon-category"
          options={categoryOptions}
          control={control}
        />
      </Box>
    </Box>
  );
}

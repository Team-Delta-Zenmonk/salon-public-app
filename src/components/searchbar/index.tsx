import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import React from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const debouncedSearch = useDebouncedCallback((query: string) => {
    onSearch(query);
  }, 400);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.trim().replace(/\s{2,}/g, " ");
    setSearchQuery(input);

    if (cleaned === "") {
      debouncedSearch.cancel();
      handleClearSearch();
    } else {
      debouncedSearch(cleaned);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <TextField
      size="medium"
      className="w-full max-w-175 [&_.MuiInputBase-root]:h-12 [&_.MuiInputBase-root]:rounded-[14px]"
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleOnChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-(--app-muted)" />
            </InputAdornment>
          ),
          ...(searchQuery && {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Clear">
                  <IconButton onClick={handleClearSearch}>
                    <CloseIcon className="text-(--app-muted)" />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }),
        },
      }}
    />
  );
};

export default SearchBar;

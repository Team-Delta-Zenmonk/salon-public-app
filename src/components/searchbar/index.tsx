import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import React, { useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { sanitizeSearchInput } from "../../common/search.utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

import styles from "./searchbar.module.css";

const SearchBar = ({ onSearch, placeholder, initialValue }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = React.useState(initialValue || "");

  useEffect(() => {
    if (initialValue !== undefined) {
      setSearchQuery(initialValue);
    }
  }, [initialValue]);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    onSearch(query);
  }, 400);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = sanitizeSearchInput(e.target.value);
    setSearchQuery(input);

    if (input === "") {
      debouncedSearch.cancel();
      handleClearSearch();
    } else {
      debouncedSearch(input.trim());
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <TextField
      size="medium"
      className={styles.searchField}
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleOnChange}
      slotProps={{
        htmlInput: {
          className: styles.inputControl,
        },
        input: {
          style: {
            WebkitTextFillColor: "var(--app-text)",
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={styles.iconMuted} />
            </InputAdornment>
          ),
          ...(searchQuery && {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Clear">
                  <IconButton onClick={handleClearSearch}>
                    <CloseIcon className={styles.iconMuted} />
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

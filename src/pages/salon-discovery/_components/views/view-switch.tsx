import { IconButton, Stack, Tooltip } from "@mui/material";
import type { ViewMode } from "../../constants/view-mode.type";
import { VIEW_MODES } from "./view-modes";
import clsx from "clsx";

interface Props {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
}

export default function DiscoveryViewSwitch({ value, onChange }: Props) {
  return (
    <Stack
      direction="row"
      spacing={0.5}
      className="justify-end items-center h-10 sm:h-12 rounded-[14px] bg-(--app-surface-alt) p-1 border border-(--app-border) shadow-xs shrink-0"
    >
      {VIEW_MODES.map(({ label, value: v, Icon }) => {
        const isActive = value === v;
        return (
          <Tooltip key={v} title={label}>
            <IconButton
              onClick={() => onChange(v)}
              className={clsx(
                "w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 rounded-[10px]",
                isActive
                  ? "bg-(--app-surface) text-(--app-primary) shadow-xs"
                  : "text-(--app-muted) hover:text-(--app-text) hover:bg-(--app-surface-alt)/80",
              )}
            >
              <Icon className="text-[16px] sm:text-[18px]" />
            </IconButton>
          </Tooltip>
        );
      })}
    </Stack>
  );
}

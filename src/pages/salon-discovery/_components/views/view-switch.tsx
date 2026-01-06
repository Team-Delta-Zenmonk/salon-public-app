import { IconButton, Stack, Tooltip } from "@mui/material";
import type { ViewMode } from "../../constants/view-mode.type";
import { VIEW_MODES } from "./view-modes";

interface Props {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
}

export default function DiscoveryViewSwitch({ value, onChange }: Props) {
  return (
    <Stack direction="row" spacing={1} className="justify-end">
      {VIEW_MODES.map(({ label, value: v, Icon }) => (
        <Tooltip key={v} title={label}>
          <IconButton color={value === v ? "primary" : "default"} onClick={() => onChange(v)}>
            <Icon />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}

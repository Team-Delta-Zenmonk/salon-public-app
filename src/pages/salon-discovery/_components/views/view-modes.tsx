import type { SvgIconComponent } from "@mui/icons-material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import type { ViewMode } from "../../constants/view-mode.type";

export type ViewModeOption = {
  label: string;
  value: ViewMode;
  Icon: SvgIconComponent;
};

export const VIEW_MODES: ViewModeOption[] = [
  { label: "List view", value: "list", Icon: ViewListIcon },
  { label: "Grid view", value: "grid", Icon: GridViewIcon },
  { label: "Map view", value: "map", Icon: LocationOnOutlinedIcon },
];

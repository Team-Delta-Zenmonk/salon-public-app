import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

export interface NavItem {
  label: string;
  to: string;
  icon: any;
}

export const STOREFRONT_NAV_ITEMS: NavItem[] = [
  { label: "Home", to: "/", icon: HomeOutlinedIcon },
  { label: "Services", to: "/services", icon: ContentCutOutlinedIcon },
  { label: "Specialists", to: "/specialists", icon: PeopleOutlineOutlinedIcon },
  { label: "About & Hours", to: "/about", icon: InfoOutlinedIcon },
];

export const navigation: NavItem[] = [
  ...STOREFRONT_NAV_ITEMS,
  { label: "Bookings", to: "/bookings", icon: BookOnlineOutlinedIcon },
  { label: "Profile", to: "/profile", icon: PersonOutlineOutlinedIcon },
];

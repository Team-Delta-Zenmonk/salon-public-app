import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Badge, IconButton } from "@mui/material";

interface CartIconProps {
  count?: number;
  onClick?: () => void;
}

export default function CartIcon({ count = 0, onClick }: CartIconProps) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      className="border border-(--app-border) bg-(--app-surface) hover:bg-(--app-surface-alt) rounded-xl"
    >
      <Badge badgeContent={count} color="primary" className="[&_.MuiBadge-badge]:font-bold">
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}

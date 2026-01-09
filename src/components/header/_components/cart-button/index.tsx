import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Badge, IconButton } from "@mui/material";

interface CartIconProps {
  count?: number;
  onClick?: () => void;
}

export default function CartIcon({ count = 0, onClick }: CartIconProps) {
  return (
    <IconButton size="small" onClick={onClick}>
      <Badge badgeContent={count} color="primary">
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}

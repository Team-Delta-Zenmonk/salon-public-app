import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Badge, IconButton } from "@mui/material";
import styles from "./cart-button.module.css";

interface CartIconProps {
  count?: number;
  onClick?: () => void;
}

export default function CartIcon({ count = 0, onClick }: Readonly<CartIconProps>) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      className={styles.cartBtn}
    >
      <Badge
        badgeContent={count}
        color="primary"
        className={styles.cartBadge}
      >
        <ShoppingCartOutlinedIcon />
      </Badge>
    </IconButton>
  );
}

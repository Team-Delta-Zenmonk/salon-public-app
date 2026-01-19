import { Box, Typography, Divider, Paper, Avatar } from "@mui/material";
import { useAppSelector } from "../../store/hook";
import CartItem from "./_components/cart-items";

export default function Cart() {
  const { items, salon, loaded } = useAppSelector((s) => s.cart);

  if (!loaded) return null;

  if (!items.length) {
    return (
      <Box className="p-6 text-center">
        <Typography color="text.secondary">Your cart is empty</Typography>
      </Box>
    );
  }

  const totalPrice = items.reduce((sum: number, i: any) => sum + (i.final_price ?? i.base_price ?? 0), 0);

  const totalDuration = items.reduce((sum: number, i: any) => sum + (i.duration ?? 0), 0);

  return (
    <Box className="p-4 max-w-3xl mx-auto space-y-4">
      {/* SALON HEADER */}
      {salon && (
        <Paper variant="outlined" className="p-4 rounded-xl">
          <Box className="flex gap-3 items-center">
            <Avatar src={salon.logo} variant="rounded" sx={{ width: 56, height: 56 }} />

            <Box>
              <Typography fontWeight={600}>{salon.name}</Typography>

              <Typography variant="body2" color="text.secondary" className="line-clamp-2">
                {salon.address}
              </Typography>

<Typography variant="caption" color="text.secondary">
  {(salon.type ?? "Salon").toUpperCase()}
</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* CART SUMMARY */}
      <Paper variant="outlined" className="p-4 rounded-xl">
        <Typography variant="h6">Your Cart</Typography>

        <Typography variant="body2" color="text.secondary">
          Services from one salon
        </Typography>

        <Divider className="my-3" />

        <Box className="flex justify-between text-sm">
          <Typography>Total Duration</Typography>
          <Typography>{totalDuration} min</Typography>
        </Box>

        <Box className="flex justify-between font-medium mt-1">
          <Typography>Total</Typography>
          <Typography>₹{totalPrice}</Typography>
        </Box>
      </Paper>

      {/* CART ITEMS */}
      <Box className="space-y-3">
        {items.map((item: any) => (
          <CartItem key={item.uuid} item={item} />
        ))}
      </Box>
    </Box>
  );
}

import { useEffect } from "react";
import { Box, Typography, Avatar, Button, Skeleton, Divider } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { getCartAction } from "../../features/salon/cart/get-cart/get-cart.action";
import CartItem from "./_components/cart-items";

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, salon, loaded } = useAppSelector((s) => s.cart);
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated && customer?.uuid) {
      dispatch(getCartAction(customer.uuid));
    }
  }, []);

  if (!loaded) {
    return (
      <Box className="p-6 max-w-6xl mx-auto space-y-3">
        <Skeleton variant="rounded" height={160} className="rounded-2xl" />
        {[1, 2].map((i) => (
          <Skeleton key={i} variant="rounded" height={80} className="rounded-2xl" />
        ))}
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box className="flex flex-col items-center justify-center p-16 text-center gap-4">
        <Box className="w-18 h-18 rounded-2xl bg-slate-100 flex items-center justify-center">
          <StorefrontIcon className="text-[32px] text-slate-400" />
        </Box>
        <Box>
          <Typography className="font-bold text-lg">Your cart is empty</Typography>
          <Typography variant="body2" color="text.secondary" className="mt-1">
            Browse salons and add services to get started
          </Typography>
        </Box>
      </Box>
    );
  }

  const totalPrice = items.reduce((sum: number, i: any) => sum + (i.final_price ?? i.base_price ?? 0), 0);
  const totalDuration = items.reduce((sum: number, i: any) => sum + (i.duration ?? 0), 0);
  const hours = Math.floor(totalDuration / 60);
  const mins = totalDuration % 60;
  const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins} min`;

  return (
    <Box className="bg-slate-50 min-h-full p-4 sm:p-8">
      {salon && (
        <Box className="relative rounded-2xl overflow-hidden mb-6 bg-slate-900 min-h-35">
          {salon.logo && (
            <Box
              component="img"
              src={salon.logo}
              className="absolute inset-0 w-full h-full object-cover opacity-15 blur-xl scale-110"
            />
          )}

          <Box className="relative p-6 sm:p-8 flex items-center gap-6">
            <Avatar
              src={salon.logo}
              variant="rounded"
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-[10px] border-2 border-white/20 shrink-0"
            />

            <Box className="flex-1 min-w-0">
              <Box className="flex items-center gap-2 mb-1 flex-wrap">
                <Typography className="font-extrabold text-lg sm:text-2xl md:text-[26px] text-white leading-none">
                  {salon.name}
                </Typography>
                <Box className="px-3 py-1 bg-white/15 rounded-full border border-white/20">
                  <Typography className="text-white text-[11px] font-semibold tracking-wide">
                    {(salon.type ?? "salon").toUpperCase()}
                  </Typography>
                </Box>
              </Box>

              <Box className="flex items-center gap-1">
                <PlaceIcon className="text-[13px] text-white/50" />
                <Typography variant="caption" className="text-white/60 text-xs line-clamp-1">
                  {salon.address}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      <Box className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-6 items-start">
        <Box>
          <Typography variant="caption" className="font-bold text-slate-400 block mb-3 ml-0.5 tracking-widest">
            {items.length} SERVICE{items.length > 1 ? "S" : ""}
          </Typography>

          <Box className="space-y-2">
            {items.map((item: any) => (
              <CartItem key={item.uuid ?? item.service_id} item={item} />
            ))}
          </Box>
        </Box>

        <Box className="bg-white border border-slate-200 rounded-2xl overflow-hidden lg:sticky lg:top-4">
          <Box className="px-6 py-5 border-b border-slate-100">
            <Typography className="font-bold text-[15px]">Order Summary</Typography>
          </Box>

          <Box className="px-6 py-5">
            <Box className="flex justify-between items-center mb-3">
              <Box className="flex items-center gap-1.5">
                <AccessTimeIcon className="text-[15px] text-slate-400" />
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
              </Box>
              <Typography variant="body2" className="font-semibold">
                {durationText}
              </Typography>
            </Box>

            <Box className="flex justify-between items-center mb-3">
              <Box className="flex items-center gap-1.5">
                <CalendarMonthIcon className="text-[15px] text-slate-400" />
                <Typography variant="body2" color="text.secondary">
                  Services
                </Typography>
              </Box>
              <Typography variant="body2" className="font-semibold">
                {items.length}
              </Typography>
            </Box>

            <Divider className="my-4" />

            <Box className="flex justify-between items-center mb-4">
              <Typography className="font-bold">Total</Typography>
              <Typography className="font-extrabold text-[22px] text-slate-900">₹{totalPrice}</Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              disableElevation
              className="rounded-xl font-bold py-3 bg-slate-900 hover:bg-slate-800 text-sm tracking-wide"
            >
              Proceed to Book
            </Button>

            <Typography variant="caption" color="text.secondary" className="block text-center mt-3">
              Select staff & time you want to book
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

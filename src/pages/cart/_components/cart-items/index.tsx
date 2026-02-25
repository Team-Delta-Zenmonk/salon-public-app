import { Box, Typography, IconButton, Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { removeItemLocal } from "../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../features/salon/cart/remove-item/remove-item.action";
import ConfirmRemoveItemDialog from "../remove-item-dialog";

interface CartItemProps {
  item: any;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const { isGuest } = useAppSelector((s) => s.cart);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const service = item.service;
  const name = service?.name ?? "Service";
  const image = service?.logo;
  const duration = item.duration;
  const price = item.final_price ?? item.base_price;
  const gender = service?.gender;

  const onConfirmRemove = () => {
    if (isGuest) {
      dispatch(removeItemLocal(item.service_id));
    } else {
      dispatch(removeCartItemAction(item.uuid));
    }
    setConfirmOpen(false);
  };

  return (
    <>
      <Box className="flex items-center gap-4 sm:gap-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 transition-all duration-150 hover:border-slate-300 hover:shadow-md">
        <Avatar
          src={image}
          variant="rounded"
          className="rounded-xl flex-shrink-0 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20"
        />
        <Box className="flex-1 min-w-0">
          <Typography className="font-bold text-sm sm:text-base md:text-[17px] text-slate-900 truncate">
            {name}
          </Typography>
          <Box className="flex items-center gap-1.5 mt-1">
            <AccessTimeIcon className="text-slate-400 text-xs sm:text-[13px]" />
            <Typography variant="caption" className="text-slate-400 text-[11px] sm:text-[13px]">
              {duration} min
              {gender && (
                <>
                  <Box component="span" className="mx-1.5 text-slate-300">•</Box>
                  <Box component="span" className="capitalize">{gender}</Box>
                </>
              )}
            </Typography>
          </Box>
        </Box>
        <Box className="flex items-center gap-4 sm:gap-5 flex-shrink-0">
          <Box className="text-right">
            <Typography className="font-extrabold text-[15px] sm:text-lg md:text-xl text-slate-900 leading-none">
              ₹{price}
            </Typography>
          </Box>
          <IconButton
            onClick={() => setConfirmOpen(true)}
            className="text-slate-300 border border-slate-100 rounded-xl w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] transition-all duration-150 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
          >
            <DeleteOutlineIcon className="text-base sm:text-lg" />
          </IconButton>
        </Box>
      </Box>
      <ConfirmRemoveItemDialog
        open={confirmOpen}
        serviceName={name}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={onConfirmRemove}
      />
    </>
  );
}
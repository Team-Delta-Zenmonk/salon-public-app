import { Box, Typography, Chip, IconButton, Avatar } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
      <Box className="flex gap-4 items-center border border-slate-200 rounded-2xl p-3 bg-white hover:shadow-sm transition">
        <Avatar src={image} variant="rounded" sx={{ width: 64, height: 64 }} />

        <Box className="flex-1 min-w-0">
          <Typography className="font-medium truncate">{name}</Typography>

          <Typography variant="body2" color="text.secondary">
            {duration} min
            {gender && ` • ${gender.toUpperCase()}`}
          </Typography>
        </Box>

        <Box className="flex flex-col items-end gap-1">
          <Chip label={`₹${price}`} size="small" color="primary" />

          <IconButton size="small" onClick={() => setConfirmOpen(true)}>
            <DeleteOutlineIcon fontSize="small" />
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

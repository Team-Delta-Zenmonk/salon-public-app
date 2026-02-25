import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Avatar, Box, Button, Chip, Collapse, IconButton } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../../../../../../store/hook";
import type { RootState } from "../../../../../../../../store/store";
import { addItemLocal, clearCart } from "../../../../../../../../features/salon/cart/cart.slice";
import { createCartAction } from "../../../../../../../../features/salon/cart/create-cart/create-cart.action";
import { addCartItemAction } from "../../../../../../../../features/salon/cart/add-item/add-item.action";
import { deleteCartAction } from "../../../../../../../../features/salon/cart/delete-cart/delete-cart.action";
import { callSnack } from "../../../../../../../../components/snackbar";
import SwitchCartDialog from "./_components/switch-cart-dialog";
import { getGenderChipConfig } from "./_components/utils/gender-chip-config";
import { getCartAction } from "../../../../../../../../features/salon/cart/get-cart/get-cart.action";

export default function ServiceCard({ service, subServices, salon }: { service: any; subServices: any[]; salon: any }) {
  const [open, setOpen] = useState(false);
  const [switchDialog, setSwitchDialog] = useState(false);
  const [pendingItem, setPendingItem] = useState<any>(null);

  const hasSubServices = subServices.length > 0;
  const { salonId } = useParams<{ salonId: string }>();
  const dispatch = useAppDispatch();
  const { isAuthenticated, customer } = useAppSelector((s: RootState) => s.auth);
  const cart = useAppSelector((s: RootState) => s.cart);
  console.log("cart items:", cart.items);

  const isAdded = (serviceId: string) =>
    cart.items.some((i: any) => i.service?.uuid === serviceId || i.service_id === serviceId);
  const currentCartItemsCount = (cart.items ?? []).length;

  const formatPrice = (s: any) => (s.price_type === "from" ? `From ₹${s.price}` : `₹${s.price}`);

  const handleSwitchCart = async () => {
    if (!pendingItem || !salonId) return;

    const payload = {
      service_id: pendingItem.uuid,
      duration: pendingItem.duration,
      name: pendingItem.name,
      base_price: pendingItem.price,
    };

    try {
      if (cart.cartUuid) {
        await dispatch(deleteCartAction(cart.cartUuid)).unwrap();
      }
      dispatch(clearCart());

      await dispatch(createCartAction({salon_id: salonId, user_id: customer!.uuid, items: [payload]})).unwrap();

      callSnack("New cart created for this salon", "success");
    } catch (error: any) {
      callSnack(error?.message || error?.response?.data?.message || "Failed to switch cart", "error");
    }

    setSwitchDialog(false);
    setPendingItem(null);
  };

  const onBook = async (item: any) => {
    const payload = {
      service_id: item.uuid,
      duration: item.duration,
      name: item.name,
      base_price: item.price,
    };

    if (!salonId) {
      callSnack("No salon selected", "error");
      return;
    }

    if (isAdded(item.uuid)) {
      callSnack("Service already in cart", "info");
      return;
    }

    if (!isAuthenticated) {
      if (cart.salonId && cart.salonId !== salonId) {
        dispatch(clearCart());
      }
      dispatch(
        addItemLocal({
          service_id: item.uuid,
          base_price: item.price,
          final_price: item.price,
          duration: item.duration,

          service: {
            uuid: item.uuid,
            name: item.name,
            logo: item.logo,
            gender: item.gender,
            duration: item.duration,
            price: item.price,
          },

          salon: {
            uuid: salon.uuid,
            name: salon.name,
            logo: salon.logo,
            address: salon.address,
            type: salon.type,
          },
        })
      );

      callSnack("Added to cart", "success");
      return;
    }

    if (cart.salonId && cart.salonId !== salonId && currentCartItemsCount > 0) {
      setPendingItem(item);
      setSwitchDialog(true);
      return;
    }

    try {
      if (cart.cartUuid) {
        await dispatch(addCartItemAction({cart_id: cart.cartUuid, ...payload})).unwrap();
        await dispatch(getCartAction(customer.uuid));
        callSnack("Added to cart", "success");
      } else {
        await dispatch(createCartAction({salon_id: salonId, user_id: customer.uuid, items: [payload]})).unwrap();
        callSnack("Cart created and item added", "success");
      }
    } catch (error: any) {
      callSnack(error?.message || error?.response?.data?.message || "Failed to add item", "error");
    }
  };

  const parentGender = getGenderChipConfig(service.gender);

  return (
    <Box className="border border-slate-200 rounded-xl bg-white">
      <Box className="flex items-center justify-between p-4 gap-4">
        <Box className="flex items-start gap-3 flex-1">
          {service.logo ? (
            <img src={service.logo} alt={service.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <Avatar sx={{ width: 48, height: 48 }}>{service.name?.[0]}</Avatar>
          )}

          <Box className="flex-1">
            <Box className="font-medium">{service.name}</Box>
            <Box className="text-sm text-slate-500">{service.description}</Box>

            <Box className="flex flex-wrap gap-2 mt-2">
              <Chip size="small" label={formatPrice(service)} />
              {service.duration && <Chip size="small" variant="outlined" label={`${service.duration} min`} />}
              {parentGender && <Chip size="small" label={parentGender.label} sx={parentGender.sx} />}
            </Box>
          </Box>
        </Box>

        {!hasSubServices && (
          <Button
            size="small"
            variant={isAdded(service.uuid) ? "contained" : "outlined"}
            disabled={isAdded(service.uuid)}
            onClick={() => onBook(service)}
          >
            {isAdded(service.uuid) ? "Added" : "Book"}
          </Button>
        )}

        {hasSubServices && (
          <IconButton onClick={() => setOpen((v) => !v)}>{open ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        )}
      </Box>

      {hasSubServices && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className="border-t border-slate-200 bg-slate-50 px-4 py-2">
            {subServices.map((sub) => {
              const subGender = getGenderChipConfig(sub.gender);
              return (
                <Box key={sub.uuid} className="flex items-center justify-between gap-4 py-3">
                  <Box className="flex items-start gap-3 flex-1 min-w-0">
                    {sub.logo ? (
                      <img src={sub.logo} alt={sub.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                    ) : (
                      <Avatar sx={{ width: 40, height: 40, bgcolor: "#e2e8f0", fontSize: 14 }}>{sub.name?.[0]}</Avatar>
                    )}

                    <Box className="min-w-0">
                      <Box className="font-medium text-sm truncate">{sub.name}</Box>
                      <Box className="text-xs text-slate-500 line-clamp-2">{sub.description}</Box>
                      <Box className="flex flex-wrap gap-2 mt-1">
                        {subGender && <Chip size="small" label={subGender.label} sx={subGender.sx} />}
                      </Box>
                    </Box>
                  </Box>

                  <Box className="text-right shrink-0">
                    <Box className="font-medium text-sm">{formatPrice(sub)}</Box>
                    {sub.duration && <Box className="text-xs text-slate-500">{sub.duration} min</Box>}
                    <Button
                      size="small"
                      variant={isAdded(sub.uuid) ? "contained" : "outlined"}
                      disabled={isAdded(sub.uuid)}
                      onClick={() => onBook(sub)}
                    >
                      {isAdded(sub.uuid) ? "Added" : "Book"}
                    </Button>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Collapse>
      )}

      <SwitchCartDialog
        open={switchDialog}
        currentCartItemsCount={currentCartItemsCount}
        newSalonName={service.salon_name || "this salon"}
        onConfirm={handleSwitchCart}
        onCancel={() => {
          setSwitchDialog(false);
          setPendingItem(null);
        }}
      />
    </Box>
  );
}

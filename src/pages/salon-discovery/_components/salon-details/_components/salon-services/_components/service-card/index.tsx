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

      await dispatch(createCartAction({ salon_id: salonId, user_id: customer!.uuid, items: [payload] })).unwrap();

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
        }),
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
        await dispatch(addCartItemAction({ cart_id: cart.cartUuid, ...payload })).unwrap();
        await dispatch(getCartAction(customer.uuid));
        callSnack("Added to cart", "success");
      } else {
        await dispatch(createCartAction({ salon_id: salonId, user_id: customer.uuid, items: [payload] })).unwrap();
        callSnack("Cart created and item added", "success");
      }
    } catch (error: any) {
      callSnack(error?.message || error?.response?.data?.message || "Failed to add item", "error");
    }
  };

  const parentGender = getGenderChipConfig(service.gender);
  const parentAdded = isAdded(service.uuid);

  return (
    <Box
      className={`border rounded-2xl overflow-hidden transition-all duration-250 ${
        parentAdded
          ? "border-(--app-primary) bg-linear-to-b from-(--app-primary-soft) to-(--app-surface) shadow-[0_14px_28px_rgba(15,23,42,0.14)]"
          : "border-(--app-border) bg-(--app-surface) shadow-[0_10px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)]"
      }`}
    >
      <Box className="flex flex-wrap sm:flex-nowrap items-start justify-between p-3.5 sm:p-5 gap-2.5 sm:gap-4">
        <Box className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0 w-full sm:w-auto">
          {service.logo ? (
            <Box component="img" src={service.logo} alt={service.name} className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover" />
          ) : (
            <Avatar className="w-11 h-11 sm:w-12 sm:h-12 bg-(--app-surface-alt) text-(--app-text)">{service.name?.[0]}</Avatar>
          )}

          <Box className="flex-1 min-w-0">
            <Box className="font-semibold text-(--app-text) text-[1.05rem] sm:text-base truncate">{service.name}</Box>
            <Box className="text-[0.8rem] sm:text-sm text-(--app-muted) line-clamp-2 mt-0.5">{service.description}</Box>

            <Box className="flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 sm:mt-3">
              <Chip
                size="small"
                label={formatPrice(service)}
                className="font-bold bg-(--app-primary-soft) text-(--app-text) border border-(--app-border) max-w-28 sm:max-w-none"
              />
              {service.duration && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${service.duration} min`}
                  className="bg-(--app-surface-alt) text-(--app-muted) border-(--app-border) max-w-22 sm:max-w-none"
                />
              )}
              {parentGender && <Chip size="small" label={parentGender.label} className={parentGender.className} />}
            </Box>
          </Box>
        </Box>

        <Box className="shrink-0 text-right ml-auto">
          <Box className="font-extrabold text-(--app-text) text-[1.7rem] sm:text-xl leading-none">
            {formatPrice(service).replace("From ", "")}
          </Box>
          {!hasSubServices && (
            <Button
              size="small"
              className="mt-2.5 sm:mt-3 min-w-[5.3rem] px-2.5"
              variant={parentAdded ? "contained" : "outlined"}
              disabled={parentAdded}
              onClick={() => onBook(service)}
            >
              {parentAdded ? "Added" : "Book"}
            </Button>
          )}
        </Box>

        {hasSubServices && (
          <IconButton
            onClick={() => setOpen((v) => !v)}
            className="border border-(--app-border) bg-(--app-surface-alt) hover:bg-(--app-bg) ml-1 mt-0.5 w-10 h-10"
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {hasSubServices && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className="border-t border-(--app-border) bg-(--app-surface-alt) px-3 sm:px-4 py-3 sm:py-4 space-y-2.5">
            {subServices.map((sub) => {
              const subGender = getGenderChipConfig(sub.gender);
              const subAdded = isAdded(sub.uuid);
              return (
                <Box
                  key={sub.uuid}
                  className={`flex items-center justify-between gap-3 sm:gap-4 py-3 px-2.5 sm:px-3 rounded-xl transition-all duration-200 ${
                    subAdded
                      ? "bg-(--app-primary-soft) border border-(--app-primary)"
                      : "bg-(--app-surface) border border-(--app-border) hover:border-(--app-muted)"
                  }`}
                >
                  <Box className="flex items-start gap-3 flex-1 min-w-0">
                    {sub.logo ? (
                      <Box
                        component="img"
                        src={sub.logo}
                        alt={sub.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <Avatar className="w-10 h-10 bg-(--app-surface) text-(--app-text) text-sm">
                        {sub.name?.[0]}
                      </Avatar>
                    )}

                    <Box className="min-w-0">
                      <Box className="font-medium text-sm truncate text-(--app-text)">{sub.name}</Box>
                      <Box className="text-xs text-(--app-muted) line-clamp-2">{sub.description}</Box>
                      <Box className="flex flex-wrap gap-2 mt-1">
                        {subGender && <Chip size="small" label={subGender.label} className={subGender.className} />}
                      </Box>
                    </Box>
                  </Box>

                  <Box className="text-right shrink-0 min-w-22 sm:min-w-26">
                    <Box className="font-semibold text-sm text-(--app-text)">{formatPrice(sub)}</Box>
                    {sub.duration && <Box className="text-xs text-(--app-muted)">{sub.duration} min</Box>}
                    <Button
                      className="mt-2"
                      size="small"
                      variant={subAdded ? "contained" : "outlined"}
                      disabled={subAdded}
                      onClick={() => onBook(sub)}
                    >
                      {subAdded ? "Added" : "Book"}
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

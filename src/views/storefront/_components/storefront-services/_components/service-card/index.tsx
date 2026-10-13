"use client";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Avatar, Box, Button, Chip, Collapse, IconButton, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../../../../store/hook";
import type { RootState } from "../../../../../../store/store";
import { addItemLocal, clearCart, removeItemLocal } from "../../../../../../features/salon/cart/cart.slice";
import { removeCartItemAction } from "../../../../../../features/salon/cart/remove-item/remove-item.action";
import { createCartAction } from "../../../../../../features/salon/cart/create-cart/create-cart.action";
import { addCartItemAction } from "../../../../../../features/salon/cart/add-item/add-item.action";
import { deleteCartAction } from "../../../../../../features/salon/cart/delete-cart/delete-cart.action";
import { callSnack } from "../../../../../../components/snackbar";
import SwitchCartDialog from "./_components/switch-cart-dialog";
import { getGenderChipConfig } from "./_components/utils/gender-chip-config";
import { getCartAction } from "../../../../../../features/salon/cart/get-cart/get-cart.action";
import styles from "./storefront-service-card.module.css";

export default function ServiceCard({ service, subServices, salon }: Readonly<{ service: any; subServices: any[]; salon: any }>) {
  const [open, setOpen] = useState(false);
  const [switchDialog, setSwitchDialog] = useState(false);
  const [switchingCart, setSwitchingCart] = useState(false);
  const [pendingItem, setPendingItem] = useState<any>(null);
  const [addingItemIds, setAddingItemIds] = useState<string[]>([]);

  const hasSubServices = subServices.length > 0;
  const params = useParams();
  const salonId = (params?.salonSlug as string) || (params?.salonId as string);
  const dispatch = useAppDispatch();
  const { isAuthenticated, customer } = useAppSelector((s: RootState) => s.auth);
  const cart = useAppSelector((s: RootState) => s.cart);

  const isAdded = (serviceId: string) =>
    cart.items.some((i: any) => i.service?.uuid === serviceId || i.service_id === serviceId);
  const currentCartItemsCount = (cart.items ?? []).length;

  const formatPrice = (s: any) => (s.price_type === "from" ? `From ₹${s.price}` : `₹${s.price}`);

  const effectiveSalonId = salonId || salon?.uuid;

  const handleSwitchCart = async () => {
    if (!pendingItem || !effectiveSalonId) return;

    setSwitchingCart(true);
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

      await dispatch(createCartAction({ salon_id: effectiveSalonId, user_id: customer!.uuid, items: [payload] })).unwrap();

      callSnack("New cart created for this salon", "success");
    } catch (error: any) {
      callSnack(error?.message || error?.response?.data?.message || "Failed to switch cart", "error");
    } finally {
      setSwitchingCart(false);
      setSwitchDialog(false);
      setPendingItem(null);
    }
  };

  const handleRemove = async (serviceId: string) => {
    if (!isAuthenticated) {
      dispatch(removeItemLocal(serviceId));
      callSnack("Removed from cart", "info");
      return;
    }

    const cartItem = cart.items.find(
      (i: any) => i.service?.uuid === serviceId || i.service_id === serviceId,
    );

    if (cart.cartUuid && cartItem?.uuid) {
      setAddingItemIds((prev) => [...prev, serviceId]);
      try {
        if (cart.items.length === 1) {
          await dispatch(deleteCartAction(cart.cartUuid)).unwrap();
        } else {
          await dispatch(removeCartItemAction(cartItem.uuid)).unwrap();
        }
        if (customer?.uuid) {
          await dispatch(getCartAction(customer.uuid));
        }
        callSnack("Removed from cart", "info");
      } catch (error: any) {
        callSnack(error?.message || "Failed to remove item", "error");
      } finally {
        setAddingItemIds((prev) => prev.filter((id) => id !== serviceId));
      }
    } else {
      dispatch(removeItemLocal(serviceId));
      callSnack("Removed from cart", "info");
    }
  };

  const onBook = async (item: any) => {
    const payload = {
      service_id: item.uuid,
      duration: item.duration,
      name: item.name,
      base_price: item.price,
    };

    if (!effectiveSalonId) {
      callSnack("No salon selected", "error");
      return;
    }

    if (isAdded(item.uuid)) {
      handleRemove(item.uuid);
      return;
    }

    if (!isAuthenticated) {
      if (cart.salonId && cart.salonId !== effectiveSalonId) {
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

    if (cart.salonId && cart.salonId !== effectiveSalonId && currentCartItemsCount > 0) {
      setPendingItem(item);
      setSwitchDialog(true);
      return;
    }

    setAddingItemIds((prev) => [...prev, item.uuid]);

    try {
      if (cart.cartUuid) {
        await dispatch(addCartItemAction({ cart_id: cart.cartUuid, ...payload })).unwrap();
        await dispatch(getCartAction(customer.uuid));
        callSnack("Added to cart", "success");
      } else {
        await dispatch(createCartAction({ salon_id: effectiveSalonId, user_id: customer.uuid, items: [payload] })).unwrap();
        await dispatch(getCartAction(customer.uuid));
        callSnack("Cart created and item added", "success");
      }
    } catch (error: any) {
      callSnack(error?.message || error?.response?.data?.message || "Failed to add item", "error");
    } finally {
      setAddingItemIds((prev) => prev.filter((id) => id !== item.uuid));
    }
  };

  const parentGender = getGenderChipConfig(service.gender);
  const parentAdded = isAdded(service.uuid);

  return (
    <Box
      className={`${styles.card} ${parentAdded ? styles.cardAdded : ""}`}
    >
      <Box className={styles.mainRow}>
        <Box className={styles.serviceInfoCol}>
          {service.logo ? (
            <Box
              component="img"
              src={service.logo}
              alt={service.name}
              className={styles.serviceLogo}
            />
          ) : (
            <Avatar className={styles.serviceAvatar}>
              {service.name?.[0]}
            </Avatar>
          )}

          <Box className={styles.textGroup}>
            <Box className={styles.serviceName}>{service.name}</Box>
            <Box className={styles.serviceDescription}>
              {service.description}
            </Box>

            <Box className={styles.chipsContainer}>
              <Chip
                size="small"
                label={formatPrice(service)}
                className={styles.priceChip}
              />
              {service.duration && (
                <Chip
                  size="small"
                  variant="outlined"
                  label={`${service.duration} min`}
                  className={styles.durationChip}
                />
              )}
              {parentGender && (
                <Chip
                  size="small"
                  label={parentGender.label}
                  className={`${parentGender.className} ${styles.genderChipSmall}`}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box className={styles.actionCol}>
          <Box className={styles.priceLabel}>
            {formatPrice(service).replace("From ", "")}
          </Box>
          {!hasSubServices && (
            <Button
              size="small"
              variant={parentAdded ? "outlined" : "contained"}
              color={parentAdded ? "success" : "primary"}
              disabled={addingItemIds.includes(service.uuid)}
              className={`${styles.bookButton} ${parentAdded ? styles.bookButtonAdded : ""}`}
              onClick={() => {
                if (parentAdded) {
                  handleRemove(service.uuid);
                } else {
                  onBook(service);
                }
              }}
            >
              {addingItemIds.includes(service.uuid) && (
                <CircularProgress size={12} color="inherit" sx={{ mr: { xs: 0.5, sm: 0.75 } }} />
              )}
              {addingItemIds.includes(service.uuid)
                ? (parentAdded ? "Removing..." : "Adding...")
                : (parentAdded ? "✓ Added" : "Book")}
            </Button>
          )}
        </Box>

        {hasSubServices && (
          <IconButton
            onClick={() => setOpen((v) => !v)}
            className={styles.expandBtn}
          >
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {hasSubServices && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box className={styles.subServicesContainer}>
            {subServices.map((sub) => {
              const subGender = getGenderChipConfig(sub.gender);
              const subAdded = isAdded(sub.uuid);
              return (
                <Box
                  key={sub.uuid}
                  className={`${styles.subServiceRow} ${subAdded ? styles.subServiceRowAdded : ""}`}
                >
                  <Box className={styles.subServiceInfo}>
                    {sub.logo ? (
                      <Box
                        component="img"
                        src={sub.logo}
                        alt={sub.name}
                        className={styles.subServiceLogo}
                      />
                    ) : (
                      <Avatar className={styles.subServiceAvatar}>
                        {sub.name?.[0]}
                      </Avatar>
                    )}

                    <Box sx={{ minWidth: 0 }}>
                      <Box className={styles.subServiceTitle}>{sub.name}</Box>
                      <Box className={styles.subServiceDesc}>
                        {sub.description}
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
                        {subGender && (
                          <Chip
                            size="small"
                            label={subGender.label}
                            className={`${subGender.className} ${styles.genderChipSmall}`}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Box className={styles.subServiceAction}>
                    <Box className={styles.subPrice}>{formatPrice(sub)}</Box>
                    {sub.duration && (
                      <Box className={styles.subDuration}>{sub.duration} min</Box>
                    )}
                    <Button
                      variant={subAdded ? "outlined" : "contained"}
                      color={subAdded ? "success" : "primary"}
                      disabled={addingItemIds.includes(sub.uuid)}
                      className={`${styles.subBookButton} ${subAdded ? styles.subBookButtonAdded : ""}`}
                      onClick={() => {
                        if (subAdded) {
                          handleRemove(sub.uuid);
                        } else {
                          onBook(sub);
                        }
                      }}
                    >
                      {addingItemIds.includes(sub.uuid) && (
                        <CircularProgress size={10} color="inherit" sx={{ mr: 0.5 }} />
                      )}
                      {addingItemIds.includes(sub.uuid)
                        ? (subAdded ? "Removing..." : "Adding...")
                        : (subAdded ? "✓ Added" : "Book")}
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
        loading={switchingCart}
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

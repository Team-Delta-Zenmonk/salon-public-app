"use client";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { syncGuestCartAction } from "../features/salon/cart/sync-cart/sync-cart.action";
import { getCartAction } from "../features/salon/cart/get-cart/get-cart.action";
import { initializeGuestCart } from "../features/salon/cart/cart.slice";
import { getPaymentCompleted } from "../features/salon/cart/cart.utils";

export default function AuthSync() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);
  const { loaded } = useAppSelector((s) => s.cart);
  const { paymentJustCompleted } = useAppSelector((s) => s.booking);

  const prevAuthRef = useRef<boolean>(false);

  useEffect(() => {
    dispatch(initializeGuestCart());
  }, [dispatch]);

  useEffect(() => {
    const justLoggedIn = !prevAuthRef.current && isAuthenticated;
    prevAuthRef.current = isAuthenticated;

    if (!isAuthenticated || !customer?.uuid) return;
    if (paymentJustCompleted || getPaymentCompleted()) return;

    if (justLoggedIn) {
      const guestCart = getPaymentCompleted() ? null : (typeof window !== "undefined" ? localStorage.getItem("guest_cart") : null);
      if (guestCart) {
        dispatch(syncGuestCartAction({ userId: customer.uuid })).then(() => {
          dispatch(getCartAction(customer.uuid));
        });
      } else {
        dispatch(getCartAction(customer.uuid));
      }
      return;
    }

    if (!loaded) {
      const guestCart = getPaymentCompleted() ? null : (typeof window !== "undefined" ? localStorage.getItem("guest_cart") : null);
      if (guestCart) {
        dispatch(syncGuestCartAction({ userId: customer.uuid })).then(() => {
          dispatch(getCartAction(customer.uuid));
        });
      } else {
        dispatch(getCartAction(customer.uuid));
      }
    }
  }, [isAuthenticated, customer?.uuid, loaded, paymentJustCompleted, dispatch]);

  return null;
}

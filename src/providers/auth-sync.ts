import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { syncGuestCartAction } from "../features/salon/cart/sync-cart/sync-cart.action";
import { getCartAction } from "../features/salon/cart/get-cart/get-cart.action";
import { getPaymentCompleted } from "../features/salon/cart/cart.utils";

export default function AuthSync() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, customer } = useAppSelector((s) => s.auth);
  const { loaded } = useAppSelector((s) => s.cart);
  const { paymentJustCompleted } = useAppSelector((s) => s.booking);

  const prevAuthRef = useRef<boolean>(false);

  useEffect(() => {
    const justLoggedIn = !prevAuthRef.current && isAuthenticated;
    prevAuthRef.current = isAuthenticated;

    if (!isAuthenticated || !customer?.uuid) return;
    if (paymentJustCompleted || getPaymentCompleted()) return;

    if (justLoggedIn) {
      dispatch(getCartAction(customer.uuid)).then((res: any) => {
        if (!res.payload) {
          dispatch(syncGuestCartAction({ userId: customer.uuid }));
        }
      });
      return;
    }

    if (!loaded) {
      dispatch(getCartAction(customer.uuid)).then((res: any) => {
        if (!res.payload) {
          dispatch(syncGuestCartAction({ userId: customer.uuid }));
        }
      });
    }
  }, [isAuthenticated, customer?.uuid, loaded, paymentJustCompleted]);

  return null;
}

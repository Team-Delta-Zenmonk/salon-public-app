const CART_KEY = "guest_cart";
const PAYMENT_DONE_KEY = "payment_just_completed";

export const getGuestCart = () => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setGuestCart = (cart: {
  salon: any;
  items: any[];
}) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
};

export const clearGuestCart = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CART_KEY);
  } catch {}
};

export const setPaymentCompleted = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PAYMENT_DONE_KEY, "1");
  } catch {}
};

export const getPaymentCompleted = () => {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(PAYMENT_DONE_KEY) === "1";
  } catch {
    return false;
  }
};

export const clearPaymentCompleted = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PAYMENT_DONE_KEY);
  } catch {}
};

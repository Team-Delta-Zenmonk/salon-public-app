const CART_KEY = "guest_cart";
const PAYMENT_DONE_KEY = "payment_just_completed";

export const getGuestCart = () => {
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : null;
};

export const setGuestCart = (cart: {
  salon: any;
  items: any[];
}) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem(CART_KEY);
};

export const setPaymentCompleted = () => {
  localStorage.setItem(PAYMENT_DONE_KEY, "1");
};

export const getPaymentCompleted = () => {
  return localStorage.getItem(PAYMENT_DONE_KEY) === "1";
};

export const clearPaymentCompleted = () => {
  localStorage.removeItem(PAYMENT_DONE_KEY);
};

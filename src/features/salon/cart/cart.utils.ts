const CART_KEY = "guest_cart";

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

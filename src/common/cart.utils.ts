import { getDiscountedPrice } from "./discount.utils";

export function calculateTotals(items: any[]): { totalPrice: number; totalDuration: number } {
  return items.reduce(
    (acc, item) => {
      const { finalPrice } = getDiscountedPrice(item);
      const effectivePrice =
        item.final_price !== undefined && item.final_price !== null
          ? Number(item.final_price)
          : finalPrice;

      return {
        totalPrice: acc.totalPrice + effectivePrice,
        totalDuration: acc.totalDuration + (item.duration ?? 0),
      };
    },
    { totalPrice: 0, totalDuration: 0 },
  );
}

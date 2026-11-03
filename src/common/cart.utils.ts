import { getDiscountedPrice } from "./discount.utils";

export function calculateTotals(items: any[]): { totalPrice: number; totalDuration: number } {
  return items.reduce(
    (acc, item) => {
      const discountInfo = getDiscountedPrice(item);
      const effectivePrice = discountInfo.finalPrice;

      return {
        totalPrice: acc.totalPrice + effectivePrice,
        totalDuration: acc.totalDuration + (item.duration ?? 0),
      };
    },
    { totalPrice: 0, totalDuration: 0 },
  );
}

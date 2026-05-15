export function calculateTotals(items: any[]): { totalPrice: number; totalDuration: number } {
  return items.reduce(
    (acc, item) => ({
      totalPrice: acc.totalPrice + (item.final_price ?? item.base_price ?? item.price ?? 0),
      totalDuration: acc.totalDuration + (item.duration ?? 0),
    }),
    { totalPrice: 0, totalDuration: 0 },
  );
}

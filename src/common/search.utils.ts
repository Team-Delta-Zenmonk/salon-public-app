export const sanitizeSearchInput = (value: string): string => {
  return value.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
};

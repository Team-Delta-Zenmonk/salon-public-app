import { PAGE_LAYOUTS } from "./layout.defaults";
import type { PartialThemePageLayouts, ThemePageLayouts } from "./layout.types";

export function sanitizeOrder<T extends string>(
  order: readonly T[] | undefined,
  allowedKeys: readonly T[]
): T[] {
  if (allowedKeys.length === 0) return [];
  const allowedSet = new Set(allowedKeys);
  const seen = new Set<T>();
  const sanitized: T[] = [];

  for (const key of order ?? []) {
    if (allowedSet.has(key) && !seen.has(key)) {
      seen.add(key);
      sanitized.push(key);
    }
  }

  for (const key of allowedKeys) {
    if (!seen.has(key)) {
      seen.add(key);
      sanitized.push(key);
    }
  }

  return sanitized;
}

export function resolveLayout(partial?: PartialThemePageLayouts): ThemePageLayouts {
  const pageKeys = Object.keys(PAGE_LAYOUTS) as (keyof typeof PAGE_LAYOUTS)[];
  const result: Record<string, any> = {};

  for (const page of pageKeys) {
    const config = PAGE_LAYOUTS[page];
    const base = config.defaults;
    const partialForPage = partial?.[page as keyof ThemePageLayouts] as Record<string, any> | undefined;

    const over = Object.fromEntries(
      Object.entries(partialForPage ?? {}).filter(([, v]) => v !== undefined)
    );

    const merged: Record<string, any> = { ...base, ...over };

    if (config.sectionKeys.length > 0 && "sectionOrder" in merged) {
      merged.sectionOrder = sanitizeOrder(
        merged.sectionOrder,
        config.sectionKeys as readonly string[]
      );
    }

    result[page] = merged;
  }

  return result as ThemePageLayouts;
}

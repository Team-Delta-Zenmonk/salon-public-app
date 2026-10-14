"use client";
import React from "react";
import { useAppThemeMode } from "@/theme/theme-provider";
import type { ThemePageLayouts } from "@/theme/layout.types";

export interface ThemedSectionsProps<
  TPage extends keyof ThemePageLayouts,
  TContextData
> {
  page: TPage;
  registry: Record<
    string,
    (layout: ThemePageLayouts[TPage], data: TContextData) => React.ReactNode
  >;
  data: TContextData;
}

export function ThemedSections<
  TPage extends keyof ThemePageLayouts,
  TContextData
>({
  page,
  registry,
  data,
}: ThemedSectionsProps<TPage, TContextData>) {
  const { layout } = useAppThemeMode();
  const pageLayout = layout[page] as any;
  const sectionOrder = pageLayout?.sectionOrder as string[] | undefined;

  if (!sectionOrder || !Array.isArray(sectionOrder)) {
    return null;
  }

  return (
    <>
      {sectionOrder.map((sectionKey) => {
        const renderer = registry[sectionKey];
        if (!renderer) return null;
        return (
          <React.Fragment key={sectionKey}>
            {renderer(pageLayout, data)}
          </React.Fragment>
        );
      })}
    </>
  );
}

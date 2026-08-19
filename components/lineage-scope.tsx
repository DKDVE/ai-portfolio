"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { normalizeLineageKey } from "@/lib/lineage";

type ActiveLineage = Readonly<{
  sourceId: string;
  keys: readonly string[];
}>;

type LineageContextValue = Readonly<{
  active: ActiveLineage | null;
  activate: (sourceId: string, keys: readonly string[]) => void;
  clear: (sourceId: string) => void;
}>;

const LineageContext = createContext<LineageContextValue | null>(null);

type LineageScopeProps = Readonly<{
  children: ReactNode;
}>;

export function LineageScope({ children }: LineageScopeProps) {
  const [active, setActive] = useState<ActiveLineage | null>(null);

  const activate = useCallback((sourceId: string, keys: readonly string[]) => {
    setActive({
      sourceId,
      keys: [...new Set(keys.map(normalizeLineageKey).filter(Boolean))],
    });
  }, []);

  const clear = useCallback((sourceId: string) => {
    setActive((current) => (current?.sourceId === sourceId ? null : current));
  }, []);

  const value = useMemo(
    () => ({ active, activate, clear }),
    [active, activate, clear],
  );

  return (
    <LineageContext.Provider value={value}>
      {children}
    </LineageContext.Provider>
  );
}

export function useLineageItem(sourceId: string, keys: readonly string[]) {
  const context = useContext(LineageContext);
  if (!context) {
    throw new Error("Lineage-aware components must be inside LineageScope.");
  }

  const normalizedKeys = keys.map(normalizeLineageKey).filter(Boolean);
  const isSource = context.active?.sourceId === sourceId;
  const isRelated =
    context.active !== null &&
    !isSource &&
    normalizedKeys.some((key) => context.active?.keys.includes(key));

  return {
    activate: () => context.activate(sourceId, normalizedKeys),
    clear: () => context.clear(sourceId),
    state: isSource ? "source" : isRelated ? "related" : "idle",
  } as const;
}

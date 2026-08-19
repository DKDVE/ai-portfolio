"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  findRelevantLineageMatches,
  normalizeLineageKey,
  type LineageRecord,
} from "@/lib/lineage";

type ActiveLineage = Readonly<{
  sourceId: string;
  keys: readonly string[];
  targetRecordIds: readonly string[];
}>;

type LineageContextValue = Readonly<{
  active: ActiveLineage | null;
  activate: (sourceId: string, keys: readonly string[]) => void;
  clear: (sourceId: string) => void;
}>;

const LineageContext = createContext<LineageContextValue | null>(null);

type LineageScopeProps = Readonly<{
  children: ReactNode;
  corpus: readonly LineageRecord[];
  lowSpecificityKeys: readonly string[];
  targets: readonly LineageRecord[];
}>;

export function LineageScope({
  children,
  corpus,
  lowSpecificityKeys,
  targets,
}: LineageScopeProps) {
  const [active, setActive] = useState<ActiveLineage | null>(null);

  const activate = useCallback(
    (sourceId: string, keys: readonly string[]) => {
      const sourceRecordId = sourceId.startsWith("record:")
        ? sourceId.slice("record:".length)
        : undefined;
      const matches = findRelevantLineageMatches(
        sourceRecordId,
        keys,
        corpus,
        targets,
        lowSpecificityKeys,
      );

      setActive({
        sourceId,
        keys: [...new Set(matches.flatMap((match) => match.keys))],
        targetRecordIds: matches.map((match) => match.id),
      });
    },
    [corpus, lowSpecificityKeys, targets],
  );

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
  const recordId = sourceId.startsWith("record:")
    ? sourceId.slice("record:".length)
    : undefined;
  const isRelated =
    context.active !== null &&
    !isSource &&
    (recordId
      ? context.active.targetRecordIds.includes(recordId)
      : normalizedKeys.some((key) => context.active?.keys.includes(key)));

  return {
    activate: () => context.activate(sourceId, normalizedKeys),
    clear: () => context.clear(sourceId),
    state: isSource ? "source" : isRelated ? "related" : "idle",
  } as const;
}

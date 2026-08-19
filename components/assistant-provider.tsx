"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Record } from "@/components/record";

type Source = Readonly<{ id: string; shortTitle: string; tags: readonly string[] }>;
type AssistantState = Readonly<{ answer: string; citations: readonly string[]; error: string | null; loading: boolean; open: boolean }>;
type AssistantContextValue = AssistantState & Readonly<{ ask: (message: string) => Promise<void>; setOpen: (open: boolean) => void }>;
const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({ children, records }: Readonly<{ children: ReactNode; records: readonly Source[] }>) {
  const [state, setState] = useState<AssistantState>({ answer: "", citations: [], error: null, loading: false, open: false });
  const ask = useCallback(async (message: string) => {
    setState({ answer: "", citations: [], error: null, loading: true, open: true });
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message }) });
      if (!response.ok || !response.body) { const body = await response.json().catch(() => null) as { error?: string } | null; throw new Error(body?.error ?? "The assistant is unavailable."); }
      const allowed = new Set((response.headers.get("x-retrieved-record-ids") ?? "").split(",").filter(Boolean));
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let answer = "";
      while (true) { const { done, value } = await reader.read(); if (done) break; answer += decoder.decode(value, { stream: true }); setState((current) => ({ ...current, answer })); }
      const citations = [...new Set([...answer.matchAll(/\[([a-z0-9-]+)\]/gi)].map((match) => match[1]).filter((id) => allowed.has(id)))];
      setState((current) => ({ ...current, citations, loading: false }));
    } catch (error) { setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : "The assistant is unavailable." })); }
  }, []);
  const value = useMemo(() => ({ ...state, ask, setOpen: (open: boolean) => setState((current) => ({ ...current, open })) }), [ask, state]);
  return <AssistantContext.Provider value={value}>{children}{state.answer || state.error || state.loading ? <AssistantAnswer records={records} /> : null}</AssistantContext.Provider>;
}

export function useAssistant() { const context = useContext(AssistantContext); if (!context) throw new Error("Assistant controls require AssistantProvider."); return context; }

function AssistantAnswer({ records }: Readonly<{ records: readonly Source[] }>) {
  const { answer, citations, error, loading } = useAssistant();
  const sources = citations.map((id) => records.find((record) => record.id === id)).filter((record): record is Source => Boolean(record));
  return <section aria-live="polite" className="editorial-shell border-t border-line py-10"><Record id="assistant-answer" headline="Governed answer" metadata={[loading ? "streaming" : "complete", "source · retrieved records"]} highlights={[(error ?? answer) || "Preparing a grounded response…"]} />{sources.length ? <div className="mt-4 flex flex-wrap gap-2" aria-label="Citations">{sources.map((source) => <a className="record-tag border border-accent px-2.5 py-1 font-mono text-meta text-accent" href={`#${source.id}`} key={source.id}>[{source.id} · {source.shortTitle}]</a>)}</div> : null}</section>;
}

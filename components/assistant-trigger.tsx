"use client";

import { useAssistant } from "@/components/assistant-provider";

export function AssistantTrigger() {
  const { open, openAssistant } = useAssistant();
  return (
    <button
      aria-label="Open assistant query console"
      aria-controls="assistant-query-console"
      aria-expanded={open}
      aria-haspopup="dialog"
      className="fixed right-4 bottom-4 left-4 z-20 flex min-h-12 items-center justify-between gap-3 border border-accent bg-surface px-4 font-mono text-meta tracking-[0.08em] text-ink uppercase sm:right-6 sm:left-auto sm:bottom-6 sm:justify-start"
      onClick={(event) => openAssistant(event.currentTarget)}
      type="button"
    >
      <span className="text-accent">Query layer</span>
      <span aria-hidden="true" className="text-ink-2">
        Ask about my fit ▸
      </span>
    </button>
  );
}

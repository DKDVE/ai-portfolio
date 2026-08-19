"use client";

import { useAssistant } from "@/components/assistant-provider";

export function AssistantTrigger() {
  const { setOpen } = useAssistant();
  return (
    <button
      aria-label="Open assistant query console"
      className="fixed right-4 bottom-4 z-20 flex min-h-12 items-center gap-3 border border-accent bg-surface px-4 font-mono text-meta tracking-[0.08em] text-ink uppercase sm:right-6 sm:bottom-6"
      onClick={() => setOpen(true)}
      type="button"
    >
      <span className="text-accent">Query layer</span>
      <span aria-hidden="true" className="text-ink-2">
        Ask about my fit ▸
      </span>
    </button>
  );
}

export function AssistantTrigger() {
  return (
    <button
      aria-label="Assistant query console coming in Phase 3"
      className="fixed right-4 bottom-4 z-20 flex min-h-12 items-center gap-3 border border-accent bg-surface px-4 font-mono text-meta tracking-[0.08em] text-ink uppercase disabled:cursor-not-allowed sm:right-6 sm:bottom-6"
      disabled
      type="button"
    >
      <span className="text-accent">Query layer</span>
      <span aria-hidden="true" className="text-ink-2">
        Ask about my fit ▸
      </span>
      {/* TODO(phase-3): wire this static control to the accessible assistant dialog and chat flow. */}
    </button>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Record } from "@/components/record";

type Source = Readonly<{
  id: string;
  shortTitle: string;
  tags: readonly string[];
}>;

type AssistantState = Readonly<{
  answer: string;
  citations: readonly string[];
  error: string | null;
  loading: boolean;
  open: boolean;
}>;

type AssistantContextValue = AssistantState &
  Readonly<{
    ask: (message: string, launcher?: HTMLElement | null) => Promise<void>;
    closeAssistant: () => void;
    openAssistant: (launcher?: HTMLElement | null) => void;
  }>;

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function AssistantProvider({
  children,
  records,
}: Readonly<{ children: ReactNode; records: readonly Source[] }>) {
  const [state, setState] = useState<AssistantState>({
    answer: "",
    citations: [],
    error: null,
    loading: false,
    open: false,
  });
  const launcherRef = useRef<HTMLElement | null>(null);

  const rememberLauncher = useCallback((launcher?: HTMLElement | null) => {
    if (launcher) {
      launcherRef.current = launcher;
    }
  }, []);

  const openAssistant = useCallback(
    (launcher?: HTMLElement | null) => {
      rememberLauncher(launcher);
      setState((current) => ({ ...current, open: true }));
    },
    [rememberLauncher],
  );

  const closeAssistant = useCallback(() => {
    setState((current) => ({ ...current, open: false }));
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const ask = useCallback(
    async (message: string, launcher?: HTMLElement | null) => {
      rememberLauncher(launcher);
      setState({
        answer: "",
        citations: [],
        error: null,
        loading: true,
        open: true,
      });

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message }),
        });

        if (!response.ok || !response.body) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error ?? "The assistant is unavailable.");
        }

        const allowed = new Set(
          (response.headers.get("x-retrieved-record-ids") ?? "")
            .split(",")
            .filter(Boolean),
        );
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          answer += decoder.decode(value, { stream: true });
          setState((current) => ({ ...current, answer }));
        }

        const citations = [
          ...new Set(
            [...answer.matchAll(/\[([a-z0-9-]+)\]/gi)]
              .map((match) => match[1])
              .filter((id) => allowed.has(id)),
          ),
        ];
        setState((current) => ({ ...current, citations, loading: false }));
      } catch (error) {
        setState((current) => ({
          ...current,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "The assistant is unavailable.",
        }));
      }
    },
    [rememberLauncher],
  );

  const value = useMemo(
    () => ({ ...state, ask, closeAssistant, openAssistant }),
    [ask, closeAssistant, openAssistant, state],
  );

  return (
    <AssistantContext.Provider value={value}>
      {children}
      <AssistantConsoleDialog records={records} />
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("Assistant controls require AssistantProvider.");
  }

  return context;
}

function AssistantConsoleDialog({ records }: Readonly<{ records: readonly Source[] }>) {
  const {
    answer,
    ask,
    citations,
    closeAssistant,
    error,
    loading,
    open,
  } = useAssistant();
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  if (!open) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(query, inputRef.current);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeAssistant();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])",
    );
    if (!focusable || focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  const sources = citations
    .map((id) => records.find((record) => record.id === id))
    .filter((record): record is Source => Boolean(record));
  const result = error ?? answer;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/70 p-4 sm:items-center sm:p-6">
      <section
        aria-describedby="assistant-query-description"
        aria-labelledby="assistant-query-heading"
        aria-modal="true"
        className="max-h-[min(44rem,calc(100vh-2rem))] w-full max-w-3xl overflow-y-auto border border-line bg-surface p-4 sm:p-6"
        id="assistant-query-console"
        onKeyDown={handleKeyDown}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-6 border-b border-line pb-4">
          <div>
            <p className="font-mono text-meta tracking-[0.1em] text-accent uppercase">
              Query layer
            </p>
            <h2
              className="mt-2 font-display text-section font-medium tracking-[-0.035em] text-ink"
              id="assistant-query-heading"
            >
              Governed assistant
            </h2>
            <p className="mt-2 max-w-[56ch] text-sm text-ink-2" id="assistant-query-description">
              Answers are grounded in Dhruv&apos;s published records and cite their sources.
            </p>
          </div>
          <button
            aria-label="Close assistant query console"
            className="shrink-0 border border-line px-3 py-2 font-mono text-meta text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent"
            onClick={closeAssistant}
            type="button"
          >
            Close
          </button>
        </div>

        <form className="mt-5" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="assistant-dialog-query">
            Ask about Dhruv Dave&apos;s fit, work, or contact details
          </label>
          <div className="flex min-h-14 items-center gap-3 border border-line px-4 focus-within:border-accent">
            <span aria-hidden="true" className="font-mono text-meta text-ink-3">
              Query ›
            </span>
            <input
              aria-busy={loading}
              className="min-w-0 flex-1 bg-transparent font-mono text-meta text-ink outline-none placeholder:text-ink-3"
              id="assistant-dialog-query"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ask a governed question…"
              ref={inputRef}
              value={query}
            />
            <button
              className="font-mono text-meta text-accent"
              disabled={loading}
              type="submit"
            >
              Send
            </button>
          </div>
        </form>

        <section aria-live="polite" className="mt-6">
          <Record
            headline="Governed answer"
            highlights={[result || "Ask a question to retrieve a grounded answer."]}
            id="assistant-answer"
            metadata={[loading ? "streaming" : "ready", "source · retrieved records"]}
          />
          {sources.length ? (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Citations">
              {sources.map((source) => (
                <a
                  className="record-tag border border-accent px-2.5 py-1 font-mono text-meta text-accent"
                  href={`#${source.id}`}
                  key={source.id}
                >
                  [{source.id} · {source.shortTitle}]
                </a>
              ))}
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
}

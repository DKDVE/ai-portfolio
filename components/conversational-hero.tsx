import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import type { IdentityRecord } from "@/lib/knowledge-base";

const personaPrompts = [
  "Recruiter: is he a fit for a GenAI / RAG role?",
  "Hiring manager: walk me through the KPMG Context Layer",
  "Tech lead: multi-agent / LangGraph experience?",
  "Peer: Databricks + governance depth?",
  "How do I reach him?",
] as const;

const hasProfilePhoto = existsSync(
  join(process.cwd(), "public", "dhruv-dave.jpg"),
);

type ConversationalHeroProps = Readonly<{
  identity: IdentityRecord;
}>;

export function ConversationalHero({ identity }: ConversationalHeroProps) {
  return (
    <header className="editorial-shell border-b border-line pt-8 pb-16 sm:pt-10 sm:pb-24">
      <div className="flex items-start justify-between gap-6 font-mono text-meta tracking-[0.12em] text-ink-2 uppercase">
        <span>Record · {identity.id}</span>
        {identity.availability ? (
          <span className="max-w-[24ch] text-right">{identity.availability}</span>
        ) : null}
      </div>

      <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.7fr)] lg:gap-16">
        {hasProfilePhoto ? (
          <figure className="max-w-xs lg:row-span-2 lg:max-w-none">
            <div className="overflow-hidden border border-line bg-surface">
              <Image
                alt="Portrait of Dhruv Dave"
                className="aspect-[4/5] h-auto w-full object-cover"
                height={880}
                priority
                sizes="(max-width: 1023px) min(20rem, 100vw), 26vw"
                src="/dhruv-dave.jpg"
                width={704}
              />
            </div>
            <figcaption className="mt-3 font-mono text-meta tracking-[0.1em] text-ink-2 uppercase">
              Record · identity · portrait
            </figcaption>
          </figure>
        ) : null}

        <div className={hasProfilePhoto ? undefined : "max-w-[66ch]"}>
          <h1 className="max-w-[12ch] font-display text-display font-medium tracking-[-0.055em] text-ink">
            {identity.shortTitle}
          </h1>
          <p className="mt-8 max-w-[66ch] text-copy text-ink-2">
            {identity.content}
          </p>
        </div>

        <div className={hasProfilePhoto ? undefined : "max-w-[66ch]"}>
          <label className="sr-only" htmlFor="hero-query">
            Ask about Dhruv Dave&apos;s fit, work, or contact details
          </label>
          <div className="flex min-h-14 items-center gap-3 border border-line bg-surface px-4 transition-colors duration-200 ease-out focus-within:border-accent">
            <span
              aria-hidden="true"
              className="shrink-0 font-mono text-meta tracking-[0.1em] text-ink-3 uppercase"
            >
              Query ›
            </span>
            <input
              aria-describedby="hero-query-status"
              className="min-w-0 flex-1 bg-transparent font-mono text-meta tracking-[0.04em] text-ink outline-none placeholder:text-ink-3"
              id="hero-query"
              placeholder="Ask about my fit, my work, or how to reach me…"
              type="text"
            />
          </div>

          <div
            aria-label="Suggested assistant questions"
            className="mt-4 flex flex-wrap gap-2"
            role="group"
          >
            {personaPrompts.map((prompt) => (
              <button
                className="record-tag inline-flex min-h-8 items-center border border-line bg-transparent px-2.5 text-left font-mono text-meta tracking-[0.06em] text-ink-2 transition-colors duration-200 ease-out hover:border-ink-2"
                key={prompt}
                type="button"
              >
                {prompt}
              </button>
            ))}
          </div>
          <p
            className="mt-4 font-mono text-meta tracking-[0.1em] text-ink-3 uppercase"
            id="hero-query-status"
          >
            Query status · static interface
          </p>
          {/* TODO(phase-3): wire this static query field and persona prompts to the governed assistant. */}
        </div>

        {identity.location ? (
          <p className="max-w-[34ch] border-l border-line pl-5 font-mono text-meta tracking-[0.08em] text-ink-2 uppercase lg:col-start-2">
            Location · {identity.location}
            <br />
            Source · knowledge-base
          </p>
        ) : null}
      </div>
    </header>
  );
}

import { AssistantTrigger } from "@/components/assistant-trigger";
import { Record } from "@/components/record";
import { SectionHeading } from "@/components/section-heading";
import knowledgeBase from "@/data/knowledge-base.json";

export default function Home() {
  const identity = knowledgeBase.records.find(
    (record) => record.id === "identity",
  );
  const summary = knowledgeBase.records.find(
    (record) => record.id === "summary",
  );

  if (!identity?.content || !summary?.content) {
    throw new Error(
      "Identity and summary records are required for the Phase 1 shell.",
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas text-ink">
      <header className="editorial-shell border-b border-line pt-8 pb-16 sm:pt-10 sm:pb-24">
        <div className="flex items-center justify-between gap-6 font-mono text-meta tracking-[0.12em] text-ink-2 uppercase">
          <span>Record · {identity.id}</span>
          <span aria-label="System status: source verified" className="text-right">
            Source · verified
          </span>
        </div>

        <div className="mt-16 grid gap-8 lg:mt-24 lg:grid-cols-[minmax(0,2fr)_minmax(15rem,1fr)] lg:items-end">
          <div>
            <h1 className="max-w-[12ch] font-display text-display font-medium tracking-[-0.055em] text-ink">
              {identity.shortTitle}
            </h1>
            <p className="mt-8 max-w-[66ch] text-copy text-ink-2">
              {summary.content}
            </p>
          </div>

          <p className="max-w-[34ch] border-l border-line pl-5 font-mono text-meta tracking-[0.08em] text-ink-2 uppercase lg:justify-self-end">
            Governed source layer
            <br />
            Identity + positioning
          </p>
        </div>
      </header>

      <main className="editorial-shell py-[var(--section-space)]">
        <section aria-labelledby="record-system-heading">
          <SectionHeading
            eyebrow="Record system"
            title="Identity, expressed as governed records."
            id="record-system-heading"
          />

          <div className="mt-14 lg:mt-20">
            <Record
              id={identity.id}
              headline={identity.shortTitle}
              metadata={[identity.type, "source · knowledge-base"]}
              highlights={[identity.content]}
              tags={identity.tags}
            />
            <Record
              id={summary.id}
              headline={summary.shortTitle}
              metadata={[summary.type, "source · knowledge-base"]}
              highlights={[summary.content]}
              tags={summary.tags}
            />
          </div>
        </section>
      </main>

      <footer className="editorial-shell border-t border-line py-8 pr-24 sm:py-10 sm:pr-36">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <p className="font-display text-record font-medium text-ink">
            {identity.shortTitle}
          </p>
          <p className="font-mono text-meta tracking-[0.1em] text-ink-2 uppercase">
            Source · data/knowledge-base.json
          </p>
        </div>
      </footer>

      <AssistantTrigger />
    </div>
  );
}

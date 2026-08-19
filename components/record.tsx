import { Tag } from "@/components/tag";

type RecordProps = Readonly<{
  id: string;
  headline: string;
  metadata: readonly string[];
  highlights: readonly string[];
  tags?: readonly string[];
}>;

export function Record({
  id,
  headline,
  metadata,
  highlights,
  tags = [],
}: RecordProps) {
  const headingId = `record-${id}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className="record-card group/record relative grid scroll-mt-8 gap-7 border-t border-line py-9 outline-none md:grid-cols-[minmax(12rem,0.8fr)_minmax(0,1.7fr)] md:gap-12 md:py-12"
      data-record-id={id}
      tabIndex={0}
    >
      <div>
        <p className="font-mono text-meta tracking-[0.1em] text-ink-2 uppercase">
          Record · {id}
        </p>
        <h3
          className="mt-4 max-w-[24ch] font-display text-record font-medium tracking-[-0.02em] text-ink"
          id={headingId}
        >
          {headline}
        </h3>
      </div>

      <div>
        <p className="font-mono text-meta tracking-[0.08em] text-ink-2 uppercase">
          {metadata.join(" · ")}
        </p>

        <ul className="mt-5 grid max-w-[66ch] gap-3 text-copy text-ink-2">
          {highlights.map((highlight) => (
            <li className="grid grid-cols-[1rem_1fr] gap-2" key={highlight}>
              <span aria-hidden="true" className="text-ink-2">
                —
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {tags.length > 0 ? (
          <div className="mt-7 flex flex-wrap gap-2" aria-label="Record tags">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}
      </div>

      {/* TODO(phase-2): connect related records and tags with cross-record lineage lines once real record relationships are rendered. */}
    </article>
  );
}

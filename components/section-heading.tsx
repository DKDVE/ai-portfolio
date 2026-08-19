type SectionHeadingProps = Readonly<{
  eyebrow: string;
  title: string;
  id: string;
}>;

export function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div className="grid gap-5 md:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.7fr)] md:gap-12">
      <p className="font-mono text-meta tracking-[0.1em] text-ink-2 uppercase">
        Section · {eyebrow}
      </p>
      <h2
        className="max-w-[30ch] font-display text-section font-medium tracking-[-0.035em] text-ink"
        id={id}
      >
        {title}
      </h2>
    </div>
  );
}

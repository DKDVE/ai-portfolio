import type { ReactNode } from "react";

type TagProps = Readonly<{
  children: ReactNode;
}>;

export function Tag({ children }: TagProps) {
  return (
    <span className="record-tag inline-flex min-h-7 items-center border border-line px-2.5 font-mono text-meta tracking-[0.08em] text-ink-2 uppercase transition-[border-color,color] duration-200 ease-out">
      {children}
    </span>
  );
}

"use client";

import { useLineageItem } from "@/components/lineage-scope";

type TagProps = Readonly<{
  children: string;
  interactive?: boolean;
  lineageId?: string;
  lineageKeys?: readonly string[];
}>;

export function Tag({
  children,
  interactive = false,
  lineageId = "tag",
  lineageKeys = [],
}: TagProps) {
  const lineage = useLineageItem(`tag:${lineageId}`, lineageKeys);
  const className =
    "record-tag inline-flex min-h-7 items-center border border-line bg-transparent px-2.5 font-mono text-meta tracking-[0.08em] text-ink-2 uppercase transition-[border-color,color] duration-200 ease-out";

  function handleMouseLeave(event: React.MouseEvent<HTMLElement>) {
    if (document.activeElement !== event.currentTarget) {
      lineage.clear();
    }
  }

  if (interactive) {
    return (
      <button
        aria-label={`${children}: show related records`}
        className={`${className} cursor-pointer`}
        data-lineage-state={lineage.state}
        onBlur={lineage.clear}
        onFocus={lineage.activate}
        onMouseEnter={lineage.activate}
        onMouseLeave={handleMouseLeave}
        type="button"
      >
        {children}
      </button>
    );
  }

  return (
    <span className={className} data-lineage-state={lineage.state}>
      {children}
    </span>
  );
}

export function normalizeLineageKey(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function matchLineageKeys(
  label: string,
  availableKeys: readonly string[],
): readonly string[] {
  const normalizedLabel = normalizeLineageKey(label);

  return availableKeys.filter((key) => {
    const normalizedKey = normalizeLineageKey(key);
    return (
      normalizedLabel === normalizedKey ||
      normalizedLabel.includes(normalizedKey) ||
      normalizedKey.includes(normalizedLabel)
    );
  });
}

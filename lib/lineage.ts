export function normalizeLineageKey(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("en")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export type LineageRecord = Readonly<{
  id: string;
  tags: readonly string[];
}>;

export type LineageMatch = Readonly<{
  id: string;
  keys: readonly string[];
  score: number;
}>;

type RankedLineageMatch = {
  id: string;
  keys: string[];
  score: number;
  index: number;
};

const minimumRelevanceScore = 0.5;
const maximumRelatedRecords = 2;
const platformTagWeight = 0.35;

function normalizeUniqueKeys(keys: readonly string[]): readonly string[] {
  return [...new Set(keys.map(normalizeLineageKey).filter(Boolean))];
}

function getTagWeights(
  corpus: readonly LineageRecord[],
  lowSpecificityKeys: readonly string[],
): ReadonlyMap<string, number> {
  const frequency = new Map<string, number>();

  corpus.forEach((record) => {
    normalizeUniqueKeys(record.tags).forEach((tag) => {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
    });
  });

  const lowSpecificityKeySet = new Set(normalizeUniqueKeys(lowSpecificityKeys));

  return new Map(
    [...frequency].map(([tag, count]) => [
      tag,
      Math.log((corpus.length + 1) / (count + 1)) *
        (lowSpecificityKeySet.has(tag) ? platformTagWeight : 1),
    ]),
  );
}

export function findRelevantLineageMatches(
  sourceRecordId: string | undefined,
  sourceTags: readonly string[],
  corpus: readonly LineageRecord[],
  targets: readonly LineageRecord[],
  lowSpecificityKeys: readonly string[],
): readonly LineageMatch[] {
  const sourceKeys = normalizeUniqueKeys(sourceTags);
  const tagWeights = getTagWeights(corpus, lowSpecificityKeys);

  return targets
    .map((target, index) => {
      if (target.id === sourceRecordId) {
        return null;
      }

      const sharedKeys = normalizeUniqueKeys(target.tags).filter((tag) =>
        sourceKeys.includes(tag),
      );
      const score = sharedKeys.reduce(
        (total, tag) => total + (tagWeights.get(tag) ?? 0),
        0,
      );

      return { id: target.id, keys: sharedKeys, score, index };
    })
    .filter(
      (match): match is RankedLineageMatch =>
        match !== null && match.score >= minimumRelevanceScore,
    )
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, maximumRelatedRecords)
    .map(({ id, keys, score }) => ({ id, keys, score }));
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

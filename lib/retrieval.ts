import "server-only";

import { knowledgeBase, type KnowledgeRecord } from "@/lib/knowledge-base";

export type RetrievedRecord = Readonly<{ record: KnowledgeRecord; score: number }>;

function tokenize(value: string): readonly string[] {
  return value.toLocaleLowerCase("en").match(/[a-z0-9]+/g) ?? [];
}

function keywordScore(queryTokens: readonly string[], record: KnowledgeRecord, tagWeights: ReadonlyMap<string, number>): number {
  const documentTokens = new Set(tokenize(JSON.stringify(record)));
  const tagTokens = new Set(record.tags.flatMap(tokenize));
  return queryTokens.reduce((score, token) => score + (documentTokens.has(token) ? 1 : 0) + (tagTokens.has(token) ? tagWeights.get(token) ?? 2 : 0), 0);
}

export async function retrieveRecords(query: string): Promise<readonly KnowledgeRecord[]> {
  const queryTokens = tokenize(query);
  const tagFrequency = new Map<string, number>();
  knowledgeBase.records.forEach((record) => record.tags.forEach((tag) => tagFrequency.set(tag, (tagFrequency.get(tag) ?? 0) + 1)));
  const tagWeights = new Map([...tagFrequency].map(([tag, count]) => [tag, Math.log((knowledgeBase.records.length + 1) / (count + 1)) + 1]));

  // This corpus has eleven small records, so in-memory keyword, tag, and field ranking is deliberate; embeddings can be added if the corpus grows enough to justify their network and operational cost.
  const ranked: RetrievedRecord[] = knowledgeBase.records.map((record) => {
    return { record, score: keywordScore(queryTokens, record, tagWeights) };
  });

  const alwaysIncluded = knowledgeBase.records.filter(
    (record) => record.id === "identity" || record.id === "summary",
  );
  const remaining = ranked
    .sort((left, right) => right.score - left.score)
    .map(({ record }) => record)
    .filter((record) => !alwaysIncluded.some((item) => item.id === record.id));

  return [...alwaysIncluded, ...remaining.slice(0, 6 - alwaysIncluded.length)];
}

export function buildContext(records: readonly KnowledgeRecord[]): string {
  return records.map((record) => `RECORD [${record.id}]\n${JSON.stringify(record)}\nEND RECORD`).join("\n\n");
}

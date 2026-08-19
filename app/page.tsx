import knowledgeBase from "@/data/knowledge-base.json";

export default function Home() {
  const identity = knowledgeBase.records.find(
    (record) => record.id === "identity",
  );

  if (!identity?.content) {
    throw new Error("The identity record is missing from the knowledge base.");
  }

  return <main>{identity.content}</main>;
}

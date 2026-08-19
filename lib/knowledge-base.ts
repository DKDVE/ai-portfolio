import rawKnowledgeBase from "@/data/knowledge-base.json";

type BaseRecord = Readonly<Record<string, unknown>> &
  Readonly<{
    id: string;
    type: string;
    shortTitle: string;
    tags: readonly string[];
  }>;

export type IdentityRecord = BaseRecord &
  Readonly<{
    id: "identity";
    type: "identity";
    always_include: true;
    content: string;
    location: string;
    availability: string;
    contact: Readonly<{
      email: string;
      linkedin: string;
    }>;
  }>;

export type SummaryRecord = BaseRecord &
  Readonly<{
    id: "summary";
    type: "summary";
    always_include: true;
    content: string;
    fitSignals: readonly string[];
  }>;

export type ExperienceRecord = BaseRecord &
  Readonly<{
    id: "exp-kpmg" | "exp-freelance" | "exp-rishabh";
    type: "experience";
    org: string;
    role: string;
    location: string;
    start: string;
    end: string;
    content: string;
    highlights: readonly string[];
    fitSignals: readonly string[];
  }>;

export type ProjectRecord = BaseRecord &
  Readonly<{
    id: "proj-oce";
    type: "project";
    name: string;
    context: string;
    status: string;
    content: string;
    fitSignals: readonly string[];
  }>;

export type SkillsRecord = BaseRecord &
  Readonly<{
    id: "skills";
    type: "skills";
    groups: Readonly<Record<string, readonly string[]>>;
  }>;

export type EducationRecord = BaseRecord &
  Readonly<{
    id: "edu-mba" | "edu-btech";
    type: "education";
    content: string;
  }>;

export type CertificationsRecord = BaseRecord &
  Readonly<{
    id: "certs";
    type: "certifications";
    items: readonly string[];
  }>;

export type ExtracurricularRecord = BaseRecord &
  Readonly<{
    id: "extracurricular";
    type: "extracurricular";
    items: readonly string[];
  }>;

export type KnowledgeRecord =
  | IdentityRecord
  | SummaryRecord
  | ExperienceRecord
  | ProjectRecord
  | SkillsRecord
  | EducationRecord
  | CertificationsRecord
  | ExtracurricularRecord;

type KnowledgeBase = Readonly<{
  meta: Readonly<{
    note: string;
    owner: string;
    targetRoles: readonly string[];
    citationLabelFormat: string;
  }>;
  records: readonly KnowledgeRecord[];
}>;

const experienceIds = ["exp-kpmg", "exp-freelance", "exp-rishabh"] as const;
const educationIds = ["edu-mba", "edu-btech"] as const;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasString(value: Record<string, unknown>, key: string): boolean {
  return typeof value[key] === "string";
}

function hasStringArray(value: Record<string, unknown>, key: string): boolean {
  return (
    Array.isArray(value[key]) &&
    (value[key] as unknown[]).every((item) => typeof item === "string")
  );
}

function assertBaseRecord(value: unknown): asserts value is BaseRecord {
  if (
    !isObject(value) ||
    !hasString(value, "id") ||
    !hasString(value, "type") ||
    !hasString(value, "shortTitle") ||
    !hasStringArray(value, "tags")
  ) {
    throw new Error("A knowledge-base record has an invalid base shape.");
  }
}

function assertRecord(value: unknown): asserts value is KnowledgeRecord {
  assertBaseRecord(value);

  switch (value.type) {
    case "identity": {
      if (
        value.id !== "identity" ||
        value.always_include !== true ||
        !hasString(value, "content") ||
        !hasString(value, "location") ||
        !hasString(value, "availability") ||
        !isObject(value.contact) ||
        !hasString(value.contact, "email") ||
        !hasString(value.contact, "linkedin")
      ) {
        throw new Error("The identity record has an invalid shape.");
      }
      return;
    }
    case "summary": {
      if (
        value.id !== "summary" ||
        value.always_include !== true ||
        !hasString(value, "content") ||
        !hasStringArray(value, "fitSignals")
      ) {
        throw new Error("The summary record has an invalid shape.");
      }
      return;
    }
    case "experience": {
      if (
        !experienceIds.some((id) => id === value.id) ||
        !hasString(value, "org") ||
        !hasString(value, "role") ||
        !hasString(value, "location") ||
        !hasString(value, "start") ||
        !hasString(value, "end") ||
        !hasString(value, "content") ||
        !hasStringArray(value, "highlights") ||
        !hasStringArray(value, "fitSignals")
      ) {
        throw new Error(`Experience record ${value.id} has an invalid shape.`);
      }
      return;
    }
    case "project": {
      if (
        value.id !== "proj-oce" ||
        !hasString(value, "name") ||
        !hasString(value, "context") ||
        !hasString(value, "status") ||
        !hasString(value, "content") ||
        !hasStringArray(value, "fitSignals")
      ) {
        throw new Error("The OCE project record has an invalid shape.");
      }
      return;
    }
    case "skills": {
      if (value.id !== "skills" || !isObject(value.groups)) {
        throw new Error("The skills record has an invalid shape.");
      }

      for (const skills of Object.values(value.groups)) {
        if (
          !Array.isArray(skills) ||
          !skills.every((skill) => typeof skill === "string")
        ) {
          throw new Error("A skills group contains an invalid value.");
        }
      }
      return;
    }
    case "education": {
      if (
        !educationIds.some((id) => id === value.id) ||
        !hasString(value, "content")
      ) {
        throw new Error(`Education record ${value.id} has an invalid shape.`);
      }
      return;
    }
    case "certifications":
    case "extracurricular": {
      const hasMatchingId =
        (value.type === "certifications" && value.id === "certs") ||
        (value.type === "extracurricular" && value.id === "extracurricular");

      if (!hasMatchingId || !hasStringArray(value, "items")) {
        throw new Error(`List record ${value.id} has an invalid shape.`);
      }
      return;
    }
    default:
      throw new Error(`Unsupported knowledge-base record type: ${value.type}`);
  }
}

function assertKnowledgeBase(value: unknown): asserts value is KnowledgeBase {
  if (!isObject(value) || !isObject(value.meta) || !Array.isArray(value.records)) {
    throw new Error("The knowledge base has an invalid root shape.");
  }

  if (
    !hasString(value.meta, "note") ||
    !hasString(value.meta, "owner") ||
    !hasStringArray(value.meta, "targetRoles") ||
    !hasString(value.meta, "citationLabelFormat")
  ) {
    throw new Error("The knowledge-base metadata has an invalid shape.");
  }

  value.records.forEach(assertRecord);

  const ids = value.records.map((record) => record.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Knowledge-base record IDs must be unique.");
  }
}

const loadedKnowledgeBase: unknown = rawKnowledgeBase;
assertKnowledgeBase(loadedKnowledgeBase);

export const knowledgeBase = loadedKnowledgeBase;

function requireRecord(id: string): KnowledgeRecord {
  const record = knowledgeBase.records.find((item) => item.id === id);
  if (!record) {
    throw new Error(`Required knowledge-base record is missing: ${id}`);
  }
  return record;
}

export function getIdentityRecord(): IdentityRecord {
  const record = requireRecord("identity");
  if (record.type !== "identity") {
    throw new Error("The identity record has the wrong type.");
  }
  return record;
}

export function getSummaryRecord(): SummaryRecord {
  const record = requireRecord("summary");
  if (record.type !== "summary") {
    throw new Error("The summary record has the wrong type.");
  }
  return record;
}

export function getExperienceRecords(): readonly ExperienceRecord[] {
  return experienceIds.map((id) => {
    const record = requireRecord(id);
    if (record.type !== "experience") {
      throw new Error(`Experience record ${id} has the wrong type.`);
    }
    return record;
  });
}

export function getProjectRecord(): ProjectRecord {
  const record = requireRecord("proj-oce");
  if (record.type !== "project") {
    throw new Error("The OCE record has the wrong type.");
  }
  return record;
}

export function getSkillsRecord(): SkillsRecord {
  const record = requireRecord("skills");
  if (record.type !== "skills") {
    throw new Error("The skills record has the wrong type.");
  }
  return record;
}

export function getEducationRecords(): readonly EducationRecord[] {
  return educationIds.map((id) => {
    const record = requireRecord(id);
    if (record.type !== "education") {
      throw new Error(`Education record ${id} has the wrong type.`);
    }
    return record;
  });
}

export function getCertificationsRecord(): CertificationsRecord {
  const record = requireRecord("certs");
  if (record.type !== "certifications") {
    throw new Error("The certifications record has the wrong type.");
  }
  return record;
}

export function getExtracurricularRecord(): ExtracurricularRecord {
  const record = requireRecord("extracurricular");
  if (record.type !== "extracurricular") {
    throw new Error("The extracurricular record has the wrong type.");
  }
  return record;
}

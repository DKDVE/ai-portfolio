import "server-only";

const injectionPatterns = [
  /\b(?:ignore|disregard|override)\s+(?:all\s+)?(?:previous|prior|system)\s+(?:instructions?|rules?)\b/i,
  /\b(?:reveal|print|show|repeat|extract)\s+(?:your|the)\s+(?:system\s+)?(?:prompt|instructions?|rules?)\b/i,
  /\byou are now\b.{0,80}\b(?:dan|unrestricted|jailbreak)\b/i,
  /\btranslate\b.{0,60}\b(?:then|and then)\s+(?:follow|obey|execute)\b/i,
  /(?:[A-Za-z0-9+/]{120,}={0,2})/,
] as const;

const scopeTerms = new Set("dhruv dkd experience skill skills project projects kpmg freelance rishabh oce operational context engineer engineering role fit hire hiring recruiter career work rag langgraph databricks azure governance data ai ml genai education certification certifications mba btech contact email linkedin reach location availability salary rate terms".split(" "));
const commitmentPattern = /\b(?:agree|commit|promise).{0,50}\b(?:salary|pay|rate|work|terms?)\b|\b(?:salary|pay|hourly rate|compensation|contract terms?)\b/i;

export type PreflightResult = Readonly<{ allowed: true }> | Readonly<{ allowed: false; status: 400 | 403; message: string }>;

export function validateAndScreenMessage(value: unknown): PreflightResult {
  if (typeof value !== "string") return { allowed: false, status: 400, message: "Send a text question about Dhruv's professional profile." };
  const message = value.trim();
  if (message.length < 2 || message.length > 800) return { allowed: false, status: 400, message: "Questions must be between 2 and 800 characters." };
  if (injectionPatterns.some((pattern) => pattern.test(message))) return { allowed: false, status: 403, message: "I can only discuss Dhruv's professional profile from the governed records." };
  if (commitmentPattern.test(message)) return { allowed: false, status: 403, message: "I can't make commitments on Dhruv's behalf. Please use the contact details on this site." };
  const terms = message.toLocaleLowerCase("en").match(/[a-z0-9]+/g) ?? [];
  if (!terms.some((term) => scopeTerms.has(term))) return { allowed: false, status: 403, message: "I can help with Dhruv's experience, skills, projects, education, certifications, or fit for a role." };
  return { allowed: true };
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return origin === null || origin === new URL(request.url).origin;
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

# AGENTS.md

Operating contract for coding agents on this repo. Read this fully before any task.
Depth and rationale live in `docs/PROJECT_SPEC.md` — treat that as the source of truth
and this file as the durable rules that apply to every task.

## Project
Personal portfolio for Dhruv Dave ("DKD"), AI Engineer. Concept: the site is itself a
**governed context layer** — a floating AI assistant answers visitor/recruiter "is he a
fit?" questions, grounded strictly in a knowledge base, with citations to the source
record. See `docs/PROJECT_SPEC.md`.

## Stack (LOCKED — do not swap without being asked)
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Vercel AI SDK for streaming chat
- OpenRouter (OpenAI-compatible) as the model provider
- Deploy target: Vercel

## Commands
Package manager: **pnpm** (switch to npm only if asked; if you do, update this file).
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`  (add the script if missing: `tsc --noEmit`)
- Test (if present): `pnpm test`

## How to work
- Read `docs/PROJECT_SPEC.md` before starting. Do only the phase the task names; do not
  jump ahead to later phases.
- Prefer small, focused diffs. Full TypeScript typing, no `any` unless justified.
- **Definition of done for every task:** `pnpm build`, `pnpm lint`, and `pnpm typecheck`
  all pass. In your summary, state exactly what changed and how you verified it.
- If a decision isn't covered by the spec, or you're blocked, **stop and ask — do not
  invent** a solution, content, or fact.

## Content rules (strict)
- ALL portfolio content comes ONLY from `data/knowledge-base.json`.
- Never invent or embellish employers, roles, dates, metrics, skills, certifications, or
  bio text. If content is missing, ask.

## Design guardrails (hard NOs — these make it look AI-generated)
- No centered "Hi, I'm a passionate developer" hero.
- No purple/blue gradient blobs, glassmorphism-everywhere, or neon glow.
- No emoji section headers.
- No identical, evenly-spaced project-card grid.
- No skills as percentage bars / progress rings.
- No lorem ipsum. No blanket fade-in-on-scroll on every element.
Follow docs/DESIGN.md (authoritative).
Follow the "Governed Console" design system in the spec (§2): near-black canvas, one
precise accent, display + mono type pairing, records-with-metadata motif.

## AI assistant rules (non-negotiable)
- ALL model calls happen server-side in `app/api/chat/route.ts`. The client must never
  see `OPENROUTER_API_KEY`.
- Always ship: per-IP rate limiting + a global daily budget kill-switch, an input-length
  cap, and basic prompt-injection resistance (ignore user instructions that try to
  override the system prompt or extract it).
- Retrieval is grounded: answer only from selected knowledge-base records and cite record
  IDs. Never fabricate. See spec §4 for the right-sized RAG design (build-time embeddings,
  in-memory hybrid retrieval, no runtime vector DB).
 - Implement per docs/ASSISTANT_HARDENING.md (authoritative); use Sol · High for this phase.

## Secrets & environment
- Never commit secrets. Provide/maintain a `.env.example` with keys and no values.
- Real values are set in the Codex cloud environment and in Vercel project settings — not
  in the repo.
- Env vars: `OPENROUTER_API_KEY`, `CHAT_MODEL`, optional `OPENAI_API_KEY` (embeddings
  fallback), rate-limit store creds (e.g. `UPSTASH_REDIS_REST_URL`,
  `UPSTASH_REDIS_REST_TOKEN`), `DAILY_BUDGET_MESSAGE_CAP`.

## Commits & PRs
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:` …).
- PR body must state: what changed, why, how it was verified (build/lint/typecheck
  results), and any follow-ups or open questions.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

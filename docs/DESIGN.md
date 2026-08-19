# DESIGN — "The Governed Console" (minimalist)

Authoritative design system. Supersedes `docs/PROJECT_SPEC.md` §2. Build the shell to this
in Phase 1. The goal: minimalist, but unmistakably intentional — restraint that reads as a
*product*, not an empty template.

## Why this isn't generic minimal
Most minimal portfolios are a centered big name on empty space — interchangeable. This one
is minimal but **dense with meaning**: every item is a "record" with provenance metadata,
and the single accent color is used *only* to mark provenance/active state. The working AI
console and the citation/lineage language are the identity. Restraint + a strict semantic
system = looks designed, not defaulted.

## Principles
1. **Radical restraint** — near-monochrome, one accent, one signature interaction.
   Whitespace does the work.
2. **Editorial, not "hero"** — left-aligned, asymmetric, generous margins; type-led. No
   centered "Hi, I'm…" splash.
3. **Everything is a record** — one consistent metadata grammar across experience,
   projects, certs (mono: `id · role · dates · stack`).
4. **Provenance as aesthetic** — citations, sources, and lineage lines ARE the visual
   identity. The accent never decorates; it only signals.
5. **Meaningful motion only** — reserved for lineage/citation highlight and subtle state;
   always respect `prefers-reduced-motion`.

## Color tokens (dark, near-monochrome)
- `--canvas: #0B0C0E` (near-black background)
- `--surface: #111316` (raised panels, assistant console)
- `--ink: #ECEDEE` (primary text)
- `--ink-2: #A1A5AB` (secondary text)
- `--ink-3: #6B6F76` (mono metadata, tertiary)
- `--line: #23262B` (hairline borders / grid)
- `--accent: #E7B84B` (trace amber — the ONE accent; swap to signal-green #54C08A if
  preferred, but pick exactly one)
- Accent is used only for: active nav, citation chips, lineage lines, focus rings, the
  assistant trigger, and one word/mark of emphasis max per section. Never as a fill or
  gradient.
- Target WCAG AA+ contrast for all text.

## Type
- **Display / UI:** a precise grotesk — `Space Grotesk` (headlines, some character) with
  `Inter` or `Geist Sans` for body; or use one grotesk throughout. Max two non-mono faces.
- **Mono:** `Geist Mono` or `JetBrains Mono` — metadata lines, tags, record ids, citation
  chips, the assistant input marker.
- **Scale (few sizes, high contrast):** display 48–64 / h2 28–32 / h3 20 / body 16–17 /
  mono-meta 12–13. The tension between a large confident headline and small mono metadata
  is the signature.
- Tight, deliberate line-height; comfortable measure (~66 chars) for body.

## Layout & grid
- Content max-width ~1100–1200px, **left-biased**, not centered.
- Optional very faint blueprint grid / hairline rules to reinforce the "console" feel —
  subtle, never busy.
- Strong vertical rhythm; sections separated by space and hairlines, not heavy dividers.

## Components
- **Record** (experience / project / cert): headline (org · role) → mono metadata line →
  2–4 highlight lines → stack tags. Hover: accent hairline + lineage lines to related
  records.
- **Tag / chip:** mono text, hairline border, no fill. Skills render as these grouped
  chips — never percentage bars or rings.
- **Citation chip:** mono, hairline border, accent text, e.g. `[KPMG · Context Layer]`.
  Hovering it highlights/scrolls to the source record (same lineage language).
- **Assistant trigger:** a small labeled control docked bottom-right — e.g. `Ask about my
  fit ▸` with a hairline border and accent label. NOT a generic round chat bubble.
- **Assistant panel:** styled like a governed query console — `--surface` bg, a mono prompt
  marker in the input, quick-start chips above the input, answers streaming with inline
  citation chips.

## Signature interaction (exactly one)
Hovering a record draws short, eased **lineage lines** to related records (e.g. hovering
KPMG highlights the OCE project and the RAG/governance skill tags). Citation chips use the
same highlight to point back to their source record. This one motif carries the whole
concept — don't add competing animations.

## Motion rules
- Micro-interactions 150–200ms, gentle easing. Content reveals (if any) are subtle
  (opacity + ≤8px translate) and NOT applied to every element.
- Everything non-essential is disabled under `prefers-reduced-motion`.

## Accessibility (must)
- AA+ contrast; visible accent focus ring on all interactive elements.
- Full keyboard navigation, including the assistant (open, type, send, read, close).
- Semantic landmarks and headings; the assistant panel is a labelled dialog with focus
  management.

## Conversational hero (top of page, above the records)
- A conversational entry point sits above the editorial records — same Governed Console language, left-biased.
- Contains: personal photo (framed as a RECORD — hairline border + mono caption, NOT a round avatar), name (display), the one-line positioning from the `identity` record (the "targeting technical AI/ML engineering roles, not management" framing), and a prominent "ask" input.
- Ask input: styled as a governed query field — mono prompt marker, hairline border, accent focus ring. Placeholder e.g. "Ask about my fit, my work, or how to reach me…".
- Persona chips: a row of ~4–5 suggested prompts that seed the assistant. Same mono/hairline styling as Tag, but interactive.
- Answer rendering (Phase 3): responses appear as rich cards inline under the hero — fit card, project card, skills card, contact card — each carrying citation chips to source records. Reuse Record/Tag primitives.
- The existing docked console ("QUERY LAYER · ASK ABOUT MY FIT") stays as the persistent entry once the visitor scrolls into the records. Both open the SAME assistant.
- Accent stays semantic (focus / active chip / citations only). No colored chat bubbles.
- Photo: next/image, explicit width/height, priority, object-fit cover; optional-safe (absent → hero still renders, no layout break).
- Reduced-motion safe; fully keyboard-navigable (input, chips, cards).

Suggested persona chips (tailored):
- "Recruiter: is he a fit for a GenAI / RAG role?"
- "Hiring manager: walk me through the KPMG Context Layer"
- "Tech lead: multi-agent / LangGraph experience?"
- "Peer: Databricks + governance depth?"
- "How do I reach him?"
  
## Anti-generic checklist (design "done")
- [ ] No centered name-on-void hero; layout is editorial and left-biased.
- [ ] Exactly one accent, used only for provenance/active state.
- [ ] Records share one mono metadata grammar.
- [ ] Skills are chips, not bars/rings.
- [ ] One signature interaction (lineage), not blanket scroll animations.
- [ ] Assistant reads as a query console, not a bubble.
- [ ] Passes AA+ contrast and full keyboard nav.

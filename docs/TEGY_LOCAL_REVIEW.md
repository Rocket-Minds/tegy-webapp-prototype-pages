# Tegy Local Plugin-Pack Review

Date: 2026-06-04

## Status

This is a local StrategyOS/Tegy plugin-pack review, not a hosted Tegy execution.

Hosted Tegy REST was attempted separately and returned `Invalid TEGY_API_KEY`, so this review does not claim hosted agent execution. The review below applies the local Tegy / StrategyOS pack that is installed in Codex:

- `/Users/borg/.codex/skills/tegy/SKILL.md`
- `/Users/borg/.codex/plugins/cache/personal/strategyos/1.0.1-beta/`

Local plugin-pack sources applied:

- `README.md`: Tegy positioning as a strategy brain plus guardrail layer.
- `chat-projects/README.md`: four domains, six project installs, lane dependency cascade.
- `rules/business-strategy/gary-game.md`: MECE, lane routing, upstream gates, decision-point engagement, artifact-scope discipline.
- `rules/product-management/product-game.md`: product waterfall, segment-first discipline, pricing and PRD boundaries.
- `rules/go-to-market/gtm-game.md`: GTM Phase 0 hard gate, motion choice, 7-step GTM waterfall.
- `skills/biz-mece-structure/SKILL.md`: clean decomposition and sort discipline.
- `skills/prod-rigor-review/SKILL.md`: product rigor and artifact review criteria.
- `agents/02-product-management/b-prod-c-technical-manager.md`: TPM scope and the warning against moving product decisions into architecture.
- `schemas/context-md-frontmatter.schema.json`: project context initialization and lock shape.
- `schemas/dp-index.schema.json`: canonical decision-point lifecycle view.
- `output/strategyos/prod/roadmap/v1/04-prd-bundle.md`: existing StrategyOS PRD output pattern.

## Review Verdict

The web app direction is right if it is treated as a workbench over StrategyOS/Tegy behavior. It becomes wrong if the frontend page layout is allowed to imply backend ontology, service boundaries, or deterministic orchestration.

The app should keep the clean user-facing pages:

- `Copilot`
- `Projects`
- `Vault`
- `Artifacts`
- `Decision Log`
- `API`

But those pages are UX projections. They are not automatically backend tables, services, or canonical resources.

## Product Scope Review

### What Holds

`Project` is the right root UX object. It maps to StrategyOS project context, project-scoped outputs, decision points, and isolated chat/project installs.

`Copilot` is the right primary surface. Tegy should be used through natural language first, with explicit project, output, and source context selection.

`Vault` and `Artifacts` are correctly separated by input/output:

- Vault = source inputs and context.
- Artifacts = generated outputs.

`Decision Log` belongs in the product because StrategyOS depends on decision points, defaults, locks, traces, and downstream consumption.

`API` belongs in the product as an access/distribution surface because the existing pack already supports Claude Code, Codex, and chat-project installs.

### What Needed Correction

`Decision Log` should not imply a standalone `decisions` table yet. In StrategyOS, a decision can appear as a `dp-index` entry, a tagged message, artifact frontmatter, a locked project-context value, or a derived view. The canonical model is an architecture decision.

`Message`, `Decision`, `Run`, and `Artifact` overlap. A single user message can trigger routing, request a decision, lock a default, create an output, and become part of a trace. The app should not force these into separate backend objects just because they appear on separate screens.

`AgentRun` should not be assumed as deterministic backend state. The product needs visible run traces: selected lane, gate checks, context used, steps completed, output created. Whether that trace is persisted as an object, streamed from hosted Tegy, derived from local StrategyOS logs, or reconstructed from artifacts is open.

`Workflows` should not be a top-level page in this version. StrategyOS lanes and waterfalls should power Copilot routing and output generation. They do not need to be a separate user navigation object.

## MECE Product Decomposition

This is the user-facing product decomposition. It is intentionally not a backend schema.

| Product layer | Owns | Does not own |
|---|---|---|
| Project context | Strategic matter, scoped operating context, selected project state | Global workspace context |
| Source context | Uploaded inputs, global sources, prior materials, extraction targets | Generated deliverables |
| Interaction | Threads, messages, prompts, context selection, routing requests | Final canonical artifacts |
| Governance | Decision points, assumptions, defaults, locks, evidence traces | Raw source storage |
| Output | Generated memos, PRDs, GTM plans, decks, checklists, briefs | Uploaded source files |
| Execution trace | Visible lane, gates, agents/pack logic, progress, citations | Business truth by itself |
| Distribution | Claude Code, Codex, API keys, install commands | Core StrategyOS reasoning |

MECE note: this decomposition is MECE by user job, not by storage. Backend storage can and likely will cross-cut these layers.

## PRD / Repo Mapping

The current web-app spec should map to these existing StrategyOS concepts before engineering writes schemas:

| Web app concept | Existing StrategyOS evidence |
|---|---|
| Project | `context.md` frontmatter schema, output folder structure, chat-project install split |
| Project context lock | `schemas/context-md-frontmatter.schema.json` |
| Decision lifecycle | `schemas/dp-index.schema.json` |
| Lane routing | `chat-projects/README.md`, `rules/**`, `agents/**`, `skills/**` |
| Upstream gates | `gary-game.md`, `product-game.md`, `gtm-game.md`, `ma-game.md` |
| Generated artifacts | `output/**` examples with frontmatter, upstream references, dependency maps |
| PRDs / product outputs | `output/strategyos/prod/roadmap/v1/04-prd-bundle.md` |
| Artifact MECE boundaries | `gary-game.md` artifact-generation discipline |
| API / local-agent usage | `.codex-plugin`, `.claude-plugin`, install scripts, chat-project instructions |

## Architecture Decisions Still Open

Do not lock these from the frontend prototype:

| Decision | Local Tegy review position |
|---|---|
| Project source of truth | Open: app DB, StrategyOS folders, hosted Tegy entity, or hybrid. |
| Message / event model | Open: messages may be the event envelope for prompts, decisions, traces, and artifact triggers. |
| Decision model | Open: could be `dp-index`, tagged messages, artifact metadata, explicit records, or derived views. |
| Run trace model | Open: user-visible trace required; deterministic `AgentRun` object not proven. |
| Router ownership | Open: must derive from full StrategyOS pack and hosted Tegy strategy, not from UI labels. |
| Artifact storage | Open: Markdown files, app records, rendered docs, object storage, or hybrid. |
| Vault indexing | Open: map uploads to StrategyOS project context and future vector/search architecture. |
| API contract | Open: begin from existing plugin/install paths before inventing web-native endpoints. |
| Workspace/auth model | Open: required for production, but not defined by the prototype. |

## Recommended Next Architecture Pass

Run a first-principles PRD alignment before backend implementation:

1. Define the canonical state machine for a project from first prompt to generated output.
2. Map each state to existing StrategyOS files, schemas, agent rules, or hosted Tegy surfaces.
3. Decide whether `message` is the base event envelope.
4. Decide whether `decision` is a first-class object or an annotation/view over messages, `dp-index`, and artifacts.
5. Decide whether `run trace` is canonical state or product telemetry.
6. Decide what the web app owns versus what hosted Tegy or the installed StrategyOS pack owns.
7. Only then define database schema, service boundaries, and API endpoints.

## Product Requirement That Survives Architecture Choices

The user should experience Tegy as:

- Pick or confirm a project.
- Choose an output only when needed.
- Select source context explicitly.
- Ask a strategy question.
- See Tegy route through the right StrategyOS lane and gates.
- Watch live reasoning/progress at a high level.
- Receive an output.
- Lock decisions when they become load-bearing.
- Reuse the same context from web, Claude Code, or Codex.

That is the durable product shape. The backend shape remains an architecture decision.

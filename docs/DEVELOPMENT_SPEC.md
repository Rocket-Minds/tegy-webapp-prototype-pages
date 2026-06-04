# Tegy Webapp Development Spec

## Review Status

This document still has not completed a formal PRD-to-architecture signoff. It has been grounded against the StrategyOS engineering repo, sanitized install repo, local StrategyOS/Tegy plugin pack, `dp-index` schema, `context.md` frontmatter schema, chat-project routing split, and existing StrategyOS PRD output examples. Before production backend implementation, engineering should run a dedicated PRD / architecture alignment pass.

## Architecture Posture

Frontend must not dictate backend architecture. The prototype defines a user-facing workbench shape; it does not define canonical data models, persistence boundaries, orchestration ownership, or service boundaries.

The core architecture work should start from these sources of truth:

- Existing StrategyOS PRD and output artifacts.
- StrategyOS agent, skill, rule, and schema contracts.
- The local StrategyOS/Tegy plugin pack review in `docs/TEGY_LOCAL_REVIEW.md`.
- Hosted Tegy orchestration requirements, if hosted Tegy owns routing.
- Product requirements for the web app as a separate surface.

Treat every backend object below as an open decision until the PRD and engineering architecture explicitly lock it.

Local Tegy review verdict: the product scope is directionally right as a workbench over StrategyOS/Tegy, but the prototype must not force object boundaries. `Project`, `Vault`, `Copilot`, `Artifacts`, `Decision Log`, and `API` are page-level projections. They are not settled backend tables, service boundaries, or orchestration primitives.

## Product Intent

Tegy is a Harvey-like AI workbench for strategy work. The main user experience is not a generic chat app. It is a project-centered system where a user selects a strategic matter, asks Tegy for help, and Tegy routes the request through the right lane, agent logic, context sources, and output type.

Primary jobs, sorted by workflow sequence:

1. Ground the work in explicit context: project, project sources, global context, prior project material, and decision log inputs.
2. Execute the strategy request: classify the prompt, route it through the right StrategyOS lane, show live progress, and return a draft output.
3. Preserve reusable work product: save generated outputs, expose provenance, and lock important decisions or assumptions.
4. Extend access outside the web app: let technical users invoke Tegy from Claude Code or Codex with the same project context.

## Information Architecture

Top-level app pages:

- `Copilot`: central chat surface and main entry point.
- `Projects`: project list and selected project detail.
- `Vault`: source documents and extracted context.
- `Artifacts`: generated deliverables created by Tegy/StrategyOS runs.
- `Decision Log`: locked decisions, assumptions, open risks, and pending decisions.
- `API`: setup commands for Claude Code and Codex.

## Repo Alignment Baseline

This prototype is a UX reference, not the source of truth for backend schema or orchestration architecture.

Use the repos this way:

- `GFilipp/strategyOS`: private engineering repo. This contains source agents, skills, rules, knowledge-base material, private output examples, build/publish scripts, ingestion scripts, schema helpers, and the private analysis history.
- `Rocket-Minds/strategyos`: sanitized install repo. This is the distributable StrategyOS pack for Claude Code, Codex, and chat-project installs. It exposes agents, skills, rules, knowledge-base files, schemas, installer manifests, and `chat-projects`.
- `Rocket-Minds/tegy-product-page`: brand and marketing surface. Use this for typography, voice, visual rhythm, and label style before finalizing UI details.
- Local StrategyOS/Tegy Codex plugin pack: installed at `/Users/borg/.codex/plugins/cache/personal/strategyos/1.0.1-beta/`. Use this as the available local StrategyOS pack inside this Codex environment when hosted Tegy is unavailable.

The web app should consume or wrap StrategyOS/Tegy behavior. It should not define a parallel system that drifts from the installed pack or pre-empt the backend architecture.

## UX Projections, Not MECE Backend Objects

The concepts below are user-facing projections only. They are intentionally not a MECE backend ontology. Several concepts can overlap in implementation.

Example: a user message can also be a decision request, a lock event, an artifact-generation trigger, and part of a run trace. A decision could be a tagged message, a `dp-index` entry, artifact frontmatter, a separate app record, or a derived view. The web UI should expose these concepts cleanly without forcing them to become separate tables.

### Project

Projects are the user's strategic matters. This aligns with the repo's project-first structure: project context lives under project folders, output examples are organized by project/lane/analysis/version, and chat-project installs are isolated by domain/project.

Open implementation question: the app may store project state in an app database, in StrategyOS-style `context.md` / output folders, in hosted Tegy, or in a hybrid model.

### Vault / Source Context

Vault contains source inputs: decks, memos, spreadsheets, interviews, research, prior project material, and global company context.

This maps to StrategyOS project context and uploaded source material, not to generated outputs. The app can expose project vault and global vault tabs, but indexing, extraction, and source-of-truth storage remain architecture decisions.

### Copilot Thread / Message

Copilot is the interaction surface. A message may ask a question, attach context, trigger routing, spawn agent work, produce a draft, and create or lock a decision.

Do not assume messages, decisions, traces, and artifacts must be separate backend objects. Solve the object model from first principles against the PRD and existing StrategyOS schemas, not from the page layout.

### Decision Point

The UI should make decisions first-class because StrategyOS depends on locked decisions and assumptions. However, the repo already exposes a decision-point lifecycle through `schemas/dp-index.schema.json`, with statuses such as `Pending lock`, `Default-OK`, and `Locked`, plus trace fields showing how a lock was achieved and consumed.

The web app's `Decision Log` should be treated as a view over the canonical decision lifecycle, not automatically as a standalone decision table.

### Artifact / Generated Output

Artifacts are generated deliverables: memos, PRDs, GTM plans, board narratives, target-fit memos, landing-page briefs, tables, checklists, and decks.

Manual uploads are not Artifacts. Uploaded material belongs in Vault first. An uploaded prior deliverable can become source context; Tegy can then generate a new Artifact from it. This matches the engineering repo's `/output` framing: artifacts are evidence of work produced by StrategyOS and can become downstream-agent input.

### Run / Trace

The UI needs to show live routing and agent progress. That does not mean the backend must persist an `AgentRun` object.

Possible implementations include a hosted Tegy orchestration event stream, a local StrategyOS plugin trace, a server-side queue, a derived transcript from generated outputs, or a hybrid. Do not assume deterministic `AgentRun` semantics until the orchestration layer is chosen.

The product requirement is the user-visible trace: selected lane, agent/logic used, context consumed, steps completed, and generated output.

## Routing and Orchestration

Tegy should route prompts through the StrategyOS discipline logic. The router lanes, agent behavior, hard gates, and waterfall sequencing must be derived from the full Rocket Minds StrategyOS repos, not from ad hoc prototype labels.

Canonical routing inputs from the repos:

- `chat-projects/README.md`: user-facing domain split and when each install project is used.
- `agents/**/*.md`: agent identities, operating procedures, and quality bars.
- `skills/**/SKILL.md`: reusable strategy skills available to agents.
- `rules/**`: ambient guardrails, hard gates, upstream dependency checks, and rigor rules.
- `schemas/context-md-frontmatter.schema.json`: project-init lock and mode directive shape.
- `schemas/dp-index.schema.json`: decision-point lifecycle and trace model.
- `output/**`: private examples of StrategyOS-produced analyses and PRD artifacts.
- `scripts/build_beta_packs.py`, `scripts/build_shareable.py`, and publish scripts: distribution and sanitization mechanics that may matter for web/API packaging.

The UI can show friendly labels such as `Copilot`, `Projects`, `Vault`, `Artifacts`, `Decision Log`, and `API`. Any persisted or callable routing layer must stay compatible with the StrategyOS pack naming and agent boundaries.

Do not implement routing from web-app labels alone. The local Tegy pack defines four discipline domains and six chat-project installs: business strategy, product management, GTM strategy, GTM execution, M&A strategy, and M&A target fit. Those are install/routing surfaces, while the underlying StrategyOS lane logic has upstream gates and dependency cascades. The web app should expose a clean user flow without flattening those rules.

User-visible routing behavior:

- User selects a project only if they want project context applied.
- User selects an output only if they want Tegy to generate or continue a specific deliverable.
- Context chips are explicit; by default the UI should not claim sources are selected unless the user selected them.
- After submit, Copilot should show the selected lane/logic, spawned agent or pack, context used, live progress, and final generated output.

## Architecture Decisions To Resolve

Do not implement these as settled backend facts until the PRD and engineering architecture align:

| Decision | Why it matters |
|---|---|
| Project source of truth | Choose whether projects are app-native records, StrategyOS project folders, hosted Tegy entities, or a hybrid. |
| Decision/message boundary | Decide whether decisions are separate records, tagged messages, `dp-index` entries, artifact frontmatter, or a derived view. |
| Message/event envelope | Decide whether messages are the base event envelope for prompts, context selection, decision requests, locks, traces, and artifact triggers. |
| Artifact lifecycle | Decide whether generated outputs are Markdown files, app records, rendered documents, or all three. |
| Run/trace model | Decide whether live runs are transient UI events, persisted run history, local plugin logs, or orchestration-layer records. |
| Router ownership | Decide whether routing runs inside hosted Tegy, the installed StrategyOS pack, a web backend, or a bridge layer. |
| Vault indexing | Decide how uploaded sources become indexed context and how that maps to StrategyOS project context files. |
| API contract | Decide whether Claude Code/Codex commands call hosted Tegy, local StrategyOS, MCP, REST, or a generated skill wrapper. |
| Build/publish reuse | Decide which engineering repo scripts should be reused for sanitized web/API packaging instead of rewriting pack discovery. |
| Brand system | Confirm production font scale, label casing, and voice against `tegy-product-page` before UI polish is considered done. |

First-principles architecture questions:

- What is the canonical state machine for a StrategyOS project from request to output?
- Which parts of that state already exist in StrategyOS files, schemas, logs, or hosted Tegy?
- Which app views are projections over canonical StrategyOS state rather than their own source of truth?
- Can decisions be modeled as enriched messages or `dp-index` entries instead of standalone records?
- Is a run trace canonical state, an event stream, a UI convenience, or an audit artifact?
- What must be deterministic, and what should remain orchestration-layer-dependent?
- Which API surfaces are product requirements versus implementation conveniences?
- What existing StrategyOS artifact or schema owns each product concept before the web app creates a new one?

## Page Requirements

### Copilot

The Copilot page is the primary experience.

Required behavior:

- Composer starts centered on empty thread.
- After first message, conversation becomes normal chat and the composer moves lower like Codex or Claude.
- User messages appear as user bubbles.
- Tegy responses appear as structured assistant cards.
- Each response shows the selected lane or logic, spawned agent or pack, selected output when one exists, context count, live progress, final draft output preview, and actions.
- Context chips must be togglable.
- Empty-state prompt examples should be use-case specific and should not imply that project, output, or context is selected before the user selects it.

### Projects

Projects are the root object of the app.

Required behavior:

- Sidebar Projects section can expand/collapse.
- Show a small number of projects in the sidebar plus `View all projects`.
- Projects page lists all projects.
- Selecting a project updates the selected project detail and all project-scoped pages.
- Project detail should include quick links to Vault, Copilot, Active Output, Artifacts, and Decision Log.

### Vault

Vault stores inputs, not outputs.

Required behavior:

- Two top tabs: selected project vault and global vault.
- Project tab should allow selecting the project through a compact dropdown.
- Global vault contains shared company context and reusable cross-project material.
- Project vault contains uploaded docs for the active project.
- Actions: summarize, compare, extract table.
- Source rows should show source title, type, signal, and status.

### Artifacts

Artifacts are outputs, not source docs.

Required behavior:

- Two top tabs: selected project and all projects.
- Project tab should allow selecting the project through the same minimal dropdown pattern as Vault.
- Type filters should filter artifacts by deliverable type.
- Clicking an artifact updates the preview panel.
- Artifact cards should include title, type, project if cross-project, and short description.

### Decision Log

Decision Log presents locked decisions and assumptions. Canonical storage remains an architecture decision.

Required behavior:

- Show pending and locked states clearly.
- Pending decisions should have a `Lock` action.
- Locked decisions should be used by future Copilot runs.
- Each decision should be linkable to evidence sources and related artifacts.

### API

API page helps users run Tegy from Claude Code or Codex instead of the web app.

Required behavior:

- Show agent tabs: Claude Code and Codex.
- Show copyable setup command.
- Show masked API key row.
- Show copyable run command that tells the local agent to use Tegy project context, vault, decision log, and artifacts.
- Copy buttons should give immediate copied feedback.

## Navigation and Layout

Desktop:

- Fixed left sidebar.
- Sidebar collapse button behaves like Codex: collapsed state shows only the logo until hover exposes expand.
- Bottom controls stay pinned: theme toggle and account profile.
- Sidebar shows Copilot, Projects accordion, Vault, Artifacts, Decision Log, API, New chat, Pinned chats, and Recent chats.

Small screens:

- Current prototype is desktop-only below `900px`.
- On narrow screens, show a branded desktop-required view: `Use a wider screen`.
- Do not expose a compressed mobile app until the PRD explicitly requires mobile productivity workflows.
- If mobile is later required, restart from responsive workflow requirements instead of stretching the desktop UI.

## Visual System

The current visual direction is minimal, premium, and Harvey-inspired with Tegy branding.

Current prototype fonts match the `tegy-product-page` repo:

- Display: `Lora`
- Mono/UI: `Space Mono`

Production implementation can keep these fonts or replace them with the final Tegy brand fonts from the product site. Do not mix unrelated typography across pages. Before production build, run a type-scale pass against the product-page repo so app labels, nav items, tabs, and chat text do not feel undersized.

Brand voice:

- Use concise operator language.
- Prefer StrategyOS/Tegy terms already present in the repos: project, context, source, output, artifact, decision point, lane, agent, pack.
- Avoid invented labels such as `business jobs` unless the PRD explicitly locks that language.

UI principles:

- Keep pages clean and object-based.
- Avoid decorative landing-page sections inside the app.
- Use consistent panels, tabs, chips, and buttons.
- Preserve dark and light mode parity.
- Avoid horizontal scrolling.
- Ensure long labels truncate cleanly.

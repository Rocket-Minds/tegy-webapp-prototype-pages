# Tegy UI and Feature Review

Date: 2026-06-04

## Review Status

This is a local StrategyOS/Tegy plugin-pack review of the prototype UI and feature surface.

Hosted Tegy REST was attempted once for this review and returned `401 Invalid TEGY_API_KEY`. This document should not be represented as hosted Tegy output.

Local review basis:

- `/Users/borg/.codex/skills/tegy/SKILL.md`
- `/Users/borg/.codex/plugins/cache/personal/strategyos/1.0.1-beta/`
- `index.html`
- `app.js`
- `styles.css`
- Live local server check: `http://127.0.0.1:4173/` returned `200 OK`

Visual note: Playwright is not installed in this environment, so this pass is source/render-behavior review, not pixel screenshot QA.

## Executive Verdict

The prototype is directionally strong as a Harvey-like Tegy workbench. The page taxonomy is now mostly right: `Copilot`, `Projects`, `Vault`, `Artifacts`, `Decision Log`, and `API` map cleanly to the user-facing workbench model.

The remaining issues are product-logic issues more than styling issues. To align with the StrategyOS/Tegy pack, the prototype needs to show upstream gates, remove `Fundraising` as a canonical lane, strengthen decision-point lifecycle UI, and make generated outputs traceable back to sources, gates, and decisions.

## Findings

### P1: Router shows `Fundraising` as a canonical lane

Reference: `app.js:155`

The local StrategyOS/Tegy pack defines four discipline domains and six chat-project install surfaces: business strategy, product management, GTM strategy, GTM execution, M&A strategy, and M&A target fit. `Fundraising` is not a canonical lane in the pack.

The UI can still support investor memos and board narratives, but routing should label them under the correct StrategyOS discipline, likely `Business Strategy` or delivery/off-ramp packaging depending on the output. Keeping `Fundraising` as a lane will teach users and engineers the wrong routing model.

Recommended fix:

- Replace `Fundraising` route label with `Business Strategy`.
- Keep `Investor memo` as an output type.
- In the route logic, show that investor output is a packaging/off-ramp from business strategy, not a separate canonical lane.

### P1: Copilot run does not show StrategyOS upstream gates

References: `app.js:800`, `app.js:883`, `app.js:896`

The local Tegy rules require upstream dependency checks before analytical work. GTM requires product strategy verification. Product requires market scope and customer evidence. M&A requires buy-side/sell-side, acquirer type, and upstream strategy.

The current run UI shows `Router -> Vault analyst -> Strategist -> Critic -> Output writer`, which is visually nice but skips the hard-gate moment. That is a StrategyOS behavior mismatch.

Recommended fix:

- Add a first visible run step called `Gate check`.
- Show per-lane gate copy:
  - GTM: `Product strategy verified` or `Salvage mode required`.
  - Product: `Market scope + customer evidence verified`.
  - M&A: `Buy-side/sell-side + acquirer type verified`.
  - Business Strategy: `Decision context + current baseline verified`.
- If a gate is missing, show a blocked state rather than immediately generating an output.

### P1: Decision Log is visually present but not StrategyOS-grade

References: `index.html:400`, `app.js:944`

The page has pending, locked, and default cards, which is the right start. But a StrategyOS decision point carries more lifecycle information than a status label. The `dp-index` schema includes role, default assumed, lock date, lock method, lock value, trace, and consumed-by rounds.

The current `Lock` interaction only changes the card class and removes the button. It does not show the user what was locked, who locked it, what trace/evidence supports it, or where it will be consumed.

Recommended fix:

- Add decision metadata rows:
  - `Role`
  - `Default assumed`
  - `Evidence`
  - `Trace`
  - `Consumed by`
- When clicking `Lock`, open a confirmation panel with lock value and evidence source, not an instant flip.
- Make Copilot output actions create or update decision cards.

### P1: Output actions are not connected to Artifacts or Decision Log

References: `app.js:823`, `app.js:829`

The Copilot run ends with `Open Artifact` and `Lock Decision`, but those buttons do not currently create/select an artifact or add/lock a decision. For a demo, this creates a dead-end after the most important moment in the product: generated work becoming durable project state.

Recommended fix:

- `Open Artifact` should navigate to `Artifacts`, select the generated output, and show provenance.
- `Lock Decision` should open a decision lock panel or add a pending decision to Decision Log.
- The assistant response should indicate whether the output is draft, ready, or blocked by a decision.

### P1: API page command does not match the available Tegy install surfaces

References: `index.html:466`, `app.js:259`

The API page currently shows `claude "set up https://tegy.io/SKILL.md"`. The hosted discovery stub points users toward trial key creation, NPX install, REST, MCP, and authenticated entrypoints. The local pack README points toward plugin install commands.

Recommended fix:

- Replace the placeholder setup command with a real supported path or label it as illustrative.
- Add `Check access` or `Create trial key` affordance if hosted Tegy is the intended path.
- Add a local-plugin path for installed StrategyOS/Tegy pack usage.

### P2: Projects page is the right object, but project creation is fake

References: `index.html:152`, `app.js:986`

`Projects` is correctly framed as strategic matters. The project detail panel has the right child objects: Vault, Copilot, Active Output, Artifacts, Decision Log.

But `New project` only changes the visible title to `New Tegy Project`. It does not create an empty project context, source scope, decision log, or output state. For product review, this should either be disabled, marked as prototype-only, or made into a modal that shows the expected project-init fields.

Recommended fix:

- Replace instant title mutation with a `Create Project` modal.
- Ask for the StrategyOS project-init fields: problem statement, operating constraints, effort tier, reference inputs.
- Create empty states for project Vault, Artifacts, and Decision Log.

### P2: Vault page is structurally right but lacks evidence/provenance behavior

References: `index.html:313`, `app.js:575`, `app.js:1144`

The `Global` and project-source tab model is correct. The table columns are simple and useful. Actions for summarize, compare, and extract table are the right user verbs.

The missing Tegy discipline is evidence trace. Results should show source references, evidence tiers, and extracted assumptions as first-class output, not just a single generic result sentence.

Recommended fix:

- After a Vault action, show a structured result card:
  - Answer
  - Sources used
  - Evidence tier
  - Assumptions extracted
  - Candidate decision points
- Let users send a Vault result into Copilot or save it as source context.

### P2: Artifacts page correctly separates outputs, but lacks StrategyOS artifact metadata

References: `index.html:356`, `app.js:660`

Artifacts are correctly framed as outputs and are project-filterable. The all-project/project tab model now matches Vault, which is good.

What is missing is StrategyOS artifact identity: upstream inputs, lane, agent/pack, status, decision locks consumed, and version. Existing StrategyOS PRD examples use frontmatter and upstream references; the UI should hint at that.

Recommended fix:

- Add compact metadata to the preview:
  - `Lane`
  - `Agent/pack`
  - `Status`
  - `Upstream sources`
  - `Decision locks consumed`
  - `Version`
- Make artifact status visible on cards: `Draft`, `Ready`, `Approved`, `Archived`.

### P2: Sidebar chat history is useful but not project-aware enough

References: `index.html:86`, `index.html:107`

The Claude-like chat history is a good interaction pattern. The issue is that StrategyOS work is project-scoped by default. The current sidebar recents look global and do not show project ownership, lane, or output type.

Recommended fix:

- Add small project/output metadata to recent chats.
- When a project is selected, consider filtering recents or grouping them by project.
- Keep pinned chats global only if they are clearly cross-project.

## Page-by-Page Review

| Page | Tegy fit | UI fit | Notes |
|---|---|---|---|
| Copilot | Partial | Strong | Correct primary surface; needs upstream gates, blocked states, output-to-artifact connection, decision lock flow. |
| Projects | Strong | Strong | Correct root object; project detail objects are right; creation flow is too fake. |
| Vault | Strong | Good | Correct input/source surface; needs citations, evidence tiers, assumptions, send-to-Copilot/save behavior. |
| Artifacts | Strong | Good | Correct generated-output surface; needs provenance, status, lane/agent metadata, versioning. |
| Decision Log | Partial | Good start | Needs `dp-index` style lifecycle metadata and trace, not just cards. |
| API | Partial | Good shell | Useful page concept; setup command and key states need to match real hosted/local install paths. |
| Sidebar | Good | Strong | Clean Harvey/Claude blend; project accordion and recents work; recents should become project-aware. |
| Desktop gate | Good | Good | Matches current desktop-only decision. |

## Feature Coverage Against Tegy Behavior

| Feature | Verdict | Reason |
|---|---|---|
| Project-first workbench | Pass | Project is prominent in sidebar and Projects page. |
| Explicit source context | Pass with gaps | Context chips start unselected, which is good; source result provenance is missing. |
| Lane routing | Partial | Routing exists, but labels/gates do not fully match StrategyOS pack discipline. |
| Live agent/run progress | Partial | Strong visual pattern; missing upstream verification and blocked-state behavior. |
| Generated outputs | Partial | Draft output appears; not persisted into Artifacts. |
| Decision points | Partial | Cards exist; missing role, trace, default, consumed-by, lock method. |
| Vault actions | Partial | Actions exist; results are not structured enough for StrategyOS evidence discipline. |
| Artifacts filtering | Pass | Project/all-project and type filters are useful and consistent. |
| API/local-agent bridge | Partial | Correct concept; command copy needs real install/access paths. |
| Visual consistency | Pass with notes | Premium minimal system is coherent; long analytical content may need slightly stronger readability affordances. |

## UI Quality Notes

The visual system is now broadly consistent: compact sidebar, restrained cards, Lora headings, Space Mono shell text, dark/light parity, and minimal tabs. It feels close to Harvey without becoming a copy.

The main visual risk is density. Space Mono is elegant for labels and command surfaces, but long StrategyOS outputs can become tiring. For production, keep Space Mono for shell, metadata, commands, and chips; consider a more readable body face for long generated artifacts if the product page brand permits it.

The second visual risk is weak distinction between action and state. `Open Artifact`, `Lock Decision`, `Summarize`, `Compare`, and `Extract table` should produce visible durable state changes in the prototype so the demo communicates the Tegy loop.

## Recommended Fix Order

1. Fix lane taxonomy: remove `Fundraising` as canonical lane.
2. Add upstream gate step to every Copilot run template.
3. Make Copilot output actions affect Artifacts and Decision Log.
4. Upgrade Decision Log cards to show `dp-index` style lifecycle metadata.
5. Update API commands to match hosted/local install reality.
6. Add artifact provenance/status metadata.
7. Add structured Vault action result cards.

## Bottom Line

The page set is right. The UI system is good enough to share as a prototype. The core gap is that the product behavior still feels like a simulated AI chat with strategy labels, not yet like Tegy enforcing StrategyOS gates, decision locks, provenance, and artifact lifecycle.

Fix those discipline cues and the prototype will tell the right story: Tegy is not just a chat UI; it is a StrategyOS workbench.

const state = {
  activeProject: "Tegy Launch",
  assistantProject: "Tegy Launch",
  assistantOutput: null,
  vaultScope: "global",
  artifactScope: "all",
  artifactType: "all",
  selectedArtifactTitle: "Segment decision memo",
  selectedArtifactProject: "Tegy Launch",
  chatStarted: false,
};

const defaultPromptPlaceholder =
  "Ask Tegy to size a market, pressure-test a GTM motion, draft a PRD, or screen an acquisition...";

function getDefaultProjectName() {
  return Object.keys(projectSummaries)[0] || null;
}

const projectSummaries = {
  "Tegy Launch": {
    context: "Founder-led PLG launch",
    docs: "38 sources",
    constraints: "3 actor model",
    decisions: "14 locks",
    artifacts: "12 saved",
    lane: "GTM launch checklist",
    priorProject: "Prior Project",
    contextNote: "Organic-first, modest budget, 90-day window",
    docsNote: "Decks, interviews, models, memos",
    constraintsNote: "Founder, engineering, GTM agency pending",
    decisionsNote: "4 pending before next lane run",
    artifactsNote: "Decision memo, PRD, GTM checklist, board brief",
    laneNote: "Wedge, motion, channel, message, first operating rhythm",
    history:
      "Last Tegy run: GTM motion selected as PLG primary with AI-agent-led activation. Critic pass recommends revise-before-ship.",
  },
  "Series A Board Pack": {
    context: "Fundraise narrative",
    docs: "24 sources",
    constraints: "6-week investor timeline",
    decisions: "8 locks",
    artifacts: "7 saved",
    lane: "Investor memo",
    priorProject: "Prior Project",
    contextNote: "Category narrative, expansion thesis, investor positioning",
    docsNote: "Board slides, metrics notes, market research",
    constraintsNote: "Partner meetings and diligence in parallel",
    decisionsNote: "2 assumptions need founder confirmation",
    artifactsNote: "Board memo, investor FAQ, narrative deck",
    laneNote: "Investor memo and thesis critique in progress",
    history:
      "Last Copilot run: built a board-ready storyline and surfaced two assumptions around expansion timing.",
  },
  "Target Fit Screen": {
    context: "Strategic acquirer thesis",
    docs: "19 sources",
    constraints: "Buy-side screen only",
    decisions: "6 locks",
    artifacts: "9 saved",
    lane: "Segment decision memo",
    priorProject: "Prior Project",
    contextNote: "Capability gap, market map, target archetypes",
    docsNote: "Target notes, market maps, diligence memos",
    constraintsNote: "No outreach before thesis lock",
    decisionsNote: "3 diligence caveats open",
    artifactsNote: "Investment thesis memo, screen table, decision brief",
    laneNote: "Options, tradeoffs, and decision memo in progress",
    history:
      "Last Copilot run: screened six targets against capability gap and produced one target-fit memo draft.",
  },
};

const projectVaultSources = {
  "Tegy Launch": [
    ["Product roadmap synthesis", "Memo", "High", "Indexed"],
    ["Founder interview notes", "Research", "Medium", "Needs review"],
    ["Channel economics draft", "Model", "Medium", "Indexed"],
    ["Pricing assumptions", "Spreadsheet", "Low", "Assumption-heavy"],
  ],
  "Series A Board Pack": [
    ["Investor narrative draft", "Memo", "High", "Indexed"],
    ["ARR bridge model", "Spreadsheet", "High", "Indexed"],
    ["Market timing notes", "Research", "Medium", "Needs review"],
    ["Board Q&A backlog", "Brief", "Medium", "Indexed"],
  ],
  "Target Fit Screen": [
    ["Target universe map", "Table", "High", "Indexed"],
    ["Capability gap thesis", "Memo", "High", "Indexed"],
    ["Screening scorecard", "Model", "Medium", "Needs review"],
    ["Integration caveats", "Brief", "Medium", "Assumption-heavy"],
  ],
};

const globalVaultSources = [
  ["Company operating model", "Context", "High", "Global"],
  ["Reusable strategy templates", "Templates", "High", "Global"],
  ["Cross-project decision patterns", "Decision Log", "Medium", "Global"],
  ["Reusable GTM templates", "Templates", "Medium", "Global"],
];

const artifactDescriptions = {
  "Segment decision memo":
    "Compare strategic options, clarify tradeoffs, and choose a path with more confidence.",
  "Roadmap rationale":
    "Turn customer pain, market context, and strategy into clearer product priorities.",
  "GTM launch checklist":
    "Pick the right customer wedge, motion, channel, message, and first operating rhythm.",
  "Board memo":
    "Executive narrative with decision, supporting facts, risks, and next moves.",
  "Investment thesis memo":
    "Turn messy market, traction, and strategy inputs into a clearer investor or IC narrative.",
  "Pricing and packaging memo":
    "Improve pricing and packaging with value capture, plan shape, and assumption caveats.",
  "Investor FAQ":
    "Likely investor objections, concise answers, supporting evidence, and follow-up owners.",
  "Target-fit memo":
    "Strategic fit, capability gaps, integration caveats, and the recommendation to pursue or pass.",
  "Screening scorecard":
    "A comparable target table with weighted criteria, evidence confidence, and next diligence questions.",
};

const artifactMeta = {
  "Segment decision memo": {
    lane: "Business Strategy",
    status: "Ready",
    sources: "Project Sources, Decision Log",
    decisions: "DP-3, DP-7",
    version: "v1",
  },
  "GTM launch checklist": {
    lane: "GTM Strategy",
    status: "Draft",
    sources: "Product roadmap synthesis, Channel economics draft",
    decisions: "DP-2, DP-9",
    version: "v0.3",
  },
  "Pricing and packaging memo": {
    lane: "Product Management",
    status: "Draft",
    sources: "Pricing assumptions, Global Context",
    decisions: "DP-11",
    version: "v0.2",
  },
  "Board memo": {
    lane: "Business Strategy",
    status: "Ready",
    sources: "Investor narrative draft, ARR bridge model",
    decisions: "DP-1, DP-4",
    version: "v1",
  },
  "Investment thesis memo": {
    lane: "M&A Strategy",
    status: "Draft",
    sources: "Market timing notes, Target universe map",
    decisions: "DP-5",
    version: "v0.4",
  },
  "Investor FAQ": {
    lane: "Business Strategy",
    status: "Draft",
    sources: "Board Q&A backlog, Global Context",
    decisions: "DP-6",
    version: "v0.2",
  },
  "Target-fit memo": {
    lane: "M&A Target Fit",
    status: "Ready",
    sources: "Capability gap thesis, Screening scorecard",
    decisions: "DP-8, DP-10",
    version: "v1",
  },
  "Screening scorecard": {
    lane: "M&A Target Fit",
    status: "Ready",
    sources: "Target universe map",
    decisions: "DP-8",
    version: "v1",
  },
};

const artifactSections = {
  "Segment decision memo": [
    {
      eyebrow: "Decision",
      title: "Choose the PLG-primary wedge, not a broad launch motion.",
      body:
        "The current evidence supports a narrow founder-led PLG motion. Keep sales-assisted and agency-led outbound as controlled follow-ons until activation behavior is visible.",
      table: [
        ["Option", "Why it wins", "Risk", "Call"],
        ["PLG primary", "Fastest path to usage proof", "Needs clean activation metric", "Ship"],
        ["Sales-assisted", "Useful for named targets", "Premature before ICP lock", "Hold"],
        ["Agency outbound", "Scales distribution", "Creates noise before message lock", "Gate"],
      ],
    },
    {
      eyebrow: "Locks",
      title: "Three decisions need to travel with downstream outputs.",
      bullets: [
        "DP-3: ICP stays founder-led operators until first activation cohort proves otherwise.",
        "DP-7: Activation means saved or reused output, not just generated content.",
        "DP-9: Named-list assets wait for founder validation of the first ABM target set.",
      ],
    },
    {
      eyebrow: "Next action",
      title: "Convert this into one GTM launch checklist and one board-ready rationale.",
      body:
        "The memo is ready for execution only after the decision log records who owns the activation threshold and when the motion gets revisited.",
      callout: "Verdict: Ready with one open ship gate on named-list validation.",
    },
  ],
  "GTM launch checklist": [
    {
      eyebrow: "Gate",
      title: "Revise before demand-gen execution.",
      body:
        "Tegy routes this through the GTM Strategy lane after product strategy, ICP, and PLG-primary motion are present as context. Execution can start after four fixes are applied.",
      table: [
        ["Fix", "Owner", "When", "Ship impact"],
        ["Activation metric", "Product", "Week 0", "Prevents vanity success"],
        ["Founder time cap", "Founder", "Week 0", "Keeps cadence realistic"],
        ["5-10 interviews", "Founder", "Weeks 1-2", "Validates creator-fit risk"],
        ["ABM list gate", "Founder", "Week 0", "Blocks premature assets"],
      ],
    },
    {
      eyebrow: "Sequence",
      title: "Wedge -> motion -> channel -> operating rhythm.",
      bullets: [
        "Wedge: founder-led operators with immediate strategy-output pain.",
        "Motion: PLG first, assisted by founder proof and source-gated examples.",
        "Channel: founder network first, LinkedIn second, Reddit/community third.",
        "Operating rhythm: Week 4 and Week 8 actual-vs-plan reviews before any channel expansion.",
      ],
    },
    {
      eyebrow: "Output",
      title: "First 90 days should test conversion-rate viability, not revenue scale.",
      body:
        "The checklist should keep launch learning tight: activation, conversion, source quality, and repeat output use. Revenue-scale is a later proof point.",
      callout: "Next lock: founder validates the ABM tier-1 named list before per-target collateral is generated.",
    },
  ],
  "Roadmap rationale": [
    {
      eyebrow: "Product call",
      title: "Prioritize activation clarity before feature breadth.",
      body:
        "The roadmap should reduce uncertainty around the first successful workflow before expanding into adjacent use cases. This follows the product lane's pain -> constraint -> priority -> PRD sequence.",
      table: [
        ["Priority", "Why", "Evidence", "Decision"],
        ["Activation instrumentation", "Defines real value", "Roadmap notes + decision log", "Build first"],
        ["Project-scoped context", "Makes outputs reusable", "Vault usage pattern", "Build"],
        ["Template breadth", "Increases surface area", "Low direct evidence", "Defer"],
      ],
    },
    {
      eyebrow: "Evidence tier",
      title: "Observed behavior outranks interview-only preference.",
      bullets: [
        "Treat saved output, reused source context, and reopened artifacts as stronger evidence than chat volume.",
        "Use interviews to explain behavior, not to replace behavior.",
        "Every roadmap item should name the decision it is trying to unlock.",
      ],
    },
    {
      eyebrow: "Output",
      title: "Convert rationale into PRD-ready sections.",
      body:
        "Each feature bet should carry customer pain, constraint, decision owner, confidence, and revisit trigger.",
      callout: "Verdict: Build activation clarity and project context before adding more output templates.",
    },
  ],
  "Investor memo": [
    {
      eyebrow: "Narrative",
      title: "Lead with strategy and proof, not fundraising mechanics.",
      body:
        "This is a Business Strategy output packaged for investor consumption. It should separate the durable thesis from the fundraise mechanics and keep assumptions visible.",
      table: [
        ["Narrative block", "Role in memo", "Evidence state", "Owner"],
        ["Market timing", "Why now", "Medium", "Founder"],
        ["Right to win", "Why this team", "Medium-low", "Founder"],
        ["Proof stack", "Why believe", "Medium", "Product/GTM"],
        ["Use of capital", "What changes", "Draft", "Founder"],
      ],
    },
    {
      eyebrow: "Objections",
      title: "Make diligence questions visible instead of hiding them.",
      bullets: [
        "Is this a product, a service wrapper, or a workflow system?",
        "Which signal proves repeat use beyond founder novelty?",
        "What breaks if PLG activation is lower than expected?",
      ],
    },
    {
      eyebrow: "Delivery",
      title: "Use one shared spine across memo, deck, and talking points.",
      body:
        "The same decision narrative should drive the board memo, investor FAQ, and meeting script.",
      callout: "Next lock: decide whether this memo is for board alignment, investor outreach, or IC-style diligence.",
    },
  ],
  "Pricing and packaging memo": [
    {
      eyebrow: "Pricing call",
      title: "Keep the first package simple enough to test value capture.",
      body:
        "The product lane should not overfit packaging before activation and repeat-use behavior are visible. Use a simple subscription spine with explicit usage guardrails.",
      table: [
        ["Package", "Buyer job", "Why", "Risk"],
        ["Free teaser", "Taste the workflow", "Reduces adoption friction", "Can under-signal willingness to pay"],
        ["Pro", "Use Tegy repeatedly", "Matches AI-seat mental model", "Needs clear included usage"],
        ["Enterprise waitlist", "Capture pull", "Avoids v1 sales complexity", "Manual follow-up burden"],
      ],
    },
    {
      eyebrow: "Assumptions",
      title: "Token, seat, and overage choices are product decisions with engineering input.",
      bullets: [
        "Do not make pricing depend on a hidden technical architecture choice.",
        "Show bundle limits in user language, not provider-cost language.",
        "Use telemetry to revisit whether package shape matches actual output creation.",
      ],
    },
    {
      eyebrow: "Next lock",
      title: "Lock the free-to-pro conversion event before copy or checkout work.",
      body:
        "The main open decision is what user behavior earns the upgrade prompt: output saved, output reused, source uploaded, or decision locked.",
      callout: "Verdict: Draft until bundle sizing and upgrade-trigger policy are confirmed.",
    },
  ],
  "Board memo": [
    {
      eyebrow: "Board ask",
      title: "Approve the 90-day launch with two explicit gates.",
      body:
        "The board memo should convert strategy analysis into a decision. The ask is not to approve every downstream asset; it is to approve the learning plan and the gate discipline.",
      table: [
        ["Gate", "Decision required", "Timing", "If failed"],
        ["Activation", "Saved or reused output threshold", "Day 30", "Revise product workflow"],
        ["GTM", "Named ICP and channel signal", "Day 60", "Re-cut wedge"],
        ["Resourcing", "Founder time cap realistic", "Week 4", "Descope channels"],
      ],
    },
    {
      eyebrow: "Risks",
      title: "The risks are execution-sequence risks, not existential strategy risks.",
      bullets: [
        "Founder time can cap demand generation before message quality is proven.",
        "Broad GTM assets can create false confidence before the named list is locked.",
        "Investor narrative can overstate evidence if assumptions are not labeled.",
      ],
    },
    {
      eyebrow: "Decision",
      title: "Ship the learning system, not a polished campaign.",
      body:
        "The strongest board call is a controlled launch with visible decision locks, source trace, and revisit points.",
      callout: "Next lock: board approves the launch gates and the owner for each revisit trigger.",
    },
  ],
  "Investment thesis memo": [
    {
      eyebrow: "Thesis",
      title: "Pursue the narrow strategic wedge, not category sprawl.",
      body:
        "The M&A Strategy lane frames this as an IC-style thesis: target the capability gap that improves the core motion, avoid broad market adjacency until diligence proves strategic control.",
      table: [
        ["Thesis pillar", "Current read", "Evidence", "Confidence"],
        ["Market timing", "Demand forming around AI-assisted strategy work", "Market timing notes", "Medium"],
        ["Right to win", "Workflow rigor and decision discipline are differentiators", "Source context + prior outputs", "Medium"],
        ["Target logic", "Acquire capability that closes distribution or workflow gap", "Target universe map", "Medium-low"],
        ["Diligence gap", "Retention and integration evidence still thin", "Screening scorecard", "Low"],
      ],
    },
    {
      eyebrow: "IC risks",
      title: "The memo should make the bear case investable.",
      bullets: [
        "If repeat output use is weak, the acquisition thesis becomes services-heavy.",
        "If target data is not comparable, the scorecard can imply precision that is not real.",
        "If the wedge is too broad, integration energy will dilute the core product motion.",
      ],
    },
    {
      eyebrow: "Recommendation",
      title: "Advance only targets that improve the locked strategic motion.",
      body:
        "A target is worth diligence if it strengthens the locked wedge, accelerates distribution, or closes a capability gap without forcing a new strategy.",
      callout: "Verdict: Draft. Advance to ready after the target-fit scorecard and decision log agree on the pursue/pass threshold.",
    },
  ],
  "Investor FAQ": [
    {
      eyebrow: "Likely objection",
      title: "Is Tegy a product, a services wrapper, or a strategy operating system?",
      body:
        "The answer should be direct: Tegy is a project-based AI workbench that routes source-grounded strategy work through reusable StrategyOS lanes and returns governed outputs.",
      table: [
        ["Objection", "Short answer", "Evidence needed"],
        ["Product or service?", "Product workflow with expert lane logic", "Activation and repeat-use data"],
        ["Why now?", "AI work needs governance and decision memory", "Source reuse + decision logs"],
        ["Moat?", "Rigor, workflows, and accumulated context", "Output quality over multiple projects"],
      ],
    },
    {
      eyebrow: "Answer bank",
      title: "Keep answers concise and evidence-labeled.",
      bullets: [
        "Use 'we know' only for observed product behavior or locked decisions.",
        "Use 'we believe' for market claims still relying on founder pattern matching.",
        "Use 'we are testing' for pricing, segment, and channel claims.",
      ],
    },
    {
      eyebrow: "Follow-up",
      title: "Route unanswered objections back into source collection.",
      body:
        "Each unanswered investor question should become a source request, decision lock, or artifact update instead of living only in the chat thread.",
      callout: "Next lock: decide which three objections must be proven before the next investor meeting.",
    },
  ],
  "Target-fit memo": [
    {
      eyebrow: "Recommendation",
      title: "Pursue only targets that close the locked capability gap.",
      body:
        "The M&A Target Fit lane should keep target screening anchored to the strategic matter. A target does not win because it is interesting; it wins because it tightens the chosen motion.",
      table: [
        ["Target archetype", "Strategic fit", "Risk", "Call"],
        ["Workflow data layer", "Improves source memory", "Integration complexity", "Advance"],
        ["Agency services shop", "Adds distribution", "Services drag", "Hold"],
        ["Template marketplace", "Adds breadth", "Weak defensibility", "Pass"],
      ],
    },
    {
      eyebrow: "Diligence locks",
      title: "Do not move to outreach before three locks are clear.",
      bullets: [
        "DP-8: The target must map to a specific capability gap.",
        "DP-10: Integration risk must be visible in the scorecard.",
        "DP-12: The pursue/pass threshold must be agreed before reviewing new targets.",
      ],
    },
    {
      eyebrow: "Next action",
      title: "Turn the memo into a comparable screen, not a narrative-only opinion.",
      body:
        "The next useful output is a screening scorecard with weighted criteria, confidence, and source trace.",
      callout: "Verdict: Ready when the scorecard confirms fit on capability, timing, and integration risk.",
    },
  ],
  "Screening scorecard": [
    {
      eyebrow: "Scorecard",
      title: "Rank by strategic fit first, ease second.",
      body:
        "The screen should compare targets against the chosen thesis and expose evidence quality. Ease of acquisition matters only after strategic fit clears the threshold.",
      table: [
        ["Target", "Fit", "Evidence", "Call"],
        ["Workflow data layer", "High", "Capability gap thesis + source map", "Advance"],
        ["Vertical research library", "Medium", "Market notes", "Hold"],
        ["Services-enabled agency", "Low-medium", "Interview notes", "Pass"],
      ],
    },
    {
      eyebrow: "Interpretation",
      title: "Scores should explain what to learn next.",
      bullets: [
        "A high score creates a diligence question, not an automatic acquisition recommendation.",
        "A medium score needs one specific evidence request before it can be revisited.",
        "A pass should name which strategic assumption failed.",
      ],
    },
    {
      eyebrow: "Output",
      title: "Move advanced targets into the target-fit memo.",
      body:
        "The scorecard is the comparison view. The target-fit memo is the recommendation view. Keep them linked but not duplicated.",
      callout: "Next lock: agree on the minimum score and evidence threshold for outreach.",
    },
  ],
};

const projectArtifacts = {
  "Tegy Launch": [
    ["Segment decision memo", "Memo", "Options, tradeoffs, and the call to make"],
    ["GTM launch checklist", "Plan", "Wedge, motion, channel, operating rhythm"],
    ["Pricing and packaging memo", "Brief", "Value capture, plan shape, and caveats"],
  ],
  "Series A Board Pack": [
    ["Board memo", "Board", "One-page decision narrative"],
    ["Investment thesis memo", "Investor", "Market, traction, risks, and IC narrative"],
    ["Investor FAQ", "Brief", "Likely objections, evidence, and answer bank"],
  ],
  "Target Fit Screen": [
    ["Target-fit memo", "Memo", "Strategic fit, capability gaps, and recommendation"],
    ["Screening scorecard", "Table", "Weighted target comparison and evidence quality"],
    ["Investment thesis memo", "Investor", "Market, traction, risks, and IC narrative"],
  ],
};

const routingLanes = [
  {
    lane: "GTM Strategy",
    agent: "GTM strategist",
    output: "GTM launch checklist",
    logic: "Wedge -> motion -> channel -> operating rhythm",
    keywords: ["gtm", "launch", "channel", "sales", "segment", "pricing", "package", "motion", "funnel"],
  },
  {
    lane: "Product Management",
    agent: "Product strategist",
    output: "Roadmap rationale",
    logic: "Pain -> constraint -> priority -> PRD",
    keywords: ["product", "roadmap", "prd", "feature", "onboarding", "activation", "retention", "user"],
  },
  {
    lane: "Business Strategy",
    template: "Investor Narrative",
    agent: "Strategy delivery agent",
    output: "Investor memo",
    logic: "Strategy -> proof -> objections -> investor memo",
    keywords: ["invest", "investor", "fundraise", "fundraising", "series a", "board", "deck", "ic memo"],
  },
  {
    lane: "M&A Target Fit",
    agent: "Target-fit screener",
    output: "Target-fit memo",
    logic: "Thesis -> fit criteria -> diligence gaps -> pursue/pass",
    keywords: ["m&a", "acquisition", "target", "diligence", "screen", "buyer", "strategic acquirer"],
  },
  {
    lane: "Business Strategy",
    agent: "Decision architect",
    output: "Segment decision memo",
    logic: "Options -> assumptions -> tradeoffs -> decision lock",
    keywords: ["strategy", "decision", "market", "positioning", "business", "competition", "moat"],
  },
];

const laneRunTemplates = {
  "GTM Strategy": {
    title: "GTM launch checklist draft",
    gate: "Product strategy verified; GTM motion can run without salvage mode.",
    steps: [
      ["Gate check", "Verified product strategy, ICP, positioning, and PLG-primary motion before GTM work."],
      ["Router", "Matched the request to GTM Strategy and selected the launch checklist output."],
      ["Vault analyst", "Pulled roadmap synthesis, channel economics, and locked GTM-motion decisions."],
      ["GTM strategist", "Built the wedge, motion, channel, message, and operating rhythm."],
      ["Critic", "Flagged the ABM named-list lock as the main ship gate before per-target assets."],
      ["Output writer", "Prepared the decision-ready GTM launch checklist."],
    ],
    answer: [
      "Start with PLG primary and keep sales-assisted work out of v1 until activation data lands.",
      "Use founder-led proof to validate one named ICP segment before the agency builds outbound assets.",
      "Ship a 30-day launch checklist around wedge, message, channel experiment, and decision lock owner.",
    ],
  },
  "Product Management": {
    title: "Roadmap rationale draft",
    gate: "Market scope and customer-evidence tier verified.",
    steps: [
      ["Gate check", "Verified market scope, customer evidence tier, and product direction before roadmap work."],
      ["Router", "Matched the request to Product Management and selected roadmap rationale."],
      ["Vault analyst", "Pulled user pain, roadmap notes, and activation constraints."],
      ["Product strategist", "Ranked problems by customer pain, urgency, and implementation constraint."],
      ["Critic", "Checked whether the rationale overcommits before retention data arrives."],
      ["Output writer", "Prepared the roadmap rationale with PRD-ready sections."],
    ],
    answer: [
      "Anchor the next roadmap cycle on activation clarity rather than breadth of new features.",
      "Promote the onboarding instrumentation work because it reduces uncertainty across later bets.",
      "Hold speculative expansion features until retention evidence confirms the target workflow.",
    ],
  },
  "Investor Narrative": {
    title: "Investor memo draft",
    gate: "Business-strategy narrative packaged as an investor output.",
    steps: [
      ["Gate check", "Verified strategy context, current proof, and decision assumptions before investor packaging."],
      ["Router", "Matched the request to Business Strategy and selected investor memo as the output."],
      ["Vault analyst", "Pulled board notes, traction context, and market timing assumptions."],
      ["Strategy delivery agent", "Built the category narrative, proof stack, objections, and risk framing."],
      ["Critic", "Checked for unsupported claims and marked diligence questions."],
      ["Output writer", "Prepared the investor memo draft."],
    ],
    answer: [
      "Lead with the founder-led wedge and why the timing is better now than six months ago.",
      "Separate proven traction from assumptions so investor objections are visible instead of hidden.",
      "Use the memo to ask for feedback on market sequencing, not only fundraising readiness.",
    ],
  },
  "M&A Target Fit": {
    title: "Target-fit memo draft",
    gate: "Buy-side strategic-acquirer context verified.",
    steps: [
      ["Gate check", "Verified buy-side/sell-side, acquirer type, and upstream strategy before target-fit work."],
      ["Router", "Matched the request to M&A Target Fit and selected target-fit memo."],
      ["Vault analyst", "Pulled target data, capability-gap thesis, and diligence caveats."],
      ["Target-fit screener", "Scored strategic fit, integration risk, and evidence confidence."],
      ["Critic", "Checked whether any pursue/pass recommendation needs missing diligence."],
      ["Output writer", "Prepared the target-fit memo."],
    ],
    answer: [
      "Screen targets against the capability gap first, then market adjacency second.",
      "Treat integration caveats as decision locks before any outreach recommendation.",
      "Return a pursue/pass recommendation with evidence confidence and next diligence owner.",
    ],
  },
  "Business Strategy": {
    title: "Segment decision memo draft",
    gate: "Decision context and current baseline verified.",
    steps: [
      ["Gate check", "Verified decision context, operating constraints, and current baseline before strategy work."],
      ["Router", "Matched the request to Business Strategy and selected decision memo."],
      ["Vault analyst", "Pulled company context, prior decisions, and market assumptions."],
      ["Decision architect", "Compared options, tradeoffs, risks, and assumption locks."],
      ["Critic", "Checked whether the decision can be locked or needs more evidence."],
      ["Output writer", "Prepared the segment decision memo."],
    ],
    answer: [
      "Make the decision explicit before generating execution artifacts.",
      "Separate evidence-backed locks from assumptions that still need validation.",
      "Return the next action with owner, confidence, and a revisit trigger.",
    ],
  },
};

const agentCommands = {
  claude: {
    label: "Claude Code",
    setup:
      "npx --yes --package=https://strategy-platform-4.cluster-9.deploy.emergentcf.cloud/api/packages/tegy-skill.tgz tegy-skill add",
    run: 'claude "Use Tegy. Read the selected project context, sources, decision log, and artifacts, then route through the right StrategyOS lane before drafting the next output."',
  },
  codex: {
    label: "Codex",
    setup:
      "npx --yes --package=https://strategy-platform-4.cluster-9.deploy.emergentcf.cloud/api/packages/tegy-skill.tgz tegy-skill add",
    run: 'codex "Use Tegy. Read the selected project context, sources, decision log, and artifacts, then route through the right StrategyOS lane before drafting the next output."',
  },
};

function syncIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setPage(page) {
  document.querySelectorAll(".page").forEach((section) => {
    section.classList.toggle("active", section.dataset.page === page);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.pageTarget === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setSidebarCollapsed(collapsed) {
  const shell = document.querySelector(".app-shell");
  const toggle = document.querySelector("#sidebarToggle");
  if (!shell || !toggle) return;

  if (isMobileNav()) {
    setMobileMenu(false);
    return;
  }

  setAccountMenu(false);
  shell.classList.toggle("sidebar-collapsed", collapsed);
  toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  toggle.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
  toggle.innerHTML = `<i data-lucide="${collapsed ? "panel-left-open" : "panel-left-close"}"></i>`;
  if (collapsed) toggle.blur();
  window.localStorage.setItem("tegy-sidebar-collapsed", collapsed ? "true" : "false");
  syncIcons();
}

function isMobileNav() {
  return window.matchMedia?.("(max-width: 620px)").matches;
}

function setMobileMenu(open) {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector("#sidebarToggle");
  if (!sidebar || !toggle) return;

  sidebar.classList.toggle("mobile-menu-open", open);
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  toggle.title = open ? "Close menu" : "Open menu";
  toggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  syncIcons();
}

function syncResponsiveNavigation() {
  const shell = document.querySelector(".app-shell");
  const toggle = document.querySelector("#sidebarToggle");
  if (!shell || !toggle) return;

  if (isMobileNav()) {
    setMobileMenu(document.querySelector(".sidebar")?.classList.contains("mobile-menu-open"));
    return;
  }

  document.querySelector(".sidebar")?.classList.remove("mobile-menu-open");
  const collapsed = shell.classList.contains("sidebar-collapsed");
  toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  toggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  toggle.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
  toggle.innerHTML = `<i data-lucide="${collapsed ? "panel-left-open" : "panel-left-close"}"></i>`;
  syncIcons();
}

function setProjectsAccordion(open) {
  const group = document.querySelector("#projectsNavGroup");
  const toggle = document.querySelector("#projectsAccordionToggle");
  const list = document.querySelector("#projectSidebarList");
  if (!group || !toggle || !list) return;

  group.classList.toggle("projects-open", open);
  list.hidden = !open;
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
  toggle.setAttribute("aria-label", open ? "Collapse projects" : "Expand projects");
  toggle.title = open ? "Collapse projects" : "Expand projects";
  toggle.innerHTML = `<i data-lucide="${open ? "chevron-down" : "chevron-right"}"></i>`;
  window.localStorage.setItem("tegy-projects-open", open ? "true" : "false");
  syncIcons();
}

function setActiveChat(button) {
  document.querySelectorAll(".history-chat-row").forEach((row) => row.classList.remove("active"));
  const row = button.closest(".history-chat-row");
  if (row) row.classList.add("active");

  const title = button.dataset.chatTitle || button.textContent.trim();
  const input = document.querySelector("#promptInput");
  if (input) {
    input.placeholder = `Continue ${title}...`;
  }
  setChatMode(true);
  setPage("assistant");
}

function setRecentsOpen(open) {
  const button = document.querySelector("#recentsToggle");
  const list = document.querySelector("#recentChatList");
  if (!button || !list) return;

  list.hidden = !open;
  button.setAttribute("aria-expanded", open ? "true" : "false");
  button.innerHTML = `<span>Recents</span><i data-lucide="${open ? "chevron-down" : "chevron-right"}"></i>`;
  syncIcons();
}

function setProjectTabMenu(menuId, triggerId, open) {
  const menu = document.querySelector(menuId);
  const trigger = document.querySelector(triggerId);
  if (!menu || !trigger) return;

  menu.hidden = !open;
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
}

function setAgent(agent) {
  const config = agentCommands[agent] || agentCommands.claude;
  document.querySelectorAll(".agent-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.agent === agent);
  });

  document.querySelector("#agentSetupTitle").textContent = config.label;
  document.querySelector("#agentRunTitle").textContent = `${config.label} command`;
  document.querySelector("#setupCommand").textContent = config.setup;
  document.querySelector("#runCommand").textContent = config.run;
}

function copyToClipboard(text, button) {
  const done = () => {
    const original = button.innerHTML;
    button.innerHTML = `<i data-lucide="check"></i> Copied`;
    syncIcons();
    window.setTimeout(() => {
      button.innerHTML = original;
      syncIcons();
    }, 1200);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    return;
  }

  fallbackCopy(text, done);
}

function fallbackCopy(text, done) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  done();
}

function setAccountMenu(open) {
  const button = document.querySelector("#accountButton");
  const menu = document.querySelector("#accountMenu");
  if (!button || !menu) return;

  button.setAttribute("aria-expanded", open ? "true" : "false");
  menu.hidden = !open;
}

function getStoredTheme() {
  try {
    return window.localStorage.getItem("tegy-theme");
  } catch {
    return null;
  }
}

function setStoredTheme(theme) {
  try {
    window.localStorage.setItem("tegy-theme", theme);
  } catch {
    // Ignore private browsing/storage failures.
  }
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  const button = document.querySelector("#themeToggle");
  document.documentElement.dataset.theme = nextTheme;
  setStoredTheme(nextTheme);

  if (button) {
    const isDark = nextTheme === "dark";
    button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    button.innerHTML = `<i data-lucide="${isDark ? "sun" : "moon"}"></i><span>${isDark ? "Light mode" : "Dark mode"}</span>`;
    syncIcons();
  }
}

function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getActiveContexts() {
  return [...document.querySelectorAll(".source-chip.active .chip-label")].map((label) =>
    label.textContent.trim(),
  );
}

function showToast(message) {
  let toast = document.querySelector("#toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 1800);
}

function setSourceChipActive(chip, active) {
  chip.classList.toggle("active", active);
  chip.setAttribute("aria-pressed", active ? "true" : "false");
}

function updateContextSourceAvailability() {
  const hasProjectScope = Boolean(state.assistantProject);
  ["project-vault", "prior-project", "decision-log"].forEach((chipName) => {
    const chip = document.querySelector(`[data-context-chip="${chipName}"]`);
    if (!chip) return;

    chip.disabled = !hasProjectScope;
    chip.setAttribute("aria-disabled", hasProjectScope ? "false" : "true");
    if (!hasProjectScope) {
      setSourceChipActive(chip, false);
    }
  });
}

function getPromptPlaceholder() {
  if (state.assistantProject && state.assistantOutput) {
    return `Ask Tegy to build the ${state.assistantOutput.toLowerCase()} for ${state.assistantProject}...`;
  }

  if (state.assistantProject) {
    return `Ask Tegy what to analyze, decide, or draft for ${state.assistantProject}...`;
  }

  if (state.assistantOutput) {
    return `Ask Tegy to build a ${state.assistantOutput.toLowerCase()} from your selected sources...`;
  }

  return defaultPromptPlaceholder;
}

function updateActiveContextScope() {
  const scope = document.querySelector("#activeContextScope");
  const count = document.querySelector("#contextCount");

  const contexts = getActiveContexts();
  if (!contexts.length) {
    if (scope) scope.textContent = "No sources selected";
    if (count) count.textContent = "0 selected";
    return;
  }

  if (count) {
    count.textContent = `${contexts.length} selected`;
  }

  if (!scope) return;

  const hasProjectVault = document.querySelector('[data-context-chip="project-vault"]')?.classList.contains("active");
  const hasGlobal = contexts.includes("Global Company Context");
  if (hasProjectVault && hasGlobal) {
    scope.textContent = "Project + global";
    return;
  }

  scope.textContent = hasProjectVault ? "Project only" : `${contexts.length} sources`;
}

function renderAssistantScope() {
  const projectName = state.assistantProject;
  const project = projectName ? projectSummaries[projectName] : null;

  document.querySelector("#activeProjectScope").textContent = projectName || "No project selected";
  document.querySelector("#activeOutputScope").textContent = state.assistantOutput || "No output selected";
  document.querySelector("#projectVaultChip").textContent = projectName ? `${projectName} Sources` : "Project Sources";
  document.querySelector("#priorProjectChip").textContent = project?.priorProject || "Prior Project";
  const input = document.querySelector("#promptInput");
  if (input) {
    input.placeholder = getPromptPlaceholder();
  }
  updateContextSourceAvailability();
  updateActiveContextScope();
}

function renderVaultRows() {
  const isProjectScope = state.vaultScope === "project";
  const rows = isProjectScope ? projectVaultSources[state.activeProject] : globalVaultSources;
  const subtitle = isProjectScope ? `${state.activeProject} Context` : "Global Context";
  const description = isProjectScope
    ? `Summarize, Compare, Extract ${state.activeProject} Sources`
    : "Summarize, Compare, Extract Global Context";

  document.querySelector("#vaultTitle").textContent = "Vault";
  document.querySelector("#vaultSubtitle").textContent = subtitle;
  document.querySelector("#vaultScopeTitle").textContent = description;
  document.querySelector("#vaultProjectTabLabel").textContent = state.activeProject;
  document.querySelector("#vaultProjectTab").classList.toggle("active", isProjectScope);
  const projectMenu = document.querySelector("#vaultProjectMenu");
  if (projectMenu) {
    projectMenu.innerHTML = Object.keys(projectSummaries)
      .map(
        (project) => `
          <button class="${state.activeProject === project ? "active" : ""}" type="button" data-vault-project="${escapeHtml(project)}">${escapeHtml(project)}</button>
        `,
      )
      .join("");

    projectMenu.querySelectorAll("[data-vault-project]").forEach((button) => {
      button.addEventListener("click", () => {
        state.vaultScope = "project";
        setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
        selectProject(button.dataset.vaultProject, { scopeAssistant: false });
        renderVaultRows();
      });
    });
  }

  document.querySelectorAll("[data-vault-scope]").forEach((button) => {
    button.classList.toggle("active", !isProjectScope && button.dataset.vaultScope === state.vaultScope);
  });

  const container = document.querySelector("#vaultRows");
  container.innerHTML = rows
    .map(
      ([source, type, signal, status], index) => `
        <button class="${index === 0 ? "selected" : ""}" type="button">
          <span>${escapeHtml(source)}</span>
          <span>${escapeHtml(type)}</span>
          <span>${escapeHtml(signal)}</span>
          <span>${escapeHtml(status)}</span>
        </button>
      `,
    )
    .join("");

  container.querySelectorAll("button").forEach((row) => {
    row.addEventListener("click", () => {
      container.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
      row.classList.add("selected");
    });
  });

  const result = document.querySelector("#vaultResult");
  result.innerHTML = isProjectScope
    ? `Select an action to work across ${escapeHtml(state.activeProject)} sources.`
    : "Select an action to work across global context, frameworks, templates, and reusable decisions.";
}

function setVaultScope(scope) {
  state.vaultScope = scope;
  setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
  renderVaultRows();
}

function getArtifactRowsForScope() {
  if (state.artifactScope === "all") {
    return Object.entries(projectArtifacts).flatMap(([project, rows]) =>
      rows.map(([title, type, note]) => ({ project, title, type, note })),
    );
  }

  return (projectArtifacts[state.activeProject] || []).map(([title, type, note]) => ({
    project: state.activeProject,
    title,
    type,
    note,
  }));
}

function renderMetaItems(items) {
  return items
    .map(
      ([label, value]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `,
    )
    .join("");
}

function renderMetaList(items, className) {
  return `<dl class="${className}">${renderMetaItems(items)}</dl>`;
}

function updateArtifactPreview(title, fallbackNote = "") {
  const meta = artifactMeta[title] || {
    lane: "StrategyOS",
    status: "Draft",
    sources: "Selected sources",
    decisions: "Pending lock",
    version: "v0.1",
  };
  const titleEl = document.querySelector("#artifactTitle");
  const descriptionEl = document.querySelector("#artifactDescription");
  const metaEl = document.querySelector("#artifactMeta");
  state.selectedArtifactTitle = title;

  if (titleEl) titleEl.textContent = title;
  if (descriptionEl) {
    descriptionEl.textContent = artifactDescriptions[title] || fallbackNote;
  }
  if (metaEl) {
    metaEl.innerHTML = renderMetaItems(
      [
        ["Lane", meta.lane],
        ["Status", meta.status],
        ["Sources", meta.sources],
        ["Decision locks", meta.decisions],
        ["Version", meta.version],
      ],
    );
  }
}

function getArtifactProject(title, preferredProject) {
  if (preferredProject && projectArtifacts[preferredProject]?.some(([artifactTitle]) => artifactTitle === title)) {
    return preferredProject;
  }

  const found = Object.entries(projectArtifacts).find(([, rows]) =>
    rows.some(([artifactTitle]) => artifactTitle === title),
  );
  return found?.[0] || state.activeProject || getDefaultProjectName();
}

function getArtifactType(title, project) {
  const row = projectArtifacts[project]?.find(([artifactTitle]) => artifactTitle === title);
  return row?.[1] || outputTypeToArtifactType(title);
}

function getArtifactDetail(title, project, fallbackNote = "") {
  const meta = artifactMeta[title] || {
    lane: "StrategyOS",
    status: "Draft",
    sources: "Selected sources",
    decisions: "Pending lock",
    version: "v0.1",
  };
  const type = getArtifactType(title, project);
  const description = artifactDescriptions[title] || fallbackNote || "Generated output from Tegy.";
  const sections =
    artifactSections[title] ||
    [
      {
        eyebrow: "Generated Output",
        title: description,
        body:
          "Review the source context, trace, and decision locks before this output moves from draft to ready.",
      },
      {
        eyebrow: "Trace",
        title: `${meta.lane} produced this ${type.toLowerCase()}.`,
        body:
          "The artifact page keeps the readable output separate from the underlying implementation choice: it could be a message, file, record, or derived view.",
      },
      {
        eyebrow: "Next lock",
        title: meta.decisions,
        body:
          "Any pending decision should be locked in the decision lifecycle before the artifact is treated as ship-ready.",
      },
    ];

  return { meta, type, description, sections };
}

function renderArtifactTable(table) {
  if (!Array.isArray(table) || !table.length) return "";
  return `
    <div class="artifact-mini-table" role="table">
      ${table
        .map(
          (row, index) => `
            <div class="artifact-table-row ${index === 0 ? "is-head" : ""}" role="row" style="--artifact-table-columns: ${row.length}">
              ${row.map((cell) => `<span role="cell">${escapeHtml(cell)}</span>`).join("")}
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderArtifactSection(section) {
  const body = section.body ? `<p class="artifact-section-body">${escapeHtml(section.body)}</p>` : "";
  const bullets = Array.isArray(section.bullets) && section.bullets.length
    ? `
      <ul class="artifact-bullets">
        ${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    `
    : "";
  const table = renderArtifactTable(section.table);
  const callout = section.callout
    ? `<p class="artifact-callout">${escapeHtml(section.callout)}</p>`
    : "";

  return `
    <section class="artifact-doc-section">
      <p class="eyebrow">${escapeHtml(section.eyebrow)}</p>
      <h2>${escapeHtml(section.title)}</h2>
      ${body}
      ${table}
      ${bullets}
      ${callout}
    </section>
  `;
}

function renderArtifactDetail(title, project, fallbackNote = "") {
  const resolvedProject = getArtifactProject(title, project);
  const detail = getArtifactDetail(title, resolvedProject, fallbackNote);
  state.selectedArtifactTitle = title;
  state.selectedArtifactProject = resolvedProject;

  document.querySelector("#artifactDetailTitle").textContent = title;
  document.querySelector("#artifactDetailSubtitle").textContent =
    `${resolvedProject} · ${detail.meta.lane} · ${detail.meta.status}`;
  document.querySelector("#artifactDetailMeta").innerHTML = renderMetaItems(
    [
      ["Project", resolvedProject],
      ["Type", detail.type],
      ["Lane", detail.meta.lane],
      ["Status", detail.meta.status],
      ["Version", detail.meta.version],
      ["Decision locks", detail.meta.decisions],
    ],
  );
  document.querySelector("#artifactDetailSources").innerHTML = detail.meta.sources
    .split(",")
    .map((source) => `<li>${escapeHtml(source.trim())}</li>`)
    .join("");
  document.querySelector("#artifactDetailSections").innerHTML = detail.sections
    .map((section) => renderArtifactSection(section))
    .join("");
}

function openArtifact(title, project, fallbackNote = "") {
  renderArtifactDetail(title, project, fallbackNote);
  setPage("artifact-detail");
  syncIcons();
}

function getArtifactMarkdown(title, project) {
  const resolvedProject = getArtifactProject(title, project);
  const detail = getArtifactDetail(title, resolvedProject);
  const metaLines = [
    `project: ${resolvedProject}`,
    `type: ${detail.type}`,
    `lane: ${detail.meta.lane}`,
    `status: ${detail.meta.status}`,
    `version: ${detail.meta.version}`,
    `sources: ${detail.meta.sources}`,
    `decision_locks: ${detail.meta.decisions}`,
  ].join("\n");
  const body = detail.sections
    .map((section) => sectionToMarkdown(section))
    .join("\n\n");

  return `---\n${metaLines}\n---\n\n# ${title}\n\n${body}\n`;
}

function tableToMarkdown(table) {
  if (!Array.isArray(table) || !table.length) return "";
  const [header, ...rows] = table;
  const separator = header.map(() => "---");
  return [header, separator, ...rows]
    .map((row) => `| ${row.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`)
    .join("\n");
}

function sectionToMarkdown(section) {
  const parts = [`## ${section.title}`, `_${section.eyebrow}_`];
  if (section.body) parts.push(section.body);
  if (section.table) parts.push(tableToMarkdown(section.table));
  if (section.bullets) parts.push(section.bullets.map((item) => `- ${item}`).join("\n"));
  if (section.callout) parts.push(`> ${section.callout}`);
  return parts.filter(Boolean).join("\n\n");
}

function renderArtifacts() {
  const scopeRows = getArtifactRowsForScope();
  const availableTypes = [...new Set(scopeRows.map((row) => row.type))];
  if (state.artifactType !== "all" && !availableTypes.includes(state.artifactType)) {
    state.artifactType = "all";
  }

  const filteredRows =
    state.artifactType === "all"
      ? scopeRows
      : scopeRows.filter((row) => row.type === state.artifactType);
  const rows = filteredRows.length ? filteredRows : scopeRows;
  const grid = document.querySelector("#artifactGrid");
  const typeFilters = document.querySelector("#artifactTypeFilters");
  if (!grid || !typeFilters) return;

  document.querySelector("#artifactSubtitle").textContent =
    state.artifactScope === "project"
      ? `${state.activeProject} Outputs`
      : "All Project Outputs";
  document.querySelector("#artifactProjectTabLabel").textContent = state.activeProject;
  document.querySelector("#artifactProjectTab").classList.toggle("active", state.artifactScope === "project");
  const artifactProjectMenu = document.querySelector("#artifactProjectMenu");
  if (artifactProjectMenu) {
    artifactProjectMenu.innerHTML = Object.keys(projectSummaries)
      .map(
        (project) => `
          <button class="${state.activeProject === project ? "active" : ""}" type="button" data-artifact-project="${escapeHtml(project)}">${escapeHtml(project)}</button>
        `,
      )
      .join("");

    artifactProjectMenu.querySelectorAll("[data-artifact-project]").forEach((button) => {
      button.addEventListener("click", () => {
        state.artifactScope = "project";
        state.artifactType = "all";
        setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
        selectProject(button.dataset.artifactProject, { scopeAssistant: false });
        renderArtifacts();
      });
    });
  }

  document.querySelectorAll("[data-artifact-scope]").forEach((button) => {
    button.classList.toggle("active", button.dataset.artifactScope === state.artifactScope);
  });

  typeFilters.innerHTML = ["all", ...availableTypes]
    .map((type) => {
      const label = type === "all" ? "All" : type;
      return `<button class="filter-chip ${state.artifactType === type ? "active" : ""}" type="button" data-artifact-type="${escapeHtml(type)}">${escapeHtml(label)}</button>`;
    })
    .join("");

  grid.innerHTML = rows
    .map(
      ({ project, title, type, note }, index) => `
        <button class="artifact-card ${index === 0 ? "selected" : ""}" data-artifact="${escapeHtml(title)}" data-project="${escapeHtml(project)}">
          <span>${escapeHtml(type)}</span>
          <strong>${escapeHtml(title)}</strong>
          <em>${escapeHtml(artifactMeta[title]?.status || "Draft")}</em>
          <small>${state.artifactScope === "all" ? `${escapeHtml(project)} · ` : ""}${escapeHtml(note)}</small>
        </button>
      `,
    )
    .join("");

  grid.querySelectorAll("[data-artifact]").forEach((card) => {
    card.addEventListener("click", () => {
      grid.querySelectorAll("[data-artifact]").forEach((item) => item.classList.remove("selected"));
      card.classList.add("selected");
      const artifact = card.dataset.artifact;
      state.selectedArtifactProject = card.dataset.project;
      updateArtifactPreview(artifact, card.querySelector("small").textContent);
    });
  });

  const first = grid.querySelector("[data-artifact]");
  if (first) {
    state.selectedArtifactProject = first.dataset.project;
    updateArtifactPreview(first.dataset.artifact, first.querySelector("small").textContent);
  }

  typeFilters.querySelectorAll("[data-artifact-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.artifactType = button.dataset.artifactType;
      renderArtifacts();
    });
  });
}

function setLanePicker(open) {
  const picker = document.querySelector("#lanePicker");
  if (!picker) return;
  picker.hidden = !open;
}

function selectOutput(output) {
  state.assistantOutput = output;
  document.querySelectorAll("#lanePicker [data-output]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.output === output);
  });
  renderAssistantScope();
  setLanePicker(false);
}

function sendPromptToAssistant(prompt) {
  setPage("assistant");
  setLanePicker(false);
  const input = document.querySelector("#promptInput");
  input.value = prompt;
  addResponse(prompt);
  input.value = "";
  resizePromptInput();
}

function getProjectDefaultRoute() {
  const summary = state.assistantProject ? projectSummaries[state.assistantProject] : null;
  if (!summary) return routingLanes.at(-1);
  const lane = routingLanes.find((item) => item.output === summary.lane || summary.lane.includes(item.output));
  return lane || routingLanes.at(-1);
}

function routePrompt(prompt) {
  const normalized = prompt.toLowerCase();
  const selectedOutputRoute = state.assistantOutput
    ? routingLanes.find((lane) => lane.output === state.assistantOutput)
    : null;

  return (
    selectedOutputRoute ||
    routingLanes.find((lane) => lane.keywords.some((keyword) => normalized.includes(keyword))) ||
    getProjectDefaultRoute()
  );
}

function getLaneRun(route) {
  return laneRunTemplates[route.template || route.lane] || laneRunTemplates["Business Strategy"];
}

function renderAgentRun(run) {
  return `
    <section class="agent-run" aria-label="Live agent run">
      <div class="agent-run-header">
        <span class="live-dot"></span>
        <strong>Agents Running Output</strong>
        <small>Live</small>
      </div>
      <div class="gate-banner">
        <i data-lucide="shield-check"></i>
        <span>${escapeHtml(run.gate || "StrategyOS gate verified.")}</span>
      </div>
      <div class="agent-stream">
        ${run.steps
          .map(
            ([agent, message], index) => `
              <div class="agent-step ${index === 0 ? "active" : ""}" data-agent-step="${index}">
                <span class="agent-step-dot"></span>
                <div>
                  <strong>${escapeHtml(agent)}</strong>
                  <p>${escapeHtml(message)}</p>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
      <article class="output-preview" hidden>
        <p class="eyebrow">Draft Output</p>
        <h3>${escapeHtml(run.title)}</h3>
        <dl class="output-meta">
          <div><dt>Status</dt><dd>Draft</dd></div>
          <div><dt>Trace</dt><dd>Gate -> router -> critic -> output</dd></div>
          <div><dt>Decision</dt><dd>Pending lock</dd></div>
        </dl>
        <ul>
          ${run.answer.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        <div class="output-actions">
          <button type="button" data-run-action="open-artifact"><i data-lucide="file-text"></i> Open Artifact</button>
          <button type="button" data-run-action="lock-decision"><i data-lucide="shield-check"></i> Lock Decision</button>
        </div>
      </article>
    </section>
  `;
}

function animateAgentRun(card) {
  const steps = [...card.querySelectorAll(".agent-step")];
  const preview = card.querySelector(".output-preview");
  steps.forEach((step, index) => {
    window.setTimeout(() => {
      steps.forEach((item, itemIndex) => {
        item.classList.toggle("active", itemIndex === index);
        if (itemIndex < index) item.classList.add("complete");
      });
      if (index === steps.length - 1) {
        step.classList.add("complete");
        window.setTimeout(() => {
          if (preview) preview.hidden = false;
          card.querySelector(".agent-run-header small").textContent = "Ready";
          syncIcons();
        }, 420);
      }
    }, index * 520);
  });
}

function setChatMode(started) {
  state.chatStarted = started;
  const stage = document.querySelector(".assistant-stage");
  if (!stage) return;
  stage.classList.toggle("chat-mode", started);
}

function addResponse(prompt) {
  const stack = document.querySelector("#conversationStack");
  if (!stack) return;

  setChatMode(true);
  const contexts = getActiveContexts();
  const contextText = contexts.length ? contexts.join(", ") : "no selected context";
  const route = routePrompt(prompt);
  const run = getLaneRun(route);
  const projectText = state.assistantProject ? state.assistantProject : "No project selected";
  const draftTitle = run.title.replace(/\sdraft$/i, "");

  const userCard = document.createElement("article");
  userCard.className = "message-card user-message";
  userCard.innerHTML = `<p>${escapeHtml(prompt)}</p>`;

  const card = document.createElement("article");
  card.className = "response-card assistant-message";
  card.dataset.outputTitle = draftTitle;
  card.dataset.outputType = route.output;
  card.dataset.routeLane = route.lane;
  card.dataset.routeAgent = route.agent;
  card.dataset.project = projectText;
  card.innerHTML = `
    <div class="route-kicker">
      <span>Lane</span>
      <strong>${escapeHtml(route.lane)}</strong>
    </div>
    <strong>Tegy spawned the ${escapeHtml(route.agent)}.</strong>
    <div class="route-chip-row" aria-label="Routing details">
      <span><i data-lucide="folder-check"></i>${escapeHtml(projectText)}</span>
      <span><i data-lucide="route"></i>${escapeHtml(route.logic)}</span>
      <span><i data-lucide="file-output"></i>${escapeHtml(route.output)}</span>
      <span><i data-lucide="database"></i>${contexts.length ? `${contexts.length} selected` : "No sources selected"}</span>
    </div>
    <p><b>Request:</b> ${escapeHtml(prompt)}</p>
    <p>${contexts.length ? `Using ${escapeHtml(contextText)}, Tegy is running the lane logic` : "With no context selected, Tegy is running the lane logic"} and building a decision-ready ${escapeHtml(route.output.toLowerCase())}.</p>
    ${renderAgentRun(run)}
  `;
  stack.append(userCard, card);
  syncIcons();
  animateAgentRun(card);
  window.requestAnimationFrame(() => {
    card.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function outputTypeToArtifactType(output) {
  const normalized = output.toLowerCase();
  if (normalized.includes("checklist") || normalized.includes("gtm")) return "Plan";
  if (normalized.includes("roadmap") || normalized.includes("prd")) return "PRD";
  if (normalized.includes("investor") || normalized.includes("board")) return "Board";
  if (normalized.includes("target")) return "Memo";
  return "Memo";
}

function addGeneratedArtifact(card) {
  const project = card.dataset.project && card.dataset.project !== "No project selected"
    ? card.dataset.project
    : getDefaultProjectName();
  const title = card.dataset.outputTitle || "Generated output";
  const type = outputTypeToArtifactType(card.dataset.outputType || title);
  const lane = card.dataset.routeLane || "StrategyOS";
  const sources = getActiveContexts().join(", ") || "No sources selected";
  const note = `Generated by ${card.dataset.routeAgent || "Tegy"} from ${lane}`;

  if (!projectArtifacts[project]) projectArtifacts[project] = [];
  if (!projectArtifacts[project].some(([existingTitle]) => existingTitle === title)) {
    projectArtifacts[project].unshift([title, type, note]);
  }

  artifactDescriptions[title] =
    artifactDescriptions[title] ||
    `Generated output from Copilot. Review the trace, evidence sources, and decision locks before shipping.`;
  artifactMeta[title] = {
    lane,
    status: "Draft",
    sources,
    decisions: "Pending lock",
    version: "v0.1",
  };

  state.activeProject = project;
  state.artifactScope = "project";
  state.artifactType = "all";
  renderArtifacts();
  openArtifact(title, project, note);
  showToast("Output opened as Artifact");
}

function selectProject(projectName, options = {}) {
  const summary = projectSummaries[projectName];
  if (!summary) return;
  const { scopeAssistant = true } = options;

  state.activeProject = projectName;
  document.querySelector("#projectDetailTitle").textContent = projectName;
  const detailCards = document.querySelectorAll(".detail-grid article");
  const values = [
    ["Company Context", summary.context, summary.contextNote],
    ["Sources", summary.docs, summary.docsNote],
    ["Operating Constraints", summary.constraints, summary.constraintsNote],
    ["Decision Log", summary.decisions, summary.decisionsNote],
    ["Artifacts", summary.artifacts, summary.artifactsNote],
    ["Active Output", summary.lane, summary.laneNote],
  ];

  detailCards.forEach((card, index) => {
    const [label, value, note] = values[index];
    card.innerHTML = `<span>${label}</span><strong>${value}</strong><small>${note}</small>`;
  });

  document.querySelector(".history-card p").textContent = summary.history;
  document.querySelectorAll(".mini-project").forEach((item) => {
    item.classList.toggle("active", item.dataset.project === projectName);
  });
  document.querySelectorAll("[data-project-detail]").forEach((item) => {
    item.classList.toggle("selected", item.dataset.projectDetail === projectName);
  });
  if (scopeAssistant) {
    state.assistantProject = projectName;
  }
  renderAssistantScope();
  if (state.vaultScope === "project") renderVaultRows();
  renderArtifacts();
}

function lockDecision(card) {
  card.classList.remove("pending");
  card.classList.add("locked");
  card.querySelector("span").textContent = "Locked";
  const meta = card.querySelector(".decision-meta");
  if (meta && !meta.querySelector("[data-lock-date]")) {
    const item = document.createElement("div");
    item.dataset.lockDate = "true";
    item.innerHTML = `<dt>Lock date</dt><dd>${new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}</dd>`;
    meta.append(item);
  }
  const button = card.querySelector("button");
  if (button) button.remove();
  showToast("Decision locked");
}

function addDecisionFromRun(card) {
  const decisionLog = document.querySelector("#decisionLog");
  if (!decisionLog) return;

  const lane = card.dataset.routeLane || "StrategyOS";
  const output = card.dataset.outputType || "Generated output";
  const project = card.dataset.project && card.dataset.project !== "No project selected"
    ? card.dataset.project
    : "Unscoped";
  const title = `${output} ship gate`;

  if ([...decisionLog.querySelectorAll(".decision-card strong")].some((item) => item.textContent === title)) {
    setPage("decisions");
    showToast("Decision already exists");
    return;
  }

  const article = document.createElement("article");
  article.className = "decision-card pending";
  article.innerHTML = `
    <span>Pending</span>
    <strong>${escapeHtml(title)}</strong>
    <p>Lock the key assumption before this output moves from draft to ready.</p>
    ${renderMetaList(
      [
        ["Role", "Owner"],
        ["Project", project],
        ["Trace", `${lane} -> ${output}`],
        ["Consumed by", output],
      ],
      "decision-meta",
    )}
    <button class="lock-decision">Lock</button>
  `;

  article.querySelector(".lock-decision").addEventListener("click", () => lockDecision(article));
  decisionLog.prepend(article);
  setPage("decisions");
  showToast("Decision added to log");
}

function addDecisionFromArtifact() {
  const decisionLog = document.querySelector("#decisionLog");
  if (!decisionLog) return;

  const title = state.selectedArtifactTitle;
  const project = state.selectedArtifactProject || getArtifactProject(title);
  const detail = getArtifactDetail(title, project);
  const decisionTitle = `${title} readiness lock`;

  if ([...decisionLog.querySelectorAll(".decision-card strong")].some((item) => item.textContent === decisionTitle)) {
    setPage("decisions");
    showToast("Decision already exists");
    return;
  }

  const article = document.createElement("article");
  article.className = "decision-card pending";
  article.innerHTML = `
    <span>Pending</span>
    <strong>${escapeHtml(decisionTitle)}</strong>
    <p>Confirm the artifact can move from draft to ready with current sources, trace, and decision locks.</p>
    ${renderMetaList(
      [
        ["Role", "Owner"],
        ["Project", project],
        ["Trace", `${detail.meta.lane} -> ${title}`],
        ["Consumed by", title],
      ],
      "decision-meta",
    )}
    <button class="lock-decision">Lock</button>
  `;

  article.querySelector(".lock-decision").addEventListener("click", () => lockDecision(article));
  decisionLog.prepend(article);
  setPage("decisions");
  showToast("Decision added to log");
}

function getSelectedVaultRows() {
  const selected = document.querySelector("#vaultRows button.selected");
  const rows = selected ? [selected] : [...document.querySelectorAll("#vaultRows button")].slice(0, 2);
  return rows.map((row) => [...row.querySelectorAll("span")].map((span) => span.textContent.trim()));
}

function renderVaultResult(action, scopeLabel) {
  const rows = getSelectedVaultRows();
  const sourceSummary = rows
    .map(([source, type, signal, status]) => `${source} (${type}, ${signal}, ${status})`)
    .join("; ");
  const outputLabel =
    action === "Extract table"
      ? "Evidence table"
      : action === "Compare"
        ? "Comparison brief"
        : "Source summary";

  return `
    <div class="vault-result-card">
      <div>
        <p class="eyebrow">${escapeHtml(action)}</p>
        <strong>${escapeHtml(outputLabel)}</strong>
        <p>Tegy would use ${escapeHtml(scopeLabel)} and return a cited, evidence-tiered result.</p>
      </div>
      ${renderMetaList(
        [
          ["Sources", sourceSummary || "No source selected"],
          ["Mode", action],
          ["Output", outputLabel],
        ],
        "vault-result-meta",
      )}
    </div>
  `;
}

function resizePromptInput() {
  const input = document.querySelector("#promptInput");
  if (!input) return;
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
}

function init() {
  setTheme(getPreferredTheme());
  setSidebarCollapsed(window.localStorage.getItem("tegy-sidebar-collapsed") === "true");
  setProjectsAccordion(window.localStorage.getItem("tegy-projects-open") !== "false");
  setRecentsOpen(false);
  syncResponsiveNavigation();

  document.querySelector("#sidebarToggle").addEventListener("click", () => {
    if (isMobileNav()) {
      const sidebar = document.querySelector(".sidebar");
      setMobileMenu(!sidebar.classList.contains("mobile-menu-open"));
      return;
    }

    setSidebarCollapsed(!document.querySelector(".app-shell").classList.contains("sidebar-collapsed"));
  });

  window.matchMedia?.("(max-width: 620px)").addEventListener("change", syncResponsiveNavigation);

  document.querySelector("#projectsAccordionToggle").addEventListener("click", () => {
    const toggle = document.querySelector("#projectsAccordionToggle");
    setProjectsAccordion(toggle.getAttribute("aria-expanded") !== "true");
  });

  document.querySelector("#newChatButton").addEventListener("click", () => {
    document.querySelectorAll(".history-chat-row").forEach((row) => row.classList.remove("active"));
    const stack = document.querySelector("#conversationStack");
    const input = document.querySelector("#promptInput");
    if (stack) stack.innerHTML = "";
    setChatMode(false);
    state.assistantProject = getDefaultProjectName();
    state.assistantOutput = null;
    document.querySelectorAll("#lanePicker [data-output]").forEach((button) => button.classList.remove("selected"));
    document.querySelectorAll(".source-chip").forEach((chip) => setSourceChipActive(chip, false));
    renderAssistantScope();
    if (input) {
      input.value = "";
      input.style.height = "";
      input.placeholder = getPromptPlaceholder();
      input.focus();
    }
    setPage("assistant");
  });

  document.querySelector("#recentsToggle").addEventListener("click", () => {
    const button = document.querySelector("#recentsToggle");
    setRecentsOpen(button.getAttribute("aria-expanded") !== "true");
  });

  document.querySelectorAll(".agent-tab").forEach((button) => {
    button.addEventListener("click", () => setAgent(button.dataset.agent));
  });

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.copyTarget ? document.querySelector(`#${button.dataset.copyTarget}`) : null;
      const value = button.dataset.copyValue || target?.textContent.trim() || "";
      copyToClipboard(value, button);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".project-picker")) return;
    setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
    setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
    setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
  });

  document.querySelector("#vaultProjectTab").addEventListener("click", () => {
    state.vaultScope = "project";
    renderVaultRows();
    const menu = document.querySelector("#vaultProjectMenu");
    setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", menu.hidden);
  });

  document.querySelector("#artifactProjectTab").addEventListener("click", () => {
    state.artifactScope = "project";
    renderArtifacts();
    const menu = document.querySelector("#artifactProjectMenu");
    setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", menu.hidden);
  });

  document.querySelectorAll(".history-chat").forEach((button) => {
    button.addEventListener("click", () => setActiveChat(button));
  });

  document.querySelectorAll(".history-chat-menu").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      button.closest(".history-chat-row")?.classList.toggle("menu-open");
    });
  });

  document.querySelector("#themeToggle").addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  document.querySelector("#accountButton").addEventListener("click", () => {
    const shell = document.querySelector(".app-shell");
    if (shell.classList.contains("sidebar-collapsed")) {
      setSidebarCollapsed(false);
      setAccountMenu(true);
      return;
    }

    setAccountMenu(document.querySelector("#accountMenu").hidden);
  });

  document.querySelectorAll("#accountMenu button").forEach((button) => {
    button.addEventListener("click", () => setAccountMenu(false));
  });

  document.querySelectorAll("[data-page-target], [data-page-link]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.dataset.pageTarget || button.dataset.pageLink;
      setPage(page);
      if (isMobileNav()) setMobileMenu(false);
    });
  });

  document.querySelector("#newProjectInline").addEventListener("click", () => {
    document.querySelector("#projectDetailTitle").textContent = "New Tegy Project";
  });

  document.querySelectorAll(".mini-project[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      selectProject(button.dataset.project);
      setPage("assistant");
      if (isMobileNav()) setMobileMenu(false);
    });
  });

  document.querySelectorAll("[data-project-card], [data-project-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupSelector = button.dataset.projectCard ? "[data-project-card]" : "[data-project-detail]";
      document.querySelectorAll(groupSelector).forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectProject(button.dataset.projectCard || button.dataset.projectDetail);
      if (button.dataset.projectCard) setPage("projects");
    });
  });

  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => sendPromptToAssistant(button.dataset.prompt));
  });

  document.querySelectorAll("#lanePicker [data-output]").forEach((button) => {
    button.addEventListener("click", () => selectOutput(button.dataset.output));
  });

  document.querySelector("#setMatterButton").addEventListener("click", () => {
    const picker = document.querySelector("#lanePicker");
    setLanePicker(picker.hidden);
  });

  document.querySelector("#promptInput").addEventListener("input", resizePromptInput);

  document.querySelector("#promptInput").addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    document.querySelector("#composer").requestSubmit();
  });

  document.querySelector("#composer").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.querySelector("#promptInput");
    const prompt = input.value.trim();
    if (!prompt) return;
    addResponse(prompt);
    input.value = "";
    resizePromptInput();
  });

  document.querySelector("#conversationStack").addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-run-action]");
    if (!actionButton) return;

    const card = actionButton.closest(".assistant-message");
    if (!card) return;

    if (actionButton.dataset.runAction === "open-artifact") {
      addGeneratedArtifact(card);
      return;
    }

    if (actionButton.dataset.runAction === "lock-decision") {
      addDecisionFromRun(card);
    }
  });

  document.querySelectorAll(".source-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.disabled) return;
      setSourceChipActive(chip, !chip.classList.contains("active"));
      updateActiveContextScope();
    });
  });

  document.querySelector("#openArtifactButton").addEventListener("click", () => {
    openArtifact(state.selectedArtifactTitle, state.selectedArtifactProject);
  });

  document.querySelector("#artifactBackButton").addEventListener("click", () => {
    setPage("artifacts");
  });

  document.querySelector("#copyArtifactButton").addEventListener("click", (event) => {
    copyToClipboard(
      getArtifactMarkdown(state.selectedArtifactTitle, state.selectedArtifactProject),
      event.currentTarget,
    );
  });

  document.querySelector("#artifactLockButton").addEventListener("click", addDecisionFromArtifact);

  document.querySelectorAll(".vault-action").forEach((button) => {
    button.addEventListener("click", () => {
      const scopeLabel = state.vaultScope === "project" ? "project sources" : "global context";
      document.querySelector("#vaultResult").innerHTML = renderVaultResult(button.dataset.vaultAction, scopeLabel);
      syncIcons();
    });
  });

  document.querySelectorAll("[data-vault-scope]").forEach((button) => {
    button.addEventListener("click", () => setVaultScope(button.dataset.vaultScope));
  });

  document.querySelectorAll("[data-artifact-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      state.artifactScope = button.dataset.artifactScope;
      state.artifactType = "all";
      setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
      renderArtifacts();
    });
  });

  document.querySelector("#addSourceButton").addEventListener("click", () => {
    const scopeLabel = state.vaultScope === "project" ? "project sources" : "global context";
    document.querySelector("#vaultResult").innerHTML = `
      <div class="vault-result-card">
        <p class="eyebrow">Upload Source</p>
        <strong>Add to ${escapeHtml(scopeLabel)}</strong>
        <p>Upload decks, notes, interviews, market research, spreadsheets, or memos. Tegy indexes them as source context before they are used in Copilot runs.</p>
      </div>
    `;
  });

  document.querySelectorAll(".lock-decision").forEach((button) => {
    button.addEventListener("click", () => lockDecision(button.closest(".decision-card")));
  });

  setAgent("claude");
  selectProject(state.activeProject, { scopeAssistant: false });
  renderAssistantScope();
  renderVaultRows();
  syncIcons();
}

window.addEventListener("DOMContentLoaded", init);

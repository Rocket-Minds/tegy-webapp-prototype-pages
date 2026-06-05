const state = {
  activeProject: "Tegy Launch",
  assistantProject: "Tegy Launch",
  assistantOutput: null,
  assistantLaneChoice: "auto",
  vaultScope: "global",
  artifactScope: "all",
  artifactType: "all",
  artifactPage: 1,
  selectedArtifactTitle: "Segment decision memo",
  selectedArtifactProject: "Tegy Launch",
  assistantDepth: "Heavy",
  assistantReasoning: "Auto",
  assistantChoicesLocked: false,
  chatStarted: false,
};

const artifactPageSize = 6;

const defaultPromptPlaceholder =
  "Ask Tegy what to analyze, decide, or draft next...";

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
  "Pricing Package": {
    context: "Subscription packaging",
    docs: "16 sources",
    constraints: "WTP evidence thin",
    decisions: "5 locks",
    artifacts: "4 saved",
    lane: "Pricing and packaging memo",
    priorProject: "Prior Project",
    contextNote: "Plan shape, value metric, discount logic, buyer objections",
    docsNote: "Pricing tests, customer notes, comp screenshots",
    constraintsNote: "Do not change tiers before WTP lock",
    decisionsNote: "2 price fences need founder confirmation",
    artifactsNote: "Pricing memo, FAQ, plan comparison table",
    laneNote: "Value capture and package caveats in progress",
    history:
      "Last Copilot run: framed three pricing paths and flagged WTP as the load-bearing decision.",
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
  "Pricing Package": [
    ["Pricing test notes", "Research", "High", "Needs review"],
    ["Package comparison", "Table", "Medium", "Indexed"],
    ["Competitor pricing clips", "Research", "Medium", "Indexed"],
    ["Discount caveats", "Memo", "Low", "Assumption-heavy"],
  ],
};

const projectSummaryCopy = {
  "Tegy Launch":
    "Tegy Launch keeps the GTM motion, product constraints, and source context in one place. Use it to turn scattered inputs into a decision-ready launch output and lock the assumptions that matter.",
  "Series A Board Pack":
    "Series A Board Pack gathers the investor narrative, market evidence, and board materials needed for a clean fundraising story. Use it to turn diligence questions into a sharper memo, FAQ, and board-ready narrative.",
  "Target Fit Screen":
    "Target Fit Screen compares acquisition targets against the strategic acquirer thesis, capability gaps, and evidence quality. Use it to decide which targets deserve diligence, which should wait, and what assumptions need to be locked before outreach.",
  "Pricing Package":
    "Pricing Package holds the plan shape, value metric, and buyer-objection evidence behind the current packaging work. Use it to test willingness-to-pay assumptions before changing tiers, discounts, or conversion messaging.",
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
    decisions: "DP-3, DP-7, DP-9",
    version: "v1",
  },
  "Roadmap rationale": {
    lane: "Product Management",
    status: "Draft",
    sources: "Product roadmap synthesis, User pain notes",
    decisions: "DP-3, DP-7, DP-11",
    version: "v0.2",
  },
  "GTM launch checklist": {
    lane: "GTM Strategy",
    status: "Draft",
    sources: "Product roadmap synthesis, Channel economics draft",
    decisions: "DP-2, DP-9, DP-12",
    version: "v0.3",
  },
  "Pricing and packaging memo": {
    lane: "Product Management",
    status: "Draft",
    sources: "Pricing assumptions, Global Context",
    decisions: "DP-11, DP-14",
    version: "v0.2",
  },
  "Board memo": {
    lane: "Business Strategy",
    status: "Ready",
    sources: "Investor narrative draft, ARR bridge model",
    decisions: "DP-1, DP-4, DP-7",
    version: "v1",
  },
  "Investment thesis memo": {
    lane: "M&A Strategy",
    status: "Draft",
    sources: "Market timing notes, Target universe map",
    decisions: "DP-5, DP-13",
    version: "v0.4",
  },
  "Investor FAQ": {
    lane: "Business Strategy",
    status: "Draft",
    sources: "Board Q&A backlog, Global Context",
    decisions: "DP-6, DP-15",
    version: "v0.2",
  },
  "Investor memo": {
    lane: "Business Strategy",
    status: "Draft",
    sources: "Board Q&A backlog, Investor narrative draft",
    decisions: "DP-6, DP-15",
    version: "v0.2",
  },
  "Target-fit memo": {
    lane: "M&A Target Fit",
    status: "Ready",
    sources: "Capability gap thesis, Screening scorecard",
    decisions: "DP-8, DP-10, DP-12",
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

const artifactGenerationMeta = {
  "Segment decision memo": {
    artifact: "business-strategy-memo",
    round: "1",
    agent: "01-biz-01-strategist",
    skills: [
      "biz-mece-structure",
      "biz-hypothesis-driven-analysis",
      "biz-north-star-alignment",
      "biz-executive-comms",
    ],
    dpLocks: ["DP-3", "DP-7", "DP-9"],
    status: "draft - pending critic pass",
  },
  "Roadmap rationale": {
    artifact: "product-strategy-memo",
    round: "2",
    agent: "02-prod-01-product-strategist",
    skills: [
      "prod-market-definition",
      "prod-pain-solution-matrix",
      "prod-roadmap-sequencing",
      "prod-prd-writer",
      "biz-north-star-alignment",
    ],
    dpLocks: ["DP-3", "DP-7", "DP-11"],
    status: "draft - pending product critic pass",
  },
  "GTM launch checklist": {
    artifact: "gtm-launch-checklist",
    round: "3",
    agent: "03-gtm-01-gtm-strategist",
    skills: [
      "gtm-market-motion",
      "gtm-channel-economics",
      "gtm-demand-plan",
      "gtm-rigor-review",
      "biz-executive-comms",
    ],
    dpLocks: ["DP-2", "DP-9", "DP-12"],
    status: "draft - revise before ship",
  },
  "Pricing and packaging memo": {
    artifact: "pricing-packaging-memo",
    round: "2",
    agent: "02-prod-01-product-strategist",
    skills: [
      "prod-pricing-packaging",
      "prod-segmentation-mece",
      "prod-pain-solution-matrix",
      "biz-hypothesis-driven-analysis",
    ],
    dpLocks: ["DP-11", "DP-14"],
    status: "draft - pricing lock pending",
  },
  "Board memo": {
    artifact: "board-decision-memo",
    round: "4",
    agent: "01-biz-02-operator",
    skills: [
      "biz-executive-comms",
      "biz-storyline",
      "biz-mece-structure",
      "biz-north-star-alignment",
    ],
    dpLocks: ["DP-1", "DP-4", "DP-7"],
    status: "ready - board review",
  },
  "Investment thesis memo": {
    artifact: "ma-strategy-memo",
    round: "1",
    agent: "04-ma-01-ma-strategist",
    skills: [
      "ma-thesis-and-portfolio",
      "ma-deal-types",
      "ma-frameworks",
      "biz-mece-structure",
      "biz-executive-comms",
    ],
    dpLocks: ["DP-5", "DP-13"],
    status: "draft - diligence gaps open",
  },
  "Investor FAQ": {
    artifact: "investor-faq",
    round: "4",
    agent: "01-biz-02-operator",
    skills: [
      "biz-executive-comms",
      "biz-storyline",
      "biz-checkpoint-discipline",
      "biz-rigor-review",
    ],
    dpLocks: ["DP-6", "DP-15"],
    status: "draft - evidence labels pending",
  },
  "Investor memo": {
    artifact: "investor-narrative-memo",
    round: "4",
    agent: "01-biz-02-operator",
    skills: [
      "biz-executive-comms",
      "biz-storyline",
      "biz-rigor-review",
      "biz-north-star-alignment",
    ],
    dpLocks: ["DP-6", "DP-15"],
    status: "draft - investor packaging pass pending",
  },
  "Target-fit memo": {
    artifact: "target-fit-memo",
    round: "2",
    agent: "04-ma-01-ma-strategist",
    skills: [
      "ma-target-fit",
      "ma-rigor-review",
      "ma-thesis-and-portfolio",
      "biz-mece-structure",
    ],
    dpLocks: ["DP-8", "DP-10", "DP-12"],
    status: "ready - pursue/pass threshold locked",
  },
  "Screening scorecard": {
    artifact: "screening-scorecard",
    round: "2",
    agent: "04-ma-01-ma-strategist",
    skills: [
      "ma-target-fit",
      "ma-rigor-review",
      "biz-hypothesis-driven-analysis",
      "biz-executive-comms",
    ],
    dpLocks: ["DP-8", "DP-10"],
    status: "ready - evidence quality tagged",
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

const generatedOutputSections = {
  "Segment decision memo": [
    {
      eyebrow: "TL;DR",
      title: "Tegy Launch has a real wedge, but the launch scope is still wider than the evidence.",
      body:
        "Tegy should ship a PLG-primary strategy-workbench motion for founder-led operators, not a broad AI-consulting platform narrative. The current proof is strongest where users bring messy project context and need a decision-ready output, not where they want generic strategy chat.",
      paragraphs: [
        "The load-bearing question is not whether the product can generate useful strategy work. It can. The question is whether the team can make repeated source-grounded outputs fast enough that the user saves, reopens, and acts on them before the novelty of the chat surface fades.",
        "Recommendation: lock one beachhead, one activation definition, and one launch output sequence before scaling channel or template breadth.",
      ],
      callout: "Status: draft - pending critic pass. Do not treat as locked until DP-7 activation is accepted.",
    },
    {
      eyebrow: "1. Market definition",
      title: "The empty middle is consultant-grade rigor without consultant overhead.",
      body:
        "Hypothesis H1: founders and strategy operators have a persistent gap between generic AI answers and expensive expert work. The gap is real, but Tegy only wins if it operationalizes rigor as a workflow, not as another prompt library.",
      table: [
        ["Option", "Cost", "Rigor", "User effort", "Where Tegy differs"],
        ["Generic AI chat", "$20-200/mo", "Low without strong prompting", "High", "Adds lane routing, source context, and DP memory"],
        ["Consultant/advisor", "$5k-300k+", "High", "Medium", "Compresses first-pass analysis and keeps provenance visible"],
        ["Templates/playbooks", "$0-500", "Medium", "High", "Turns frameworks into generated outputs"],
        ["Tegy target", "$20-200+/mo", "High enough for first decisions", "Medium-low", "Routes project context through StrategyOS lanes"],
      ],
      callout:
        "Verdict on H1: confirmed structurally, but willingness to pay for repeated governed outputs remains unproven.",
    },
    {
      eyebrow: "2. Validation target critique",
      title: "The launch needs an activation metric before it needs more output types.",
      body:
        "The current prototype makes the right objects visible: projects, vault context, outputs, decisions, and API access. The risk is interpreting page visits or chat submissions as validation. For Tegy, activation should require evidence that the output became part of the user's working system.",
      table: [
        ["Metric", "Bad definition", "Better definition", "Reason"],
        ["Activation", "Generated one answer", "Saved or reopened an output", "Separates novelty from value"],
        ["Context quality", "Uploaded a file", "Used source in a generated output", "Measures source-grounded work"],
        ["Decision memory", "Viewed Decision Log", "Locked or reused a DP", "Shows workflow governance"],
        ["Repeat use", "Returned to app", "Opened same project and continued work", "Confirms matter-style persistence"],
      ],
      callout: "DP-7 pending: activation equals saved or reused output, not chat volume.",
    },
    {
      eyebrow: "3. Strategic options",
      title: "Choose a PLG-primary wedge and hold sales-assisted work behind a gate.",
      body:
        "The option set is mutually exclusive at the motion level. Tegy can borrow tactics from sales-assisted work, but it should not split the operating model before the first activation cohort is real.",
      table: [
        ["Option", "Why it could work", "What breaks", "Call"],
        ["PLG primary", "Fastest path to usage proof and self-serve distribution", "Requires crisp first-run value and source-gated examples", "Ship"],
        ["Sales-assisted", "Useful for named strategic accounts", "Pulls founders into custom service too early", "Hold"],
        ["Agency-led outbound", "Can create volume", "Creates false signal before ICP and message lock", "Gate"],
        ["Template marketplace", "Easy to package", "Turns product into static content", "Defer"],
      ],
    },
    {
      eyebrow: "4. Decision Points Index",
      title: "Six locks determine whether downstream work is safe to generate.",
      body:
        "This memo should create explicit decision work, not hide assumptions inside prose.",
      table: [
        ["DP", "Question", "Status", "Owner"],
        ["DP-1", "Which user segment is the first beachhead?", "Default-OK: founder-led operator", "Founder"],
        ["DP-3", "Does ICP stay founder-led until first activation data?", "Locked for Round 1", "Founder"],
        ["DP-7", "What counts as activation?", "Pending lock", "Product"],
        ["DP-9", "Can named-list collateral be generated before founder validation?", "Pending lock", "Founder"],
        ["DP-11", "What upgrade trigger proves willingness to pay?", "Pending lock", "Product"],
        ["DP-12", "Which evidence threshold unlocks broader GTM?", "Pending lock", "Founder"],
      ],
    },
    {
      eyebrow: "5. Bottom line",
      title: "Proceed, but make the launch a learning system rather than a content factory.",
      body:
        "What Tegy has right: project-scoped work, source grounding, generated outputs, and decision memory. What remains fragile: activation definition, pricing proof, and the risk that output breadth substitutes for a sharp workflow.",
      bullets: [
        "Before Round 2: lock activation and project-scope defaults.",
        "Before Round 3: validate the first GTM named list and channel sequence.",
        "Before scaling: prove at least one cohort saves, reopens, and acts on generated outputs.",
      ],
      callout: "Checkpoint required before GTM execution: DP-7 and DP-9.",
    },
  ],
  "Roadmap rationale": [
    {
      eyebrow: "TL;DR",
      title: "The product problem is time-to-decision, not number of features.",
      body:
        "Tegy should prioritize the loop that turns a selected project plus selected sources into a decision-ready output, then preserves that output and its locks. The current roadmap should de-emphasize more templates until activation behavior is observable.",
      paragraphs: [
        "The strongest product thesis is not that users need an AI chat. They need a workbench that remembers the matter, applies the right StrategyOS lane, and leaves behind governed work product.",
      ],
    },
    {
      eyebrow: "1. Product hypothesis",
      title: "The first value moment is a useful output with provenance.",
      body:
        "Hypothesis H1: users will trust Tegy when the answer is not just fluent, but visibly routed, sourced, and ready to become a memo, checklist, scorecard, or decision lock.",
      table: [
        ["Product bet", "User pain solved", "Signal to watch", "Current priority"],
        ["Project-scoped Copilot", "Work resumes inside a matter", "Continued thread in same project", "P0"],
        ["Vault context selection", "Sources travel into output", "Source chip used in run", "P0"],
        ["Generated outputs", "Work product survives chat", "Output opened or exported", "P0"],
        ["Decision Log", "Assumptions do not disappear", "DP locked or reused", "P1"],
        ["More template types", "Broader use cases", "Output volume", "Defer"],
      ],
    },
    {
      eyebrow: "2. Roadmap sequence",
      title: "Build the activation spine before expanding the surface area.",
      body:
        "The next product cycle should be sequenced around one repeatable loop: choose project, choose output, select sources, pick depth, run lane, inspect output, lock decisions.",
      table: [
        ["Sequence", "Capability", "Acceptance test"],
        ["Step 1", "Project and output defaults", "Existing projects auto-select first project; output remains explicit"],
        ["Step 2", "Source selection", "No source is assumed until user selects it"],
        ["Step 3", "Depth and reasoning controls", "User can choose lite, medium, heavy and routing mode"],
        ["Step 4", "Live lane run", "Agent steps stream before final output"],
        ["Step 5", "Output governance", "Open output shows metadata, trace, DP locks, and status"],
      ],
    },
    {
      eyebrow: "3. PRD-ready requirements",
      title: "The product requirements should name the behavioral signal, not the implementation object.",
      body:
        "Do not make backend storage choices inside the UI PRD. A decision could be a tagged message, a derived record, frontmatter, or an output annotation. The product requirement is that the user can see, lock, and reuse it.",
      bullets: [
        "Requirement: every generated output carries project, lane, agent, skills applied, source context, DP locks consumed, and draft/ready status.",
        "Requirement: Copilot defaults to one project when projects exist, but sources remain unselected until the user chooses them.",
        "Requirement: project-scoped Vault and Outputs views preserve the same tab grammar as global views.",
      ],
    },
    {
      eyebrow: "4. Bottom line",
      title: "Ship the loop, then widen the library.",
      body:
        "The roadmap should not chase page count. It should make the core Tegy loop feel reliable enough that the user trusts generated work as a reusable artifact.",
      callout: "Next lock: define the saved-output activation threshold and the first cohort review date.",
    },
  ],
  "GTM launch checklist": [
    {
      eyebrow: "TL;DR",
      title: "Do not launch demand generation until four GTM gates are resolved.",
      body:
        "The GTM lane can run only after product strategy, ICP, context sources, and launch motion are coherent. Current recommendation: ship a controlled founder-led PLG launch, but block scaled outbound until activation, founder-time, interviews, and named-list quality are locked.",
      callout: "Status: draft - revise before ship.",
    },
    {
      eyebrow: "1. GTM spine",
      title: "Wedge -> motion -> channel -> operating rhythm.",
      body:
        "The wedge is founder-led operators with a real decision or work product to create. The motion is PLG primary with founder proof. The first channel is founder network; LinkedIn and communities follow after messaging proof.",
      table: [
        ["Layer", "Current call", "Risk", "Gate"],
        ["Wedge", "Founder-led operators", "Too broad if called all strategy teams", "ICP lock"],
        ["Motion", "PLG primary", "Could become services-led under pressure", "Founder time cap"],
        ["Channel", "Founder network first", "Warm bias can inflate signal", "Cold channel follow-up"],
        ["Message", "Source-grounded strategy outputs", "Sounds like generic AI if not proven", "Output examples"],
        ["Rhythm", "30/60/90 reviews", "Default-continue drift", "Kill criteria"],
      ],
    },
    {
      eyebrow: "2. Launch fixes",
      title: "Four fixes reduce the pre-mortem risk before execution.",
      body:
        "These are not cosmetic. Each fix prevents a common false-positive launch signal.",
      table: [
        ["Fix", "Owner", "When", "Ship impact"],
        ["Activation metric: saved or reopened output", "Product", "Week 0", "Prevents vanity usage"],
        ["Founder time cap: 12-15 hrs/week", "Founder", "Week 0", "Keeps channel plan realistic"],
        ["5-10 ICP interviews", "Founder", "Weeks 1-2", "Validates segment language"],
        ["ABM list gate", "Founder", "Week 0", "Blocks premature per-target assets"],
      ],
    },
    {
      eyebrow: "3. First 30 days",
      title: "The launch should test conversion-rate viability, not revenue scale.",
      body:
        "The first 30 days measure whether the target user can reach a source-grounded output and find it useful enough to save or continue. Revenue is a later signal because the project loop must work before packaging can be trusted.",
      bullets: [
        "Day 0: publish real output examples and route every prompt through a visible lane.",
        "Day 7: review source selection and first output completion.",
        "Day 14: inspect saved-output and reopened-output behavior.",
        "Day 30: decide whether to keep, narrow, or re-cut the wedge.",
      ],
    },
    {
      eyebrow: "4. DP index",
      title: "Open decisions that block scaled GTM.",
      table: [
        ["DP", "Question", "Status", "Default"],
        ["DP-2", "Which output proves activation first?", "Pending", "Segment decision memo"],
        ["DP-9", "Can named ABM assets be generated now?", "Pending", "No"],
        ["DP-12", "What evidence threshold unlocks LinkedIn/community scale?", "Pending", "Saved output + interview signal"],
        ["DP-15", "Which pricing trigger appears in launch copy?", "Default-OK", "Output saved"],
      ],
      callout: "Checkpoint required before generating per-channel assets.",
    },
  ],
  "Pricing and packaging memo": [
    {
      eyebrow: "TL;DR",
      title: "Price the repeated workbench value, not the chat surface.",
      body:
        "Tegy should avoid pricing around raw prompts, pages, or model usage in v1 messaging. The buyer understands the value when pricing maps to projects, source-grounded outputs, and repeat decision work.",
    },
    {
      eyebrow: "1. Packaging hypothesis",
      title: "The first package should be simple enough to test willingness to pay.",
      table: [
        ["Package", "Buyer job", "Included", "Risk"],
        ["Free teaser", "Try a real lane", "One project, one generated output", "Can attract low-intent users"],
        ["Pro", "Run repeated strategy work", "Projects, vault, outputs, decisions", "Needs clear usage limits"],
        ["Team", "Coordinate work across matters", "Shared vault and project history", "May imply enterprise features early"],
        ["API", "Use Tegy from local agents", "Key plus commands", "Needs governance and audit story"],
      ],
    },
    {
      eyebrow: "2. Value capture",
      title: "The upgrade trigger should be tied to output reuse.",
      body:
        "A user who saves, reopens, or exports an output is closer to willingness to pay than a user who simply submits many prompts. The packaging should make the repeated project loop visible.",
      bullets: [
        "Upgrade after a saved output, not after a token threshold alone.",
        "Explain limits as project and output limits, not provider-cost mechanics.",
        "Keep the API package separate from web-app pricing until usage patterns are known.",
      ],
    },
    {
      eyebrow: "3. DP index",
      title: "Pricing cannot be locked until the activation trigger is locked.",
      table: [
        ["DP", "Question", "Status"],
        ["DP-11", "What action earns the upgrade prompt?", "Pending lock"],
        ["DP-14", "Which limits are user-facing?", "Pending lock"],
        ["DP-15", "Is API usage bundled or separate?", "Default-OK: separate"],
      ],
      callout: "Verdict: draft until upgrade-trigger policy is confirmed.",
    },
  ],
  "Board memo": [
    {
      eyebrow: "TL;DR",
      title: "Approve a 90-day learning launch with explicit gates.",
      body:
        "The board decision is not to approve every possible output or channel. It is to approve a disciplined learning system that tests whether source-grounded strategy outputs become repeatable user work product.",
    },
    {
      eyebrow: "1. Decision ask",
      title: "Approve the launch only if the gates are visible.",
      table: [
        ["Gate", "Decision required", "Timing", "If failed"],
        ["Activation", "Saved or reused output threshold", "Day 30", "Revise product workflow"],
        ["ICP", "Founder-led operator remains the first wedge", "Day 30", "Re-cut segment"],
        ["GTM", "Named list and channel evidence", "Day 60", "Stop scaled assets"],
        ["Resourcing", "Founder time cap realistic", "Week 4", "Descope channels"],
      ],
    },
    {
      eyebrow: "2. Risks",
      title: "The main risks are sequence risks, not existential strategy risks.",
      bullets: [
        "Output breadth can hide weak activation if every new request generates a new artifact type.",
        "Founder network can overstate market pull if cold channels lag.",
        "Decision Log can become passive storage unless locks influence future runs.",
      ],
    },
    {
      eyebrow: "3. Recommendation",
      title: "Ship the learning system, not a polished campaign.",
      body:
        "Proceed with a controlled launch that makes provenance, DP locks, and revisit triggers visible in every generated output.",
      callout: "Board approval requested: 90-day launch with Day 30 and Day 60 gates.",
    },
  ],
  "Investment thesis memo": [
    {
      eyebrow: "TL;DR",
      title: "Invest only where the target tightens the strategic motion.",
      body:
        "The thesis should not chase adjacent market breadth. A target is attractive only if it improves the locked wedge, accelerates distribution, or closes a capability gap without forcing a new operating model.",
    },
    {
      eyebrow: "1. Thesis",
      title: "The investment case depends on a capability gap, not category excitement.",
      table: [
        ["Thesis pillar", "Current read", "Evidence", "Confidence"],
        ["Market timing", "AI work needs governance and context memory", "Market notes + usage pattern", "Medium"],
        ["Right to win", "StrategyOS lanes and DP discipline differentiate output quality", "Repo + generated examples", "Medium"],
        ["Target logic", "Acquire capability that improves workflow or distribution", "Target universe map", "Medium-low"],
        ["Diligence gap", "Retention and integration evidence thin", "Scorecard + source notes", "Low"],
      ],
    },
    {
      eyebrow: "2. IC questions",
      title: "The bear case should be visible before the memo reaches ready status.",
      bullets: [
        "If repeat output use is weak, the thesis becomes service-heavy.",
        "If target evidence is not comparable, the scorecard implies false precision.",
        "If the wedge changes after acquisition, integration energy will dilute the core launch.",
      ],
    },
    {
      eyebrow: "3. Decision Points Index",
      title: "Diligence cannot advance without these locks.",
      table: [
        ["DP", "Question", "Status", "Owner"],
        ["DP-5", "Which capability gap is acquisition meant to close?", "Pending", "Founder"],
        ["DP-8", "What minimum score allows outreach?", "Locked for current screen", "M&A lane"],
        ["DP-13", "Is distribution or workflow capability more valuable?", "Pending", "Founder"],
      ],
    },
    {
      eyebrow: "4. Bottom line",
      title: "Advance only targets that improve the locked motion.",
      body:
        "A target can be strategically interesting and still be a bad acquisition candidate. The memo should remain draft until the target-fit scorecard and Decision Log agree on pursue/pass thresholds.",
      callout: "Verdict: draft - diligence gaps open.",
    },
  ],
  "Investor FAQ": [
    {
      eyebrow: "TL;DR",
      title: "Answer with evidence labels, not confidence theater.",
      body:
        "The FAQ should separate what is observed, what is believed, and what is currently being tested. This makes the investor conversation sharper and prevents the narrative from overstating validation.",
    },
    {
      eyebrow: "1. Likely objections",
      title: "Most investor questions reduce to repeat use, defensibility, and GTM focus.",
      table: [
        ["Objection", "Short answer", "Evidence needed"],
        ["Is this just AI chat?", "No. It is project-scoped lane routing with governed outputs.", "Output reuse and DP locks"],
        ["Where is the moat?", "Workflow rigor, source memory, and decision accumulation.", "Repeated project behavior"],
        ["Who buys first?", "Founder-led operators with real strategic work.", "First cohort conversion"],
        ["Why now?", "Generic AI created more output, but less governance.", "Interview evidence"],
      ],
    },
    {
      eyebrow: "2. Answer discipline",
      title: "Use three evidence labels in every answer.",
      bullets: [
        "Observed: actual product behavior, source reuse, saved outputs, locked decisions.",
        "Believed: market claims inferred from founder pattern matching or comparable products.",
        "Testing: pricing, cold-channel response, and repeat-use thresholds.",
      ],
    },
    {
      eyebrow: "3. Follow-up loop",
      title: "Each unanswered objection should become a source request or decision lock.",
      body:
        "The FAQ should not become a static answer bank. Every hard question either strengthens a source, opens a DP, or creates a revised output.",
      callout: "Next lock: choose the three objections that must be proven before the next investor meeting.",
    },
  ],
  "Investor memo": [
    {
      eyebrow: "TL;DR",
      title: "Lead with the strategic decision, then show what is known versus still assumed.",
      body:
        "The investor memo should package the business-strategy output without pretending every open decision is closed. The goal is a credible narrative that makes the proof stack, risks, and next validation work inspectable.",
    },
    {
      eyebrow: "1. Narrative spine",
      title: "The memo should move from problem clarity to proof to use of capital.",
      table: [
        ["Block", "Job", "Evidence state", "Owner"],
        ["Market timing", "Explain why now", "Medium", "Founder"],
        ["Right to win", "Explain why Tegy", "Medium", "Founder"],
        ["Proof stack", "Show usage and output quality", "Medium-low", "Product/GTM"],
        ["Risks", "Name what could fail", "High clarity", "Founder"],
        ["Use of capital", "Show what changes with funding", "Draft", "Founder"],
      ],
    },
    {
      eyebrow: "2. Evidence labels",
      title: "Separate observed, believed, and testing claims.",
      bullets: [
        "Observed: source-grounded outputs, open artifact page, project-scoped context, and DP visibility.",
        "Believed: founder-led operators will pay for repeated governed strategy work.",
        "Testing: activation threshold, upgrade trigger, and cold-channel response.",
      ],
    },
    {
      eyebrow: "3. Bottom line",
      title: "Use one shared spine across memo, deck, FAQ, and board discussion.",
      body:
        "The investor memo should not drift from the board memo or FAQ. Every claim should point back to sources, locked decisions, or explicit open DPs.",
      callout: "Verdict: draft until DP-6 and DP-15 are resolved.",
    },
  ],
  "Target-fit memo": [
    {
      eyebrow: "TL;DR",
      title: "Pursue the target only if it closes the capability gap without changing the strategy.",
      body:
        "The target-fit lane should keep the acquisition question subordinate to the strategic matter. A target wins by tightening the chosen motion, not by being interesting on its own.",
    },
    {
      eyebrow: "1. Fit criteria",
      title: "Rank targets by strategic fit first, integration ease second.",
      table: [
        ["Target archetype", "Strategic fit", "Integration risk", "Call"],
        ["Workflow data layer", "High", "Medium", "Advance"],
        ["Vertical research library", "Medium", "Low-medium", "Hold"],
        ["Agency services shop", "Low-medium", "High", "Pass"],
        ["Template marketplace", "Low", "Low", "Pass"],
      ],
    },
    {
      eyebrow: "2. Diligence locks",
      title: "Do not move to outreach until three locks are clear.",
      bullets: [
        "DP-8: target must map to a specific capability gap.",
        "DP-10: integration risk must be visible in the scorecard.",
        "DP-12: pursue/pass threshold must be agreed before reviewing more targets.",
      ],
    },
    {
      eyebrow: "3. Recommendation",
      title: "Convert narrative fit into a comparable screen.",
      body:
        "The next useful output is not a longer memo. It is a scorecard with weighted criteria, source confidence, and a recommendation owner.",
      callout: "Verdict: ready if the scorecard confirms capability, timing, and integration fit.",
    },
  ],
  "Screening scorecard": [
    {
      eyebrow: "TL;DR",
      title: "The scorecard should explain what to learn next.",
      body:
        "A high score creates a diligence question, not an automatic acquisition recommendation. A pass should name which strategic assumption failed.",
    },
    {
      eyebrow: "1. Comparable screen",
      title: "Weighted criteria expose fit, risk, and evidence quality.",
      table: [
        ["Target", "Fit", "Evidence quality", "Main risk", "Call"],
        ["Workflow data layer", "High", "Medium", "Integration complexity", "Advance"],
        ["Vertical research library", "Medium", "Medium-low", "Weak defensibility", "Hold"],
        ["Services-enabled agency", "Low-medium", "Low", "Services drag", "Pass"],
        ["Template marketplace", "Low", "Medium", "No durable advantage", "Pass"],
      ],
    },
    {
      eyebrow: "2. DP index",
      title: "Scoring only matters if the threshold is locked.",
      table: [
        ["DP", "Question", "Status"],
        ["DP-8", "Minimum score for outreach", "Locked"],
        ["DP-10", "Integration-risk threshold", "Locked"],
        ["DP-12", "Who can override the score?", "Pending"],
      ],
      callout: "Next lock: agree who can override a low score and why.",
    },
  ],
};

Object.assign(artifactSections, generatedOutputSections);

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
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function setProjectDetailMode(open) {
  const projectsPage = document.querySelector("#projectsPage");
  if (!projectsPage) return;
  projectsPage.classList.toggle("projects-detail-mode", open);
}

function openProjectScopedPage(page) {
  const selectedProject = document.querySelector("#projectDetailTitle")?.textContent.trim();
  if (projectSummaries[selectedProject]) {
    selectProject(selectedProject, { scopeAssistant: page === "assistant" });
  }

  if (page === "assistant") {
    state.assistantProject = state.activeProject;
    renderAssistantScope();
  }

  if (page === "vault") {
    state.vaultScope = "project";
    renderVaultRows();
  }

  if (page === "artifacts") {
    state.artifactScope = "project";
    state.artifactType = "all";
    state.artifactPage = 1;
    renderArtifacts();
  }

  setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
  setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
  setPage(page);
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

  if (open && menu.parentElement?.classList.contains("project-picker")) {
    const parentRect = menu.parentElement.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    menu.style.left = `${Math.max(0, triggerRect.left - parentRect.left)}px`;
    menu.style.right = "auto";
    menu.style.minWidth = `${Math.max(220, triggerRect.width)}px`;
  }

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
  document.querySelector(".scope-strip")?.classList.toggle("has-output", Boolean(state.assistantOutput));

  document.querySelector("#activeProjectScope").textContent = projectName || "No project selected";
  const projectTabLabel = document.querySelector("#assistantProjectTabLabel");
  if (projectTabLabel) projectTabLabel.textContent = projectName || "No project";
  document.querySelector("#activeOutputScope").textContent = state.assistantOutput || "No output selected";
  document.querySelector("#projectVaultChip").textContent = projectName ? `${projectName} Sources` : "Project Sources";
  document.querySelector("#priorProjectChip").textContent = project?.priorProject || "Prior Project";
  renderAssistantProjectMenu();
  const input = document.querySelector("#promptInput");
  if (input) {
    input.placeholder = getPromptPlaceholder();
  }
  updateContextSourceAvailability();
  updateActiveContextScope();
  renderRoutingLock();
}

function renderAssistantProjectMenu() {
  const projectMenu = document.querySelector("#assistantProjectMenu");
  if (!projectMenu) return;

  projectMenu.innerHTML = `
    <label class="assistant-project-search">
      <i data-lucide="search"></i>
      <input type="search" placeholder="Search projects" aria-label="Search projects" data-project-search />
    </label>
    <div class="assistant-project-list">
      ${Object.keys(projectSummaries)
    .map(
      (project) => `
        <button class="${state.assistantProject === project ? "active" : ""}" type="button" data-assistant-project="${escapeHtml(project)}">
          <i data-lucide="folder-git-2"></i>
          <span>${escapeHtml(project)}</span>
        </button>
      `,
    )
    .join("")}
    </div>
    <button class="assistant-project-add" type="button" data-assistant-project-add>
      <i data-lucide="folder-plus"></i>
      <span>Add new project</span>
      <i data-lucide="chevron-right"></i>
    </button>
  `;

  const search = projectMenu.querySelector("[data-project-search]");
  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    projectMenu.querySelectorAll("[data-assistant-project]").forEach((button) => {
      button.hidden = !button.textContent.toLowerCase().includes(query);
    });
  });

  projectMenu.querySelectorAll("[data-assistant-project]").forEach((button) => {
    button.addEventListener("click", () => {
      setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", false);
      selectProject(button.dataset.assistantProject, { scopeAssistant: true });
    });
  });

  projectMenu.querySelector("[data-assistant-project-add]")?.addEventListener("click", () => {
    setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", false);
    setPage("projects");
  });

  syncIcons();
}

function renderVaultRows() {
  const isProjectScope = state.vaultScope === "project";
  const rows = isProjectScope ? projectVaultSources[state.activeProject] : globalVaultSources;
  const subtitle = isProjectScope ? `${state.activeProject} sources` : "Global sources";
  const description = isProjectScope
    ? `Sources Tegy can cite for ${state.activeProject}`
    : "Reusable context Tegy can cite";

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
    ? `${escapeHtml(state.activeProject)} sources are available as evidence for Copilot runs.`
    : "Global sources are reusable evidence across projects.";
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

function getArtifactFrontmatterRows(title, project, detail) {
  const generated = artifactGenerationMeta[title] || {};
  const skills = generated.skills || [
    "biz-mece-structure",
    "biz-hypothesis-driven-analysis",
    "biz-executive-comms",
  ];
  const dpLocks =
    generated.dpLocks ||
    detail.meta.decisions
      .split(",")
      .map((decision) => decision.trim())
      .filter(Boolean);

  return [
    ["artifact", generated.artifact || slugify(title)],
    ["project", slugify(project)],
    ["round", generated.round || "1"],
    ["agent", generated.agent || "auto-router"],
    ["date", "2026-06-05"],
    ["always_on_skills_applied", `[${skills.join(", ")}]`],
    ["dp_locks_consumed", `[${dpLocks.join(", ")}]`],
    ["status", generated.status || detail.meta.status.toLowerCase()],
  ];
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
  const bodyParts = [section.body, ...(section.paragraphs || [])].filter(Boolean);
  const body = bodyParts
    .map((paragraph) => `<p class="artifact-section-body">${escapeHtml(paragraph)}</p>`)
    .join("");
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
  document.querySelector("#artifactDetailSections").innerHTML =
    detail.sections.map((section) => renderArtifactSection(section)).join("");
}

function openArtifact(title, project, fallbackNote = "") {
  renderArtifactDetail(title, project, fallbackNote);
  setPage("artifact-detail");
  syncIcons();
}

function getArtifactMarkdown(title, project) {
  const resolvedProject = getArtifactProject(title, project);
  const detail = getArtifactDetail(title, resolvedProject);
  const metaLines = getArtifactFrontmatterRows(title, resolvedProject, detail)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
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
  if (section.paragraphs) parts.push(section.paragraphs.join("\n\n"));
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
  const pagination = document.querySelector("#artifactPagination");
  if (!grid || !typeFilters) return;
  const totalPages = Math.max(1, Math.ceil(rows.length / artifactPageSize));
  state.artifactPage = Math.min(Math.max(state.artifactPage, 1), totalPages);
  const pageStart = (state.artifactPage - 1) * artifactPageSize;
  const visibleRows = rows.slice(pageStart, pageStart + artifactPageSize);
  const hasSelectedVisible = visibleRows.some(
    (row) => row.title === state.selectedArtifactTitle && row.project === state.selectedArtifactProject,
  );
  const selectedRow = hasSelectedVisible ? null : visibleRows[0];
  const isSelectedRow = (row) =>
    selectedRow
      ? selectedRow.title === row.title && selectedRow.project === row.project
      : state.selectedArtifactTitle === row.title && state.selectedArtifactProject === row.project;

  document.querySelector("#artifactSubtitle").textContent =
    state.artifactScope === "project"
      ? `${state.activeProject} outputs`
      : "Generated outputs";
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
        state.artifactPage = 1;
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

  grid.innerHTML = visibleRows
    .map(
      ({ project, title, type, note }) => `
        <button class="artifact-card output-row ${isSelectedRow({ project, title }) ? "selected" : ""}" data-artifact="${escapeHtml(title)}" data-project="${escapeHtml(project)}" data-note="${escapeHtml(note)}">
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(artifactDescriptions[title] || note)}</small>
          <span>${escapeHtml(project)}</span>
          <em>${escapeHtml(artifactMeta[title]?.status || "Draft")}</em>
          <time datetime="2026-06-05">Jun 5</time>
        </button>
      `,
    )
    .join("");

  if (pagination) {
    pagination.innerHTML =
      totalPages > 1
        ? `
          <button class="pager-button" type="button" data-artifact-page="prev" ${state.artifactPage === 1 ? "disabled" : ""} aria-label="Previous artifact page">
            <i data-lucide="chevron-left"></i>
          </button>
          <span>Page ${state.artifactPage} of ${totalPages}</span>
          <button class="pager-button" type="button" data-artifact-page="next" ${state.artifactPage === totalPages ? "disabled" : ""} aria-label="Next artifact page">
            <i data-lucide="chevron-right"></i>
          </button>
        `
        : "";
  }

  grid.querySelectorAll("[data-artifact]").forEach((card) => {
    card.addEventListener("click", () => {
      grid.querySelectorAll("[data-artifact]").forEach((item) => item.classList.remove("selected"));
      card.classList.add("selected");
      const artifact = card.dataset.artifact;
      state.selectedArtifactProject = card.dataset.project;
      updateArtifactPreview(artifact, card.dataset.note || card.querySelector("small").textContent);
      openArtifact(artifact, card.dataset.project, card.dataset.note || card.querySelector("small").textContent);
    });
  });

  const selected = grid.querySelector(".artifact-card.selected") || grid.querySelector("[data-artifact]");
  if (selected) {
    state.selectedArtifactProject = selected.dataset.project;
    updateArtifactPreview(selected.dataset.artifact, selected.querySelector("small").textContent);
  }

  typeFilters.querySelectorAll("[data-artifact-type]").forEach((button) => {
    button.addEventListener("click", () => {
      state.artifactType = button.dataset.artifactType;
      state.artifactPage = 1;
      renderArtifacts();
    });
  });

  pagination?.querySelectorAll("[data-artifact-page]").forEach((button) => {
    button.addEventListener("click", () => {
      state.artifactPage += button.dataset.artifactPage === "next" ? 1 : -1;
      renderArtifacts();
    });
  });

  syncIcons();
}

function setLanePicker(open) {
  const picker = document.querySelector("#lanePicker");
  if (!picker) return;
  picker.hidden = !open;
}

function setSettingPicker(kind, open) {
  const depthPicker = document.querySelector("#depthPicker");
  const reasoningPicker = document.querySelector("#reasoningPicker");
  const depthToggle = document.querySelector("#depthToggle");
  const reasoningToggle = document.querySelector("#reasoningToggle");
  const activePicker = kind === "reasoning" ? reasoningPicker : depthPicker;
  const activeToggle = kind === "reasoning" ? reasoningToggle : depthToggle;

  if (depthPicker && activePicker !== depthPicker) depthPicker.hidden = true;
  if (reasoningPicker && activePicker !== reasoningPicker) reasoningPicker.hidden = true;
  if (depthToggle && activeToggle !== depthToggle) depthToggle.setAttribute("aria-expanded", "false");
  if (reasoningToggle && activeToggle !== reasoningToggle) reasoningToggle.setAttribute("aria-expanded", "false");
  if (!activePicker || !activeToggle) return;

  if (open) setLanePicker(false);
  activePicker.hidden = !open;
  activeToggle.setAttribute("aria-expanded", open ? "true" : "false");
}

function renderAssistantSettings() {
  const depthLabel = document.querySelector("#depthButtonLabel");
  const reasoningLabel = document.querySelector("#reasoningButtonLabel");
  if (depthLabel) depthLabel.textContent = `Depth: ${state.assistantDepth}`;
  if (reasoningLabel) reasoningLabel.textContent = `Reasoning: ${state.assistantReasoning}`;

  document.querySelectorAll("[data-depth]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.depth === state.assistantDepth);
  });

  document.querySelectorAll("[data-reasoning]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.reasoning === state.assistantReasoning);
  });
}

function getManualLaneRoute(choice) {
  if (!choice || choice === "auto") return null;
  if (choice === "all-three") {
    return {
      lane: "Strategy Waterfall",
      agent: "Strategy orchestrator",
      output: state.assistantOutput || "Strategy synthesis memo",
      logic: "Business Strategy -> Product Management -> GTM Strategy",
      template: "Business Strategy",
      keywords: [],
    };
  }

  return routingLanes.find((route) => route.lane === choice || route.template === choice) || null;
}

function getRoutingChoiceLabel(choice = state.assistantLaneChoice) {
  if (choice === "auto") return "Auto router";
  if (choice === "all-three") return "Full waterfall";
  return choice;
}

function buildRoutingBrief(prompt, laneChoice = state.assistantLaneChoice) {
  const route = routePrompt(prompt, laneChoice);
  const project = state.assistantProject || "the selected project";
  const output = state.assistantOutput || route.output;
  const cleanPrompt = prompt.replace(/\s+/g, " ").trim();
  const shortPrompt = (cleanPrompt.length > 130 ? `${cleanPrompt.slice(0, 130)}...` : cleanPrompt).replace(/[.!?]+$/, "");
  const routingPhrase =
    laneChoice === "auto"
      ? `suggests ${route.lane}`
      : `will use ${getRoutingChoiceLabel(laneChoice)}`;
  return `Tegy reads this as: ${shortPrompt}. It will work in ${project}, ${routingPhrase}, and produce a ${output.toLowerCase()} unless a decision point needs to be locked first.`;
}

function renderRoutingLock() {
  const card = document.querySelector("#routingLockCard");
  if (card) card.hidden = true;
}

function resetRoutingLock() {
  state.assistantChoicesLocked = false;
  renderRoutingLock();
}

function lockRoutingChoices() {
  state.assistantChoicesLocked = true;
  renderRoutingLock();
}

function selectOutput(output) {
  state.assistantOutput = output;
  document.querySelectorAll("#lanePicker [data-output]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.output === output);
  });
  renderAssistantScope();
  resetRoutingLock();
  setLanePicker(false);
}

function sendPromptToAssistant(prompt) {
  setPage("assistant");
  setLanePicker(false);
  const input = document.querySelector("#promptInput");
  addResponse(prompt);
  if (input) {
    input.value = "";
    resizePromptInput();
  }
}

function getProjectDefaultRoute() {
  const summary = state.assistantProject ? projectSummaries[state.assistantProject] : null;
  if (!summary) return routingLanes.at(-1);
  const lane = routingLanes.find((item) => item.output === summary.lane || summary.lane.includes(item.output));
  return lane || routingLanes.at(-1);
}

function getPromptIntentRoute(normalizedPrompt) {
  const intentRules = [
    {
      phrases: ["business strategy memo", "strategy memo", "decision memo", "strategic decision", "market strategy"],
      match: (route) => route.lane === "Business Strategy" && route.output === "Segment decision memo",
    },
    {
      phrases: ["product strategy", "roadmap rationale", "roadmap", "prd", "product memo"],
      match: (route) => route.lane === "Product Management",
    },
    {
      phrases: ["gtm", "go-to-market", "launch checklist", "channel plan", "demand plan"],
      match: (route) => route.lane === "GTM Strategy",
    },
    {
      phrases: ["investor memo", "investment thesis", "ic memo", "board memo"],
      match: (route) => route.template === "Investor Narrative",
    },
    {
      phrases: ["target fit", "target-fit", "screening scorecard", "acquisition screen", "m&a"],
      match: (route) => route.lane === "M&A Target Fit",
    },
  ];

  const rule = intentRules.find(({ phrases }) =>
    phrases.some((phrase) => normalizedPrompt.includes(phrase)),
  );
  return rule ? routingLanes.find(rule.match) : null;
}

function routePrompt(prompt, laneChoice = state.assistantLaneChoice) {
  const normalized = prompt.toLowerCase();
  const manualRoute = getManualLaneRoute(laneChoice);
  if (manualRoute) return manualRoute;

  const selectedOutputRoute = state.assistantOutput
    ? routingLanes.find((lane) => lane.output === state.assistantOutput)
    : null;
  const intentRoute = getPromptIntentRoute(normalized);

  return (
    selectedOutputRoute ||
    intentRoute ||
    routingLanes.find((lane) => lane.keywords.some((keyword) => normalized.includes(keyword))) ||
    getProjectDefaultRoute()
  );
}

function getLaneRun(route) {
  return laneRunTemplates[route.template || route.lane] || laneRunTemplates["Business Strategy"];
}

function getRoutingPreludeOptions() {
  return [
    ["auto", "Auto router", "Let Tegy choose the best lane and agent from the request."],
    ["Business Strategy", "Business strategy", "Market, positioning, tradeoffs, decision memo."],
    ["Product Management", "Product", "Segmentation, roadmap, PRD, pricing shape."],
    ["GTM Strategy", "GTM", "Wedge, motion, funnel, channels, launch plan."],
    ["M&A Target Fit", "M&A fit", "Thesis, target screen, diligence gaps."],
    ["all-three", "Full waterfall", "Business -> Product -> GTM with checkpoints."],
  ];
}

function getRoutingPreludeState(card) {
  const laneChoice = card.dataset.laneChoice || "auto";
  return {
    laneChoice,
    depth: state.assistantDepth,
    reasoning: card.dataset.reasoning || state.assistantReasoning,
    prompt: card.dataset.prompt || "",
  };
}

function getContextCountLabel() {
  const contexts = getActiveContexts();
  return contexts.length ? `${contexts.length} selected` : state.assistantProject ? "Project context" : "No sources selected";
}

function renderRoutingPrelude(prompt) {
  const route = routePrompt(prompt, state.assistantLaneChoice);
  const projectText = state.assistantProject || "No project selected";
  const outputText = state.assistantOutput || route.output;
  return `
    <div class="routing-run-header">
      <div>
        <p class="eyebrow">Tegy can run this</p>
        <h2 data-routing-title>${escapeHtml(route.lane)} -> ${escapeHtml(outputText)}</h2>
      </div>
      <span data-routing-status>${state.assistantLaneChoice === "auto" ? "Suggested route" : "Manual lane"}</span>
    </div>
    <div class="routing-run-brief">
      <span>So what</span>
      <p data-routing-brief>${escapeHtml(buildRoutingBrief(prompt, state.assistantLaneChoice))}</p>
    </div>
    <div class="routing-run-summary" aria-label="Selected routing scope">
      <span><i data-lucide="folder-check"></i>${escapeHtml(projectText)}</span>
      <span><i data-lucide="file-output"></i>${escapeHtml(outputText)}</span>
      <span><i data-lucide="database"></i>${escapeHtml(getContextCountLabel())}</span>
    </div>
    <div class="routing-option-grid" aria-label="Choose Tegy lane">
      ${getRoutingPreludeOptions()
        .map(
          ([choice, label, description]) => `
            <button class="${state.assistantLaneChoice === choice ? "selected" : ""}" type="button" data-routing-choice="${escapeHtml(choice)}">
              <span class="routing-option-dot" aria-hidden="true"></span>
              <strong>${escapeHtml(label)}</strong>
              <small>${escapeHtml(description)}</small>
            </button>
          `,
        )
        .join("")}
    </div>
    <div class="routing-run-actions">
      <button class="primary-button" type="button" data-routing-action="run"><i data-lucide="play"></i> Start analysis</button>
    </div>
  `;
}

function updateRoutingPrelude(card) {
  const { prompt, laneChoice } = getRoutingPreludeState(card);
  const route = routePrompt(prompt, laneChoice);
  const status = card.querySelector("[data-routing-status]");
  const title = card.querySelector("[data-routing-title]");
  const brief = card.querySelector("[data-routing-brief]");
  const summary = card.querySelector(".routing-run-summary");
  const outputText = state.assistantOutput || route.output;
  if (status) status.textContent = laneChoice === "auto" ? "Suggested route" : "Manual lane";
  if (title) title.textContent = `${route.lane} -> ${outputText}`;
  if (brief) brief.textContent = buildRoutingBrief(prompt, laneChoice);
  if (summary) {
    summary.innerHTML = `
      <span><i data-lucide="folder-check"></i>${escapeHtml(state.assistantProject || "No project selected")}</span>
      <span><i data-lucide="file-output"></i>${escapeHtml(outputText)}</span>
      <span><i data-lucide="database"></i>${escapeHtml(getContextCountLabel())}</span>
    `;
  }

  card.querySelectorAll("[data-routing-choice]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.routingChoice === laneChoice);
  });
  card.querySelectorAll("[data-routing-reasoning]").forEach((button) => {
    button.classList.toggle("selected", button.dataset.routingReasoning === card.dataset.reasoning);
  });
  syncIcons();
}

function createRoutingPreludeCard(prompt) {
  const card = document.createElement("article");
  card.className = "response-card routing-run-card";
  card.dataset.prompt = prompt;
  card.dataset.laneChoice = state.assistantLaneChoice;
  card.dataset.reasoning = state.assistantReasoning;
  card.innerHTML = renderRoutingPrelude(prompt);
  updateRoutingPrelude(card);
  return card;
}

function setRoutingPreludeChoice(button) {
  const card = button.closest(".routing-run-card");
  if (!card || card.classList.contains("locked")) return;
  if (button.dataset.routingChoice) card.dataset.laneChoice = button.dataset.routingChoice;
  if (button.dataset.routingReasoning) card.dataset.reasoning = button.dataset.routingReasoning;
  updateRoutingPrelude(card);
}

function completeRoutingPrelude(card, shouldRun = true) {
  if (card.classList.contains("locked")) return;
  const { prompt, laneChoice, depth, reasoning } = getRoutingPreludeState(card);
  state.assistantLaneChoice = laneChoice;
  state.assistantDepth = depth;
  state.assistantReasoning = reasoning;
  state.assistantChoicesLocked = true;
  renderAssistantSettings();
  card.classList.add("locked");
  card.querySelectorAll("button").forEach((button) => {
    if (!button.dataset.routingAction) button.disabled = true;
  });
  const actions = card.querySelector(".routing-run-actions");
  if (actions) actions.innerHTML = `<span class="routing-run-locked"><i data-lucide="play"></i> Analysis started</span>`;
  const status = card.querySelector("[data-routing-status]");
  if (status) status.textContent = `Running`;
  syncIcons();
  if (shouldRun) appendAgentResponse(prompt, { laneChoice, depth, reasoning }, card);
}

function getDecisionCheckpoint(route) {
  if (route.template === "Investor Narrative") {
    return {
      label: "DP Lock - Investor package",
      steps: [
        {
          title: "Investor narrative surfaced 3 claims that need owner confidence before packaging.",
          body:
            "Tegy is pausing before the memo becomes investor-facing so proof, caveats, and audience can be locked.",
          options: [
            ["Lock for board alignment", "Keep this as an internal decision memo before external outreach."],
            ["Lock for investor outreach", "Package claims, objections, and use-of-capital for external review."],
            ["Proceed with caveats", "Mark unsupported claims as assumptions in the output."],
          ],
        },
        {
          title: "Which proof gap should the investor memo treat as load-bearing?",
          body:
            "This answer changes the objection handling and the next evidence request.",
          options: [
            ["Market timing", "Why now, category pull, and budget urgency."],
            ["Repeat use", "Evidence that the workflow persists after novelty."],
            ["Right to win", "Team, distribution, or wedge advantage."],
          ],
        },
      ],
    };
  }

  if (route.lane === "Product Management") {
    return {
      label: "DP Lock - Product round",
      steps: [
        {
          title: "Product round surfaced activation and roadmap locks before PRD work continues.",
          body:
            "Tegy needs the product decision path to be explicit before it generates implementation-facing output.",
          options: [
            ["Lock activation metric", "Use saved/reused output as the primary activation signal."],
            ["Proceed with defaults", "Keep activation and pricing assumptions flagged as unvalidated."],
            ["Stop after product rationale", "Do not continue into PRD or GTM packaging yet."],
          ],
        },
        {
          title: "Which product choice should downstream work inherit?",
          body:
            "This determines whether the next output optimizes onboarding, pricing, or roadmap sequencing.",
          options: [
            ["Onboarding first", "Reduce time-to-first-value before adding feature breadth."],
            ["Pricing first", "Resolve plan shape and willingness-to-pay before roadmap expansion."],
            ["Roadmap freeze", "Freeze new bets until the current workflow proves retention."],
          ],
        },
      ],
    };
  }

  if (route.lane === "GTM Strategy") {
    return {
      label: "DP Lock - GTM round",
      steps: [
        {
          title: "GTM round surfaced channel, ICP, and named-list gates before execution assets.",
          body:
            "Tegy is pausing because GTM outputs should not ship until the motion assumptions are explicit.",
          options: [
            ["Lock the named list", "Founder validates the first target set before per-account assets."],
            ["Proceed with defaults", "Run the checklist with named-list and channel caveats visible."],
            ["Stop after checklist", "Keep this as a planning output before execution collateral."],
          ],
        },
        {
          title: "Which GTM assumption most changes the launch plan?",
          body:
            "This answer changes the motion, channel sequencing, and launch operating rhythm.",
          options: [
            ["Paid funnel data exists", "Use measured conversion and CAC inputs."],
            ["Founder-led proof first", "Use founder network and interviews before paid scale."],
            ["Agency can execute", "Assume external GTM capacity is available after brief lock."],
          ],
        },
      ],
    };
  }

  if (route.lane === "M&A Target Fit") {
    return {
      label: "DP Lock - Target-fit round",
      steps: [
        {
          title: "Target-fit work surfaced pursue/pass locks before diligence continues.",
          body:
            "Tegy is pausing so target interest does not outrun the strategic thesis.",
          options: [
            ["Lock pursue threshold", "Only targets above the fit and evidence threshold move forward."],
            ["Proceed with diligence caveats", "Keep gaps open and mark confidence by source quality."],
            ["Stop after screen", "Use the screen as the deliverable before more diligence."],
          ],
        },
        {
          title: "Which target-fit criterion should dominate the recommendation?",
          body:
            "This answer changes how Tegy weighs attractive targets against the strategic matter.",
          options: [
            ["Capability gap", "Prioritize targets that close the declared capability gap."],
            ["Market adjacency", "Prioritize targets that expand the current market map."],
            ["Integration risk", "Prioritize targets that can be absorbed without motion drift."],
          ],
        },
      ],
    };
  }

  return {
    label: "DP Lock - Round 1",
    steps: [
      {
        title: "Round 1 surfaced 4 load-bearing unknowns. Lock answers before Product + GTM runs?",
        body:
          "Tegy is pausing before downstream lanes because these assumptions change product and GTM design.",
        options: [
          ["I'll answer below", "Provide funnel metrics, pricing tiers, team setup, and roadmap-freeze decision."],
          ["Proceed with defaults - flag assumptions", "Run next rounds with pending DPs marked as unvalidated assumptions."],
          ["Stop here - Round 1 is enough", "Keep the strategy memo as the deliverable for now."],
        ],
      },
      {
        title: "Two specific answers most change downstream GTM.",
        body:
          "These are the highest-leverage answers before Product + GTM waterfall work continues.",
        options: [
          ["We have funnel data + pricing tiers - I'll paste them", "Locks DP-2 and DP-3 with measured conversion and plan pricing."],
          ["We do not have clean data yet - still testing", "Proceed with proxy benchmarks and confidence caveats."],
          ["Other answer", "Capture a different founder answer before the next lane runs."],
        ],
      },
    ],
  };
}

function renderDecisionCheckpoint(route) {
  const checkpoint = getDecisionCheckpoint(route);
  return `
    <section class="dp-checkpoint" data-checkpoint-step="1" aria-label="Decision checkpoint" hidden>
      <div class="dp-checkpoint-steps">
        ${checkpoint.steps
          .map(
            (step, stepIndex) => `
              <div class="dp-checkpoint-step ${stepIndex === 0 ? "active" : ""}" data-step-panel="${stepIndex + 1}" ${stepIndex === 0 ? "" : "hidden"}>
                <div class="dp-checkpoint-header">
                  <span>${stepIndex + 1}/${checkpoint.steps.length}</span>
                  <strong>${escapeHtml(step.title)}</strong>
                  <button type="button" aria-label="Dismiss checkpoint" data-checkpoint-action="dismiss">
                    <i data-lucide="x"></i>
                  </button>
                </div>
                <p>${escapeHtml(step.body)}</p>
                <div class="dp-option-list">
                  ${step.options
                    .map(
                      ([label, detail], optionIndex) => `
                        <button type="button" data-dp-option="${escapeHtml(label)}">
                          <span>
                            <strong>${escapeHtml(label)}</strong>
                            <small>${escapeHtml(detail)}</small>
                          </span>
                          <kbd>${optionIndex + 1}</kbd>
                        </button>
                      `,
                    )
                    .join("")}
                  <button type="button" data-dp-option="Other">
                    <span>
                      <strong>Other</strong>
                      <small>Type a different answer or lock condition.</small>
                    </span>
                    <kbd>${step.options.length + 1}</kbd>
                  </button>
                </div>
                <input class="dp-other-input" type="text" placeholder="Type your own answer here" aria-label="Other decision answer" />
                <div class="dp-checkpoint-actions">
                  ${stepIndex > 0 ? '<button type="button" data-checkpoint-action="back">Back</button>' : ""}
                  <button type="button" data-checkpoint-action="skip">Skip</button>
                  <button type="button" data-checkpoint-action="${stepIndex === checkpoint.steps.length - 1 ? "submit" : "next"}" disabled>
                    ${stepIndex === checkpoint.steps.length - 1 ? "Submit" : "Next"}
                  </button>
                </div>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="dp-checkpoint-complete" hidden>
        <div>
          <p class="eyebrow">${escapeHtml(checkpoint.label)}</p>
          <strong>Decision checkpoint captured.</strong>
          <p data-checkpoint-summary>Added to Decision Log for the next lane run.</p>
        </div>
        <button type="button" data-checkpoint-action="open-log"><i data-lucide="shield-check"></i> Open Decision Log</button>
      </div>
    </section>
  `;
}

function renderAgentRun(run, route) {
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
      ${renderDecisionCheckpoint(route)}
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
  const checkpoint = card.querySelector(".dp-checkpoint");
  steps.forEach((step, index) => {
    window.setTimeout(() => {
      steps.forEach((item, itemIndex) => {
        item.classList.toggle("active", itemIndex === index);
        if (itemIndex < index) item.classList.add("complete");
      });
      if (index === steps.length - 1) {
        step.classList.add("complete");
        window.setTimeout(() => {
          if (checkpoint) checkpoint.hidden = false;
          card.querySelector(".agent-run-header small").textContent = "Ready";
          syncIcons();
        }, 420);
      }
    }, index * 520);
  });
}

function revealDraftOutput(card) {
  const preview = card?.querySelector(".output-preview");
  if (!preview || preview.hidden === false) return;
  preview.hidden = false;
  card.dataset.outputReleased = "true";
  syncIcons();
  window.requestAnimationFrame(() => {
    preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
  state.assistantChoicesLocked = false;

  const userCard = document.createElement("article");
  userCard.className = "message-card user-message";
  userCard.innerHTML = `<p>${escapeHtml(prompt)}</p>`;

  const routingCard = createRoutingPreludeCard(prompt);
  stack.append(userCard, routingCard);
  syncIcons();
  window.requestAnimationFrame(() => {
    routingCard.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

function appendAgentResponse(prompt, routing, afterElement = null) {
  const stack = document.querySelector("#conversationStack");
  if (!stack) return;

  const contexts = getActiveContexts();
  const contextText = contexts.length ? contexts.join(", ") : "no selected context";
  const laneChoice = routing?.laneChoice || state.assistantLaneChoice;
  const depth = routing?.depth || state.assistantDepth;
  const reasoning = routing?.reasoning || state.assistantReasoning;
  const route = routePrompt(prompt, laneChoice);
  const run = getLaneRun(route);
  const projectText = state.assistantProject ? state.assistantProject : "No project selected";
  const draftTitle = run.title.replace(/\sdraft$/i, "");

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
      <span><i data-lucide="gauge"></i>${escapeHtml(depth)}</span>
    </div>
    <p><b>Request:</b> ${escapeHtml(prompt)}</p>
    <p>${contexts.length ? `Using ${escapeHtml(contextText)}, Tegy is running the lane logic` : "With no extra sources selected, Tegy is running the lane logic"} at ${escapeHtml(depth.toLowerCase())} depth, then building a decision-ready ${escapeHtml(route.output.toLowerCase())}.</p>
    ${renderAgentRun(run, route)}
  `;
  if (afterElement?.parentElement === stack) {
    afterElement.insertAdjacentElement("afterend", card);
  } else {
    stack.append(card);
  }
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
  state.artifactPage = 1;
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
  const summaryCopy = document.querySelector("#projectSummaryCopy");
  if (summaryCopy) {
    summaryCopy.textContent =
      projectSummaryCopy[projectName] ||
      "This project keeps the relevant context, sources, outputs, and decisions together. Use it to run Tegy against a specific strategic matter and preserve what gets learned.";
  }
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
  document.querySelectorAll("[data-project-detail]").forEach((item) => {
    item.classList.toggle("selected", item.dataset.projectDetail === projectName);
  });
  if (scopeAssistant) {
    state.assistantProject = projectName;
  }
  renderAssistantScope();
  if (state.vaultScope === "project") renderVaultRows();
  if (state.artifactScope === "project") state.artifactPage = 1;
  renderArtifacts();
}

function lockDecision(card) {
  card.classList.remove("pending");
  card.classList.remove("default");
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
  const actions = card.querySelector(".decision-actions");
  if (actions) {
    actions.innerHTML = `
      <button class="lock-decision" type="button" disabled>Lock</button>
      <button class="discard-decision" type="button">Discard</button>
    `;
    actions.querySelector(".discard-decision")?.addEventListener("click", () => discardDecision(card));
  }
  showToast("Decision locked");
}

function discardDecision(card) {
  card?.remove();
  showToast("Decision discarded");
}

function renderDecisionActions({ locked = false } = {}) {
  return `
    <div class="decision-actions">
      <button class="lock-decision" type="button" ${locked ? "disabled" : ""}>Lock</button>
      <button class="discard-decision" type="button">Discard</button>
    </div>
  `;
}

function getDecisionCheckpointSelection(panel) {
  const selected = panel.querySelector("[data-dp-option].selected");
  const customAnswer = panel.querySelector(".dp-other-input")?.value.trim();
  if (customAnswer) {
    return {
      label: customAnswer,
      detail: "Founder answer captured from the checkpoint.",
    };
  }

  if (!selected) return null;
  return {
    label: selected.querySelector("strong")?.textContent.trim() || selected.dataset.dpOption,
    detail: selected.querySelector("small")?.textContent.trim() || "",
  };
}

function updateDecisionCheckpointStep(panel) {
  const primaryAction = panel.querySelector('[data-checkpoint-action="next"], [data-checkpoint-action="submit"]');
  if (!primaryAction) return;
  primaryAction.disabled = !getDecisionCheckpointSelection(panel);
}

function selectDecisionCheckpointOption(option) {
  const panel = option.closest(".dp-checkpoint-step");
  if (!panel) return;
  panel.querySelectorAll("[data-dp-option]").forEach((button) => {
    button.classList.toggle("selected", button === option);
  });
  const input = panel.querySelector(".dp-other-input");
  if (input && option.dataset.dpOption === "Other") input.focus();
  updateDecisionCheckpointStep(panel);
}

function setDecisionCheckpointStep(checkpoint, stepNumber) {
  checkpoint.dataset.checkpointStep = String(stepNumber);
  checkpoint.querySelectorAll(".dp-checkpoint-step").forEach((panel) => {
    const active = panel.dataset.stepPanel === String(stepNumber);
    panel.hidden = !active;
    panel.classList.toggle("active", active);
    if (active) updateDecisionCheckpointStep(panel);
  });
  syncIcons();
}

function addDecisionCheckpointToLog(card, selections, actionLabel) {
  const decisionLog = document.querySelector("#decisionLog");
  if (!decisionLog || card.dataset.checkpointLogged === "true") return;

  const lane = card.dataset.routeLane || "StrategyOS";
  const output = card.dataset.outputType || "Generated output";
  const project = card.dataset.project && card.dataset.project !== "No project selected"
    ? card.dataset.project
    : "Unscoped";
  const title = `${lane} between-round checkpoint`;
  const firstAnswer = selections[0]?.label || actionLabel;
  const secondAnswer = selections[1]?.label || "No follow-up answer captured";
  const isDefault = `${firstAnswer} ${secondAnswer}`.toLowerCase().includes("default");

  if ([...decisionLog.querySelectorAll(".decision-card strong")].some((item) => item.textContent === title)) {
    card.dataset.checkpointLogged = "true";
    return;
  }

  const article = document.createElement("article");
  article.className = `decision-card ${isDefault ? "default" : "pending"}`;
  article.innerHTML = `
    <span>${isDefault ? "Default" : "Pending"}</span>
    <strong>${escapeHtml(title)}</strong>
    <p>${escapeHtml(firstAnswer)}${secondAnswer ? ` ${escapeHtml(secondAnswer)}` : ""}</p>
    ${renderMetaList(
      [
        ["Role", "Owner"],
        ["Project", project],
        ["Trace", `${lane} -> checkpoint -> next lane`],
        ["Consumed by", output],
      ],
      "decision-meta",
    )}
    ${renderDecisionActions()}
  `;

  article.querySelector(".lock-decision")?.addEventListener("click", () => lockDecision(article));
  article.querySelector(".discard-decision")?.addEventListener("click", () => discardDecision(article));
  decisionLog.prepend(article);
  card.dataset.checkpointLogged = "true";
}

function completeDecisionCheckpoint(checkpoint, actionLabel = "Proceed with defaults - flag assumptions") {
  const card = checkpoint.closest(".assistant-message");
  const selections = [...checkpoint.querySelectorAll(".dp-checkpoint-step")]
    .map(getDecisionCheckpointSelection)
    .filter(Boolean);
  const summary = selections.length
    ? selections.map((selection) => selection.label).join(" / ")
    : actionLabel;

  checkpoint.classList.add("complete");
  checkpoint.querySelector(".dp-checkpoint-steps").hidden = true;
  const complete = checkpoint.querySelector(".dp-checkpoint-complete");
  complete.hidden = false;
  const summaryNode = checkpoint.querySelector("[data-checkpoint-summary]");
  if (summaryNode) {
    summaryNode.textContent = `${summary}. Added to Decision Log for the next lane run.`;
  }
  if (card) addDecisionCheckpointToLog(card, selections, actionLabel);
  revealDraftOutput(card);
  showToast("Decision checkpoint captured");
  syncIcons();
}

function handleDecisionCheckpointAction(button) {
  const checkpoint = button.closest(".dp-checkpoint");
  if (!checkpoint) return;

  const action = button.dataset.checkpointAction;
  if (action === "dismiss") {
    checkpoint.hidden = true;
    return;
  }

  if (action === "open-log") {
    setPage("decisions");
    return;
  }

  if (action === "skip") {
    completeDecisionCheckpoint(checkpoint, "Proceed with defaults - flag assumptions");
    return;
  }

  const currentStep = Number(checkpoint.dataset.checkpointStep || "1");
  if (action === "back") {
    setDecisionCheckpointStep(checkpoint, Math.max(1, currentStep - 1));
    return;
  }

  const panel = checkpoint.querySelector(`[data-step-panel="${currentStep}"]`);
  if (panel && !getDecisionCheckpointSelection(panel)) return;

  if (action === "next") {
    setDecisionCheckpointStep(checkpoint, currentStep + 1);
    return;
  }

  if (action === "submit") {
    completeDecisionCheckpoint(checkpoint);
  }
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
    ${renderDecisionActions()}
  `;

  article.querySelector(".lock-decision").addEventListener("click", () => lockDecision(article));
  article.querySelector(".discard-decision").addEventListener("click", () => discardDecision(article));
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
    ${renderDecisionActions()}
  `;

  article.querySelector(".lock-decision").addEventListener("click", () => lockDecision(article));
  article.querySelector(".discard-decision").addEventListener("click", () => discardDecision(article));
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

function startAssistantSession(options = {}) {
  const {
    project = getDefaultProjectName(),
    focusInput = true,
    clearHistorySelection = true,
  } = options;
  const stack = document.querySelector("#conversationStack");
  const input = document.querySelector("#promptInput");

  if (clearHistorySelection) {
    document.querySelectorAll(".history-chat-row").forEach((row) => row.classList.remove("active"));
  }
  if (stack) stack.innerHTML = "";
  setChatMode(false);
  state.assistantProject = project;
  state.assistantOutput = null;
  state.assistantLaneChoice = "auto";
  state.assistantChoicesLocked = false;
  document.querySelectorAll("#lanePicker [data-output]").forEach((button) => button.classList.remove("selected"));
  document.querySelectorAll(".source-chip").forEach((chip) => setSourceChipActive(chip, false));
  renderAssistantScope();
  if (input) {
    input.value = "";
    input.style.height = "";
    input.placeholder = getPromptPlaceholder();
    if (focusInput) input.focus();
  }
  renderRoutingLock();
  setPage("assistant");
}

function init() {
  setTheme(getPreferredTheme());
  setSidebarCollapsed(window.localStorage.getItem("tegy-sidebar-collapsed") === "true");
  setRecentsOpen(true);
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

  document.querySelector("#newChatButton").addEventListener("click", () => {
    startAssistantSession();
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
    if (event.target.closest(".assistant-setting-control") || event.target.closest(".setting-picker")) return;
    if (event.target.closest(".project-picker")) return;
    if (event.target.closest(".composer-project-picker")) return;
    setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
    setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
    setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", false);
    setSettingPicker("depth", false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", false);
    setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", false);
    setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", false);
    setSettingPicker("depth", false);
  });

  document.querySelector("#vaultProjectTab").addEventListener("click", () => {
    const willOpen = document.querySelector("#vaultProjectTab").getAttribute("aria-expanded") !== "true";
    state.vaultScope = "project";
    renderVaultRows();
    setProjectTabMenu("#vaultProjectMenu", "#vaultProjectTab", willOpen);
  });

  document.querySelector("#artifactProjectTab").addEventListener("click", () => {
    const willOpen = document.querySelector("#artifactProjectTab").getAttribute("aria-expanded") !== "true";
    state.artifactScope = "project";
    state.artifactPage = 1;
    renderArtifacts();
    setProjectTabMenu("#artifactProjectMenu", "#artifactProjectTab", willOpen);
  });

  document.querySelector("#assistantProjectTab").addEventListener("click", () => {
    const willOpen = document.querySelector("#assistantProjectTab").getAttribute("aria-expanded") !== "true";
    renderAssistantProjectMenu();
    setSettingPicker("depth", false);
    setSettingPicker("reasoning", false);
    setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", willOpen);
  });

  document.querySelector("#attachFilesButton").addEventListener("click", () => {
    document.querySelector("#attachmentInput")?.click();
  });

  document.querySelector("#attachmentInput").addEventListener("change", (event) => {
    const count = event.target.files?.length || 0;
    if (!count) return;
    showToast(count === 1 ? "File attached" : `${count} files attached`);
    event.target.value = "";
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
      if (button.closest(".project-detail-panel")) {
        openProjectScopedPage(page);
        if (page === "assistant") {
          startAssistantSession({ project: state.activeProject });
        }
        if (isMobileNav()) setMobileMenu(false);
        return;
      }

      if (page === "assistant") {
        startAssistantSession();
        if (isMobileNav()) setMobileMenu(false);
        return;
      }

      setPage(page);
      if (page === "projects") setProjectDetailMode(false);
      if (isMobileNav()) setMobileMenu(false);
    });
  });

  document.querySelector("#newProjectInline").addEventListener("click", () => {
    document.querySelector("#projectDetailTitle").textContent = "New Tegy Project";
    setProjectDetailMode(true);
  });

  document.querySelectorAll("[data-project-card], [data-project-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      const groupSelector = button.dataset.projectCard ? "[data-project-card]" : "[data-project-detail]";
      document.querySelectorAll(groupSelector).forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectProject(button.dataset.projectCard || button.dataset.projectDetail);
      if (button.dataset.projectCard) setPage("projects");
      if (button.dataset.projectDetail) setProjectDetailMode(true);
    });
  });

  document.querySelector("#projectBackButton")?.addEventListener("click", () => {
    setProjectDetailMode(false);
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

  document.querySelector("#depthToggle").addEventListener("click", () => {
    const picker = document.querySelector("#depthPicker");
    setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", false);
    setSettingPicker("depth", picker.hidden);
  });

  document.querySelector("#reasoningToggle").addEventListener("click", () => {
    const picker = document.querySelector("#reasoningPicker");
    setProjectTabMenu("#assistantProjectMenu", "#assistantProjectTab", false);
    setSettingPicker("reasoning", picker.hidden);
  });

  document.querySelectorAll("[data-depth]").forEach((button) => {
    button.addEventListener("click", () => {
      state.assistantDepth = button.dataset.depth;
      state.assistantChoicesLocked = false;
      renderAssistantSettings();
      setSettingPicker("depth", false);
    });
  });

  document.querySelectorAll("[data-reasoning]").forEach((button) => {
    button.addEventListener("click", () => {
      state.assistantReasoning = button.dataset.reasoning;
      state.assistantChoicesLocked = false;
      renderAssistantSettings();
      setSettingPicker("reasoning", false);
    });
  });

  document.querySelector("#promptInput").addEventListener("input", () => {
    resizePromptInput();
    state.assistantChoicesLocked = false;
  });

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
    const routingChoice = event.target.closest("[data-routing-choice], [data-routing-depth], [data-routing-reasoning]");
    if (routingChoice) {
      setRoutingPreludeChoice(routingChoice);
      return;
    }

    const routingAction = event.target.closest("[data-routing-action]");
    if (routingAction) {
      const card = routingAction.closest(".routing-run-card");
      if (!card) return;
      if (routingAction.dataset.routingAction === "dismiss") {
        completeRoutingPrelude(card, true);
        return;
      }
      if (routingAction.dataset.routingAction === "run") {
        completeRoutingPrelude(card, true);
      }
      return;
    }

    const dpOption = event.target.closest("[data-dp-option]");
    if (dpOption) {
      selectDecisionCheckpointOption(dpOption);
      return;
    }

    const checkpointButton = event.target.closest("[data-checkpoint-action]");
    if (checkpointButton) {
      handleDecisionCheckpointAction(checkpointButton);
      return;
    }

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

  document.querySelector("#conversationStack").addEventListener("input", (event) => {
    const input = event.target.closest(".dp-other-input");
    if (!input) return;
    const panel = input.closest(".dp-checkpoint-step");
    const otherOption = panel?.querySelector('[data-dp-option="Other"]');
    if (otherOption && input.value.trim()) {
      selectDecisionCheckpointOption(otherOption);
    }
    if (panel) updateDecisionCheckpointStep(panel);
  });

  document.querySelectorAll(".source-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      if (chip.disabled) return;
      setSourceChipActive(chip, !chip.classList.contains("active"));
      updateActiveContextScope();
      renderRoutingLock();
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
      state.artifactPage = 1;
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
  document.querySelectorAll(".discard-decision").forEach((button) => {
    button.addEventListener("click", () => discardDecision(button.closest(".decision-card")));
  });

  setAgent("claude");
  selectProject(state.activeProject, { scopeAssistant: false });
  renderAssistantScope();
  renderAssistantSettings();
  renderVaultRows();
  syncIcons();
}

window.addEventListener("DOMContentLoaded", init);

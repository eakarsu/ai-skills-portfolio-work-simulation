export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-skills-portfolio-work-simulation",
  title: "Skills Portfolio & Work Simulation",
  tagline: "Evidence-backed candidate portfolios via team simulation",
  accent: "purple",
};

export const pages: PageConfig[] = [
  {
    label: "Candidates",
    href: "/candidates",
    description: "Candidates, portfolios, hiring signals.",
    entities: ["Candidate", "Portfolio", "HiringSignal"],
    workflows: ["portfolio-review"],
  },
  {
    label: "Simulations",
    href: "/simulations",
    description: "Simulation scenarios, templates, team compositions.",
    entities: ["Simulation", "SimulationTemplate", "TeamScenario"],
    workflows: ["sim-design"],
  },
  {
    label: "Evaluation",
    href: "/evaluation",
    description: "Competency ratings, evidence, and feedback.",
    entities: ["CompetencyRating", "EvidenceArtifact", "CommunicationEval", "LeadershipSignal", "AssessorNote", "PeerFeedback"],
    workflows: ["competency-score"],
  },
];

export const entities: Record<string, EntityConfig> = {
  Candidate: {
    name: "Candidate",
    label: "Candidate",
    fields: [{ name: "name", kind: "string" }, { name: "email", kind: "string" }, { name: "targetRole", kind: "string" }, { name: "institution", kind: "string" }, { name: "status", kind: "string" }, { name: "joinedAt", kind: "date" }],
  },
  Simulation: {
    name: "Simulation",
    label: "Simulation",
    fields: [{ name: "title", kind: "string" }, { name: "scenario", kind: "string" }, { name: "difficulty", kind: "string" }, { name: "status", kind: "string" }, { name: "startedAt", kind: "date" }, { name: "durationMinutes", kind: "number" }],
  },
  TeamScenario: {
    name: "TeamScenario",
    label: "Team Scenario",
    fields: [{ name: "name", kind: "string" }, { name: "teamComposition", kind: "string" }, { name: "objective", kind: "string" }, { name: "constraints", kind: "string" }, { name: "status", kind: "string" }, { name: "deliverable", kind: "string" }],
  },
  CompetencyRating: {
    name: "CompetencyRating",
    label: "Competency Rating",
    fields: [{ name: "competency", kind: "string" }, { name: "assessor", kind: "string" }, { name: "score", kind: "number" }, { name: "evidenceRef", kind: "string" }, { name: "status", kind: "string" }, { name: "ratedAt", kind: "date" }],
  },
  EvidenceArtifact: {
    name: "EvidenceArtifact",
    label: "Evidence Artifact",
    fields: [{ name: "kind", kind: "string" }, { name: "title", kind: "string" }, { name: "storageRef", kind: "string" }, { name: "simulationRef", kind: "string" }, { name: "status", kind: "string" }, { name: "capturedAt", kind: "date" }],
  },
  Portfolio: {
    name: "Portfolio",
    label: "Portfolio",
    fields: [{ name: "title", kind: "string" }, { name: "shareLink", kind: "string" }, { name: "status", kind: "string" }, { name: "artifactCount", kind: "number" }, { name: "publishedAt", kind: "date" }, { name: "overallScore", kind: "number" }],
  },
  CommunicationEval: {
    name: "CommunicationEval",
    label: "Communication Eval",
    fields: [{ name: "channel", kind: "string" }, { name: "clarity", kind: "string" }, { name: "audienceFit", kind: "string" }, { name: "score", kind: "number" }, { name: "status", kind: "string" }, { name: "notes", kind: "string" }],
  },
  LeadershipSignal: {
    name: "LeadershipSignal",
    label: "Leadership Signal",
    fields: [{ name: "behavior", kind: "string" }, { name: "context", kind: "string" }, { name: "strength", kind: "string" }, { name: "score", kind: "number" }, { name: "status", kind: "string" }, { name: "observedBy", kind: "string" }],
  },
  AssessorNote: {
    name: "AssessorNote",
    label: "Assessor Note",
    fields: [{ name: "assessor", kind: "string" }, { name: "subject", kind: "string" }, { name: "body", kind: "string" }, { name: "flagLevel", kind: "string" }, { name: "status", kind: "string" }, { name: "createdOn", kind: "date" }],
  },
  HiringSignal: {
    name: "HiringSignal",
    label: "Hiring Signal",
    fields: [{ name: "employer", kind: "string" }, { name: "signalType", kind: "string" }, { name: "strength", kind: "string" }, { name: "status", kind: "string" }, { name: "occurredAt", kind: "date" }, { name: "role", kind: "string" }],
  },
  SimulationTemplate: {
    name: "SimulationTemplate",
    label: "Simulation Template",
    fields: [{ name: "name", kind: "string" }, { name: "domain", kind: "string" }, { name: "rubric", kind: "string" }, { name: "difficulty", kind: "string" }, { name: "active", kind: "boolean" }, { name: "runsCount", kind: "number" }],
  },
  PeerFeedback: {
    name: "PeerFeedback",
    label: "Peer Feedback",
    fields: [{ name: "fromPeer", kind: "string" }, { name: "context", kind: "string" }, { name: "praise", kind: "string" }, { name: "suggestion", kind: "string" }, { name: "status", kind: "string" }, { name: "contributionScore", kind: "number" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "sim-design",
    title: "Simulation Designer",
    description: "Design a work simulation scenario and rubric.",
    prompt: "You are an assessment designer. Create a realistic work simulation: scenario, constraints, deliverable, and scoring rubric probing the listed competencies.",
    fields: ["targetRole", "competencies", "difficulty", "duration"],
  },
  {
    slug: "competency-score",
    title: "Competency Scorer",
    description: "Score a competency from observed evidence.",
    prompt: "You are an industrial-organizational psychologist. Score the competency from the described behavioral evidence with justification and bias checks.",
    fields: ["competency", "behaviors", "simContext", "scale"],
  },
  {
    slug: "portfolio-review",
    title: "Portfolio Reviewer",
    description: "Summarize a candidate portfolio for an employer.",
    prompt: "You are a hiring manager. Summarize the candidate's evidence-backed portfolio: strongest signals, risks, interview probes.",
    fields: ["targetRole", "topArtifacts", "scores", "peerFeedback"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}

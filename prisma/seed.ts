// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const passwordHash = await bcrypt.hash("Demo!23456", 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-skills-portfolio-work-simulation.local", "Demo Admin", "ADMIN"],
    ["manager@ai-skills-portfolio-work-simulation.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-skills-portfolio-work-simulation.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Candidate = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.candidate.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.candidate.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      email: `contact${i}@example.com`,
      targetRole: `TargetRole ${String(i + 1).padStart(3, "0")}`,
      institution: `Institution ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Candidate, i),
      joinedAt: daysAgo(i)
      },
    });
  }

  const candidateRefs = await prisma.candidate.findMany({ select: { id: true } });

  const STATUSES_Simulation = ["DRAFT", "LIVE", "SCORING", "CLOSED"];
  await prisma.simulation.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.simulation.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      scenario: `Scenario ${String(i + 1).padStart(3, "0")}`,
      difficulty: `Difficulty ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Simulation, i),
      startedAt: daysAgo(i),
      durationMinutes: 5 + ((i * 13) % 95),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_TeamScenario = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.teamScenario.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.teamScenario.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      teamComposition: `TeamComposition ${String(i + 1).padStart(3, "0")}`,
      objective: `Objective ${String(i + 1).padStart(3, "0")}`,
      constraints: `Constraints ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_TeamScenario, i),
      deliverable: `Deliverable ${String(i + 1).padStart(3, "0")}`,
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_CompetencyRating = ["UNSCORED", "CALIBRATED", "FINAL"];
  await prisma.competencyRating.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.competencyRating.create({
      data: {
      competency: `Competency ${String(i + 1).padStart(3, "0")}`,
      assessor: `Assessor ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      evidenceRef: `EvidenceRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CompetencyRating, i),
      ratedAt: daysAgo(i),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_EvidenceArtifact = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.evidenceArtifact.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.evidenceArtifact.create({
      data: {
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      storageRef: `StorageRef ${String(i + 1).padStart(3, "0")}`,
      simulationRef: `SimulationRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_EvidenceArtifact, i),
      capturedAt: daysAgo(i),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_Portfolio = ["BUILDING", "READY", "SHARED", "ARCHIVED"];
  await prisma.portfolio.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.portfolio.create({
      data: {
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      shareLink: `ShareLink ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Portfolio, i),
      artifactCount: 5 + ((i * 13) % 95),
      publishedAt: daysAgo(i),
      overallScore: amount(i, 250),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_CommunicationEval = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.communicationEval.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.communicationEval.create({
      data: {
      channel: `Channel ${String(i + 1).padStart(3, "0")}`,
      clarity: `Clarity ${String(i + 1).padStart(3, "0")}`,
      audienceFit: `AudienceFit ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      status: pick(STATUSES_CommunicationEval, i),
      notes: `Notes ${String(i + 1).padStart(3, "0")}`,
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_LeadershipSignal = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.leadershipSignal.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.leadershipSignal.create({
      data: {
      behavior: `Behavior ${String(i + 1).padStart(3, "0")}`,
      context: `Context ${String(i + 1).padStart(3, "0")}`,
      strength: `Strength ${String(i + 1).padStart(3, "0")}`,
      score: amount(i, 250),
      status: pick(STATUSES_LeadershipSignal, i),
      observedBy: `ObservedBy ${String(i + 1).padStart(3, "0")}`,
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_AssessorNote = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.assessorNote.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.assessorNote.create({
      data: {
      assessor: `Assessor ${String(i + 1).padStart(3, "0")}`,
      subject: `Subject ${String(i + 1).padStart(3, "0")}`,
      body: `Body ${String(i + 1).padStart(3, "0")}`,
      flagLevel: `FlagLevel ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_AssessorNote, i),
      createdOn: daysAgo(i),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_HiringSignal = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.hiringSignal.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.hiringSignal.create({
      data: {
      employer: `Employer ${String(i + 1).padStart(3, "0")}`,
      signalType: `SignalType ${String(i + 1).padStart(3, "0")}`,
      strength: `Strength ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_HiringSignal, i),
      occurredAt: daysAgo(i),
      role: `Role ${String(i + 1).padStart(3, "0")}`,
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_SimulationTemplate = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.simulationTemplate.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.simulationTemplate.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      domain: `Domain ${String(i + 1).padStart(3, "0")}`,
      rubric: `Rubric ${String(i + 1).padStart(3, "0")}`,
      difficulty: `Difficulty ${String(i + 1).padStart(3, "0")}`,
      active: i % 3 === 0,
      runsCount: 5 + ((i * 13) % 95),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  const STATUSES_PeerFeedback = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.peerFeedback.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.peerFeedback.create({
      data: {
      fromPeer: `FromPeer ${String(i + 1).padStart(3, "0")}`,
      context: `Context ${String(i + 1).padStart(3, "0")}`,
      praise: `Praise ${String(i + 1).padStart(3, "0")}`,
      suggestion: `Suggestion ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_PeerFeedback, i),
      contributionScore: amount(i, 250),
      candidate: { connect: { id: candidateRefs[i % candidateRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });

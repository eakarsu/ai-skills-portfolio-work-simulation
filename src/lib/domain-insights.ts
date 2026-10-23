import { recordMetadata } from "./record-policy";

// Deterministic offline insights over the app's own records.
// No provider call is made; results are labelled aiGenerated:false.
export type InsightRow = Record<string, unknown>;

function isEmpty(value: unknown) {
  return value === null || value === undefined || value === "";
}

export function buildInsights(entity: string, rows: InsightRow[]) {
  const meta = recordMetadata[entity];
  const list = rows ?? [];
  const byStatus: Record<string, number> = {};
  for (const row of list) {
    const key = typeof row.status === "string" && row.status ? row.status : "Unspecified";
    byStatus[key] = (byStatus[key] ?? 0) + 1;
  }
  const missingByField: Record<string, number> = {};
  for (const field of meta?.fields ?? []) {
    missingByField[field.name] = list.filter((row) => isEmpty(row[field.name])).length;
  }
  const fieldsWithGaps = Object.values(missingByField).filter((n) => n > 0).length;
  const numericFields = (meta?.fields ?? []).filter((f) => f.kind === "number").map((f) => f.name);
  const scoreTotals: Record<string, number> = {};
  for (const name of numericFields) {
    const values = list.map((row) => Number(row[name])).filter((n) => Number.isFinite(n));
    scoreTotals[name] = values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;
  }
  const attention = list.filter((row) => {
    const s = String(row.status ?? "").toLowerCase();
    return !["approved", "closed", "complete", "completed", "published"].includes(s);
  }).length;
  const base = { aiGenerated: false as const, source: "deterministic fallback", label: "Deterministic fallback — no AI provider was called" };
  return {
    ...base,
    entity,
    recordCount: list.length,
    insights: [
      {
        ...base, type: "portfolio-completeness", title: "Portfolio completeness",
        summary: list.length ? `${list.length} ${entity} record(s) are on file.` : `No ${entity} records yet; counts are shown as 0.`,
        metrics: [
          { label: "Records reviewed", value: list.length },
          { label: "Fields with gaps", value: fieldsWithGaps },
        ],
        sections: [
          { title: "Status breakdown", detail: Object.keys(byStatus).length ? byStatus : { "No records": 0 } },
          { title: "Missing values by field", detail: missingByField },
        ],
      },
      {
        ...base, type: "competency-coverage", title: "Competency and score coverage",
        summary: numericFields.length ? `Average values are shown per numeric field; 0 means no numeric values yet.` : "This record type has no numeric fields (0).",
        metrics: numericFields.map((name) => ({ label: `Average ${name}`, value: scoreTotals[name] ?? 0 })),
        sections: [
          { title: "Method", detail: "Averages are computed directly from saved records. Zero and empty values are reported as-is." },
        ],
      },
      {
        ...base, type: "readiness-queue", title: "Simulation readiness queue",
        summary: attention ? `${attention} record(s) are not yet approved, published or closed and need follow-up.` : "No records await follow-up (0).",
        metrics: [
          { label: "Records awaiting follow-up", value: attention },
          { label: "Records reviewed", value: list.length },
        ],
        sections: [
          { title: "Queue rule", detail: "Records whose status is not Approved, Published, Closed or Complete are queued; an empty queue is reported as 0." },
        ],
      },
    ],
  };
}

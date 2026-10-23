import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { buildInsights } from "../src/lib/domain-insights";

test("offline insights are labelled aiGenerated:false over own records", () => {
  const out = buildInsights("Candidate", [
    { id: "1", name: "Ada", status: "Active" },
    { id: "2", name: "Bo", status: "Published" },
  ]);
  assert.equal(out.aiGenerated, false);
  assert.equal(out.recordCount, 2);
  assert.equal(out.insights.length, 3);
  assert.ok(out.insights.every((i) => i.aiGenerated === false));
});

test("empty record set preserves zero counts", () => {
  const out = buildInsights("CompetencyRating", []);
  assert.equal(out.recordCount, 0);
  assert.equal(out.insights[0].metrics[0].value, 0);
  const avg = out.insights[1].metrics.find((m) => m.label.includes("score"));
  assert.ok(avg === undefined || avg.value === 0);
});

test("export route exists, is authenticated and supports csv/json", () => {
  assert.ok(existsSync("src/app/api/export/[entity]/route.ts"));
  const route = readFileSync("src/app/api/export/[entity]/route.ts", "utf8");
  assert.ok(route.includes("authorize"), "export must require auth");
  assert.ok(route.includes("csv") && route.includes("json"));
});

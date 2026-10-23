import { NextRequest } from "next/server";
import { authorize } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { recordMetadata, RequestError } from "@/lib/record-policy";
import { records, errorResponse } from "@/lib/record-store";
import { buildInsights } from "@/lib/domain-insights";

export const dynamic = "force-dynamic";

// Deterministic offline insights over the app's own records (no provider call).
export async function GET(_request: NextRequest, context: { params: Promise<{ entity: string }> }) {
  try {
    await authorize();
    const { entity } = await context.params;
    if (!recordMetadata[entity]) throw new RequestError("Unknown entity", 404);
    const rows = await records(prisma, entity).findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1000 });
    return Response.json(buildInsights(entity, rows as Record<string, unknown>[]));
  } catch (error) { return errorResponse(error); }
}

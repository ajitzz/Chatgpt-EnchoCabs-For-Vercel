// app/api/weekly/[id]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { z } from "zod";

const prisma = getPrisma();
const weeklyEntryModel = (prisma as any).weeklyEntry ?? null;
const weeklyEarningModel = (prisma as any).weeklyEarning ?? null;
const Weekly: any = weeklyEntryModel ?? weeklyEarningModel;
const usesNewFields = Boolean(weeklyEntryModel);

function parseYMD(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0));
  return Number.isNaN(dt.getTime()) ? null : dt;
}
const updateSchema = z.object({
  weekStart: z.string().optional(),
  weekEnd: z.string().optional(),
  earnings: z.coerce.number().optional(),
  trips: z.coerce.number().int().optional(),
});

// GET /api/weekly/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {

  if (!Weekly) return NextResponse.json({ error: "Weekly model not found" }, { status: 500 });

  try {
    const row = await Weekly.findUnique({ where: { id: params.id } });
    return NextResponse.json(row ?? null, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "Failed") }, { status: 500 });
  }
}

// PATCH /api/weekly/:id  (partial update)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {

  if (!Weekly) return NextResponse.json({ error: "Weekly model not found" }, { status: 500 });

  try {
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
    }
    const d = parsed.data;

    // try new field names first
    const updated = await Weekly.update({
      where: { id: params.id },
      data: usesNewFields
        ? {
            weekStart: d.weekStart ? parseYMD(d.weekStart) : undefined,
            weekEnd: d.weekEnd ? parseYMD(d.weekEnd) : undefined,
            earnings: d.earnings,
            trips: d.trips,
          }
        : {
            weekStartDate: d.weekStart ? parseYMD(d.weekStart) : undefined,
            weekEndDate: d.weekEnd ? parseYMD(d.weekEnd) : undefined,
            earningsInINR: d.earnings,
            tripsCompleted: d.trips,
          },
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "Failed") }, { status: 400 });
  }
}

// DELETE /api/weekly/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {

  if (!Weekly) return NextResponse.json({ error: "Weekly model not found" }, { status: 500 });

  try {
    await Weekly.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "Failed") }, { status: 400 });
  }
}

// app/api/weekly/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { z } from "zod";

// ───────────────── helpers ─────────────────
const prisma = getPrisma();

function parseYMD(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1, 0, 0, 0));
  return Number.isNaN(dt.getTime()) ? null : dt;
}

const createSchema = z.object({
  driverId: z.string().min(1, "driverId required"),
  weekStart: z.string().refine((s) => parseYMD(s) !== null, "Invalid weekStart (YYYY-MM-DD)"),
  weekEnd: z.string().refine((s) => parseYMD(s) !== null, "Invalid weekEnd (YYYY-MM-DD)"),
  earnings: z.coerce.number().min(0, "earnings must be >= 0"),
  trips: z.coerce.number().int().min(0, "trips must be >= 0"),
});

function pickWeeklyModel(p: any) {
  return (p as any).weeklyEntry ?? (p as any).weeklyEarning ?? null;
}

// ───────────────── GET /api/weekly ─────────────────
// Optional query param: ?driverId=...
export async function GET(req: Request) {
  const Weekly = pickWeeklyModel(prisma);
  if (!Weekly) {
    return NextResponse.json(
      { error: "Weekly model not found (weeklyEntry/weeklyEarning)" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const driverId = searchParams.get("driverId") ?? undefined;

  try {
    try {
      const rows = await Weekly.findMany({
        where: driverId ? { driverId } : undefined,
        include: { driver: { select: { id: true, name: true } } },
        orderBy: [{ weekEnd: "desc" as const }],
      } as any);
      return NextResponse.json(rows, { headers: { "Cache-Control": "no-store" } });
    } catch {
      // Fallback for old schemas that use weekStart / weekStartDate
      const rows = await Weekly.findMany({
        where: driverId ? { driverId } : undefined,
        include: { driver: { select: { id: true, name: true } } },
        orderBy: [{ weekStart: "desc" as const }],
      } as any);
      return NextResponse.json(rows, { headers: { "Cache-Control": "no-store" } });
    }
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "Failed") }, { status: 500 });
  }
}

// ───────────────── POST /api/weekly ─────────────────
export async function POST(req: Request) {
  const Weekly = pickWeeklyModel(prisma);
  if (!Weekly) {
    return NextResponse.json(
      { error: "Weekly model not found (weeklyEntry/weeklyEarning)" },
      { status: 500 }
    );
  }

  try {
    const raw = await req.json();
    const parsed = createSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const d = parsed.data;

    // Try new schema first
    try {
      const created = await Weekly.create({
        data: {
          driverId: d.driverId,
          weekStart: parseYMD(d.weekStart),
          weekEnd: parseYMD(d.weekEnd),
          earnings: d.earnings,
          trips: d.trips,
        },
      });
      return NextResponse.json(created, { status: 201 });
    } catch {
      // Fallback to legacy field names
      const created = await Weekly.create({
        data: {
          driverId: d.driverId,
          weekStartDate: parseYMD(d.weekStart),
          weekEndDate: parseYMD(d.weekEnd),
          earningsInINR: d.earnings,
          tripsCompleted: d.trips,
        },
      });
      return NextResponse.json(created, { status: 201 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "Failed") }, { status: 400 });
  }
}

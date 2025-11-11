// app/performance/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { unstable_noStore as noStore } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import PerformanceClient, { type DriverView } from "./performanceClient";

function toISODateOnly(d: Date | string | null | undefined): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  return utc.toISOString().slice(0, 10);
}
function toNumber(n: unknown): number {
  if (n == null) return 0;
  if (typeof n === "number") return Number.isFinite(n) ? n : 0;
  const asNum = Number((n as any).toString?.() ?? String(n));
  return Number.isFinite(asNum) ? asNum : 0;
}

export default async function Page() {
  noStore();
  const prisma = getPrisma();

  // Try relation include first
  try {
    const drivers = await prisma.driver.findMany({
      where: { hidden: false as any, removedAt: null as any },
      include: { weeklyEntries: { orderBy: { weekEnd: "desc" as const } } },
      orderBy: { createdAt: "desc" as const },
    });

    const views: DriverView[] = drivers.map((d: any) => ({
      id: d.id,
      name: d.name,
      profileImageUrl: d.profileImageUrl ?? null,
      licenseNumber: d.licenseNumber ?? null,
      rating: d.rating ?? null,
      weeklyEarnings: (d.weeklyEntries ?? []).map((w: any) => ({
        id: w.id,
        weekStartDate: toISODateOnly(w.weekStart ?? w.weekStartDate),
        weekEndDate: toISODateOnly(w.weekEnd ?? w.weekEndDate),
        earningsInINR: toNumber(w.earnings ?? w.earningsInINR),
        tripsCompleted: toNumber(w.trips ?? w.tripsCompleted),
      })),
    }));

    return <PerformanceClient drivers={views} />;
  } catch (e) {
    console.warn("[performance] relation include failed; falling back", e);
  }

  // Fallback: fetch drivers without select (avoid TS errors on optional fields)
  const driversOnly = await prisma.driver.findMany({
    where: { hidden: false as any, removedAt: null as any },
    orderBy: { name: "asc" as const },
  });

  const Weekly: any = (prisma as any).weeklyEntry ?? (prisma as any).weeklyEarning ?? null;
  const weeklyRows: any[] = Weekly
    ? await Weekly.findMany({
        where: { driverId: { in: driversOnly.map((d: any) => d.id) } },
        include: { driver: { select: { id: true, name: true } } },
        orderBy: [{ weekEnd: "desc" as const }],
      }).catch(async () => {
        return await Weekly.findMany({
          where: { driverId: { in: driversOnly.map((d: any) => d.id) } },
          include: { driver: { select: { id: true, name: true } } },
          orderBy: [{ weekStart: "desc" as const }],
        });
      })
    : [];

  const byDriver = new Map<string, any[]>();
  for (const w of weeklyRows) {
    const k = w.driverId ?? w.driver?.id;
    if (!k) continue;
    if (!byDriver.has(k)) byDriver.set(k, []);
    byDriver.get(k)!.push(w);
  }

  const views: DriverView[] = driversOnly.map((d: any) => ({
    id: d.id,
    name: d.name,
    profileImageUrl: (d as any).profileImageUrl ?? null,
    licenseNumber: (d as any).licenseNumber ?? null,
    rating: (d as any).rating ?? null,
    weeklyEarnings: (byDriver.get(d.id) ?? []).map((w: any) => ({
      id: w.id,
      weekStartDate: toISODateOnly(w.weekStart ?? w.weekStartDate),
      weekEndDate: toISODateOnly(w.weekEnd ?? w.weekEndDate),
      earningsInINR: toNumber(w.earnings ?? w.earningsInINR),
      tripsCompleted: toNumber(w.trips ?? w.tripsCompleted),
    })),
  }));

  return <PerformanceClient drivers={views} />;
}

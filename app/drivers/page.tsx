// app/drivers/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { unstable_noStore as noStore } from "next/cache";
import { getPrisma } from "@/lib/prisma";
// If you have a client component, keep this import. Otherwise, render inline.
// import DriversClient, { type DriverListItem } from "./_components/DriverClient";

type DriverRow = {
  id: string;
  name: string;
  hidden?: boolean | null;
  createdAt?: string | null;
};

export default async function DriversPage() {
  noStore();
  const prisma = getPrisma();

  let rows: DriverRow[] = [];
  try {
    const raw = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" as const },
    });
    rows = raw.map((r: any) => ({
      id: r.id,
      name: r.name,
      hidden: r.hidden ?? null,
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : null,
    }));
  } catch {
    rows = [];
  }

  // If you have a DriversClient component, you can pass rows to it instead.
  // return <DriversClient initialRows={rows as any} />;

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Drivers</h1>
      <div className="rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="p-2">{d.name}</td>
                <td className="p-2">{d.createdAt ?? "-"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={2} className="p-4 text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

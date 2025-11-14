// app/performance/_components/PerformanceClient.tsx
"use client";


import React from "react";

import { cn } from "@/lib/utils";

// ---------------- Types shared with page.tsx ----------------
export type WeeklyEntryDTO = {
  id: number | string;
  weekStart: string; // yyyy-mm-dd
  weekEnd: string; // yyyy-mm-dd
  earnings: number;
  trips: number;
  notes?: string | null;
};


export type DriverDTO = {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  joinDate: string; // yyyy-mm-dd
  profileImageUrl?: string | null;
  
  createdAt: string;
  weeklyEntries: WeeklyEntryDTO[];
};


// ---------------- Date helpers (Mon–Sun) ----------------
const toUTC = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));

const iso = (d: Date) => toUTC(d).toISOString().slice(0, 10);

const parseISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

// start Monday
const startOfWeekMon = (d: Date) => {

  const day = d.getUTCDay(); // 0..6 (Sun..Sat)
  const diff = day === 0 ? -6 : 1 - day;
  
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + diff)
  );
};
// end Sunday
const endOfWeekSun = (d: Date) => {
  const s = startOfWeekMon(d);
  return new Date(Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate() + 6));
};


const formatRange = (startISO: string, endISO: string) => {
  if (!startISO || !endISO) return "—";
  const s = parseISO(startISO);
  const e = parseISO(endISO);
  
  const md: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  const yr: Intl.DateTimeFormatOptions = { year: "numeric" };
  const sameYear = s.getUTCFullYear() === e.getUTCFullYear();
  
  const startLabel = s.toLocaleDateString("en-GB", md);
  const endLabel = e.toLocaleDateString("en-GB", md);
  const yearSuffix = sameYear ? "" : ", " + e.toLocaleDateString("en-GB", yr);
  return `${startLabel} – ${endLabel}${yearSuffix}`;
};


const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// “This Week” if present; otherwise “Recent Week”
function pickDisplayWeek(
  
  rows: WeeklyEntryDTO[],
  curStartISO: string,
  curEndISO: string

): {
  label: "This Week" | "Recent Week";
  row: WeeklyEntryDTO | null;
  start: string;
  end: string;
} {
  const exact = rows.find((r) => r.weekStart === curStartISO && r.weekEnd === curEndISO);
  if (exact) return { label: "This Week", row: exact, start: curStartISO, end: curEndISO };
  const latest = [...rows].sort((a, b) => (a.weekEnd < b.weekEnd ? 1 : -1))[0] ?? null;
  if (latest)
    return {
      label: "Recent Week",
      row: latest,
    
      start: latest.weekStart,
      end: latest.weekEnd,
    };
  return { label: "This Week", row: null, start: curStartISO, end: curEndISO };
}


// ---------------- UI primitives (shadcn-like) ----------------
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cn(
      "rounded-2xl border border-black/5 bg-white shadow-sm",
      "transition-all duration-300",
      className
    )}
  />
);

const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs",
      className
    )}
  />
);


const Avatar = ({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string | null;
  alt: string;
  fallback: string;
  className?: string;
}) => (
  <div
    className={cn(
      "h-12 w-12 overflow-hidden rounded-full bg-gray-100 ring-1 ring-black/5",
      className
    )}
  >
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <div className="grid h-full w-full place-items-center text-sm text-gray-600">
        {fallback}
      </div>
    )}
  </div>
);

// ---------------- Modal ----------------
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

// ---------------- Main Client ----------------
export default function PerformanceClient({ drivers }: { drivers: DriverDTO[] }) {
  const now = new Date();

  const curStart = iso(startOfWeekMon(now));
  const curEnd = iso(endOfWeekSun(now));

 
  const kpi = React.useMemo(() => {
    let total = 0;
 
    let top = 0;
    let topName = "—";

   
    for (const d of drivers) {
      const row = d.weeklyEntries.find(
        (w) => w.weekStart === curStart && w.weekEnd === curEnd
      );
 
      const amt = row?.earnings ?? 0;
      total += amt;
  
      if (amt > top) {
        top = amt;
        topName = d.name;
      }
    }


    const active = drivers.length;
    const avg = active ? Math.round(total / active) : 0;

  
    return { total, active, avg, top, topName };
  }, [drivers, curStart, curEnd]);

  const sorted = React.useMemo(() => {
    return [...drivers].sort((a, b) => {
      const aLast = a.weeklyEntries.reduce(
        (m, r) => (r.weekEnd > m ? r.weekEnd : m),
        ""
      );
      const bLast = b.weeklyEntries.reduce(
        (m, r) => (r.weekEnd > m ? r.weekEnd : m),
        ""
      );
      if (aLast !== bLast) return aLast < bLast ? 1 : -1;

      const aTotal = a.weeklyEntries.reduce((s, r) => s + (r.earnings || 0), 0);
      const bTotal = b.weeklyEntries.reduce((s, r) => s + (r.earnings || 0), 0);
      if (aTotal !== bTotal) return bTotal - aTotal;

      return a.name.localeCompare(b.name);
    });
  }, [drivers]);

  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<DriverDTO | null>(null);

  return (
  
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:py-8">
  

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs text-gray-500">Total Weekly Earnings</div>
          <div className="mt-1 text-2xl font-bold">{inr(kpi.total)}</div>
          
        </Card>
        <Card className="p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs text-gray-500">Active Drivers</div>
          <div className="mt-1 text-2xl font-bold">{kpi.active}</div>
        </Card>
        <Card className="p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs text-gray-500">Avg Weekly Earnings</div>
          <div className="mt-1 text-2xl font-bold">{inr(kpi.avg)}</div>
        </Card>
        <Card className="p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md">
          <div className="text-xs text-gray-500">Top Earner This Week</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{inr(kpi.top)}</span>
            <span className="truncate text-sm text-gray-600">{kpi.topName}</span>
          </div>
        </Card>
      </div>

      <h2 className="mt-6 mb-3 text-base font-semibold sm:text-lg">Drivers Testimonials</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((d) => {
          const totalTrips = d.weeklyEntries.reduce((s, r) => s + (r.trips || 0), 0);
          const totalEarn = d.weeklyEntries.reduce((s, r) => s + (r.earnings || 0), 0);
          const bestWeek = d.weeklyEntries.reduce(
            (m, r) => Math.max(m, r.earnings || 0),
            0
          );

          const { label, row, start, end } = pickDisplayWeek(
            d.weeklyEntries,
            curStart,
            curEnd
          );

          return (
            <Card
              key={d.id}
              className="cursor-pointer p-4 transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => {
                setCurrent(d);
                setOpen(true);
              }}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={d.profileImageUrl}
                  alt={d.name}
                  fallback={d.name.slice(0, 2).toUpperCase()}
                />
                <div className="min-w-0">
                  <div className="truncate font-semibold">{d.name}</div>
                  <div className="text-xs text-gray-600">
                    DL •••{d.licenseNumber.replace(/\D/g, "").slice(-3) || "—"}
                    <span className="mx-2">•</span>
                    Trips: {totalTrips}
                  </div>
                </div>
              </div>

  
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-600 p-3 text-center text-white">
                  <div className="text-[11px] opacity-90">{label}</div>
                  <div className="text-lg font-bold">{inr(row?.earnings ?? 0)}</div>
                  <div className="text-[10px] opacity-80">{formatRange(start, end)}</div>
                </div>

               
                <div className="rounded-xl bg-gray-50 p-3 text-center">
                  <div className="text-[11px] text-gray-500">Total Earnings</div>
                  <div className="text-lg font-bold">{inr(totalEarn)}</div>
                </div>

                 
                <div className="rounded-xl bg-amber-50 p-3 text-center">
                  <div className="text-[11px] text-amber-700">Best Week</div>
                  <div className="text-lg font-bold text-amber-700">{inr(bestWeek)}</div>
                </div>
   
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={open && !!current} onClose={() => setOpen(false)}>
        {current && (
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar
                  src={current.profileImageUrl}
                  alt={current.name}
                  fallback={current.name.slice(0, 2).toUpperCase()}
                  className="h-14 w-14"
                />
                <div>
                  <div className="text-xl font-bold">{current.name}</div>
                  <div className="text-sm text-gray-500">
                    ⭐ 4.8 <span className="mx-1">•</span>
                    {current.weeklyEntries.reduce((s, r) => s + (r.trips || 0), 0)} trips completed
                  </div>
                 
                </div>
              
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>


            {(() => {
              const total = current.weeklyEntries.reduce((s, r) => s + (r.earnings || 0), 0);
              const best = current.weeklyEntries.reduce(
                (m, r) => Math.max(m, r.earnings || 0),
                0
              );
              const pick = pickDisplayWeek(current.weeklyEntries, curStart, curEnd);
              return (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border bg-emerald-600 p-4 text-white">
                    <div className="text-xs opacity-90">{pick.label}</div>
                    <div className="text-2xl font-extrabold">{inr(pick.row?.earnings ?? 0)}</div>
                    <div className="text-xs opacity-80">{formatRange(pick.start, pick.end)}</div>
                  </div>

                  <Card className="p-4">
                    <div className="text-xs text-gray-500">Total Earnings</div>
                    <div className="text-2xl font-extrabold">{inr(total)}</div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-xs text-gray-500">Best Week</div>
                    <div className="text-2xl font-extrabold text-emerald-700">{inr(best)}</div>
                  </Card>
                </div>
              );
            })()}

            <div className="mt-6 font-semibold">Weekly Earnings History</div>
            <div className="mt-3 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {[...current.weeklyEntries]
                .sort((a, b) => (a.weekEnd < b.weekEnd ? 1 : -1))
                .map((w) => {
                  const best = current.weeklyEntries.reduce(
                    (m, r) => Math.max(m, r.earnings || 0),
                    0
                  );
                  const isBest = (w.earnings || 0) === best;
                  return (
                    <div
                      key={w.id}
                      className="flex items-center justify-between rounded-xl border bg-white px-4 py-3"
                    >
                      <div>
                        <div className="font-medium">{formatRange(w.weekStart, w.weekEnd)}</div>
                        <div className="text-xs text-gray-500">{w.trips} trips</div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isBest && (
                          <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                            🏆 Best Week
                          </Badge>
                        )}
                        <div className="text-lg font-semibold">{inr(w.earnings)}</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
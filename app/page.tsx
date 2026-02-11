import { getStats } from "@/actions/admin";

export const dynamic = "force-dynamic";

const inr = new Intl.NumberFormat("en-IN");

function mgToGrams(mg: number): string {
  return (mg / 1000).toFixed(3);
}

export default async function DashboardPage() {
  let stats;
  let error: string | null = null;

  try {
    stats = await getStats();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load stats";
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-ink/50">
          Platform overview and key metrics
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {stats && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Total Users"
            value={inr.format(stats.totalUsers)}
          />
          <StatCard
            label="Total Gold Held"
            value={`${mgToGrams(stats.totalGoldHeldMg)} g`}
            sub={`${inr.format(stats.totalGoldHeldMg)} mg`}
          />
          <StatCard
            label="Total Purchased"
            value={`${mgToGrams(stats.totalGoldPurchasedMg)} g`}
            sub={`${inr.format(stats.totalGoldPurchasedMg)} mg`}
          />
          <StatCard
            label="Active Schemes"
            value={inr.format(stats.activeSchemes)}
          />
          <StatCard
            label="Total Transactions"
            value={inr.format(stats.totalTransactions)}
          />
          <StatCard
            label="Total Deliveries"
            value={inr.format(stats.totalDeliveries)}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-5 space-y-2">
      <p className="text-sm text-ink/50">{label}</p>
      <p className="text-2xl font-semibold text-accent">{value}</p>
      {sub && <p className="text-xs text-ink/40">{sub}</p>}
    </div>
  );
}

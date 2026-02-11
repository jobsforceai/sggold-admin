import { getTransactions } from "@/actions/admin";
import { Pagination } from "../_components/pagination";

export const dynamic = "force-dynamic";

const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function paisaToInr(p: number) {
  return inrFmt.format(p / 100);
}

function mgToGrams(mg: number) {
  return (mg / 1000).toFixed(3);
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  let data;
  let error: string | null = null;

  try {
    data = await getTransactions(page);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load transactions";
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm text-ink/50">
          All platform transactions
          {data && (
            <span className="ml-2 text-ink/30">({data.total} total)</span>
          )}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {data && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-ink/60">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount (g)</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">User ID</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <TypeBadge type={tx.type} />
                    </td>
                    <td className="px-4 py-3 text-ink/80 font-mono text-xs">
                      {mgToGrams(tx.amountMg)}
                    </td>
                    <td className="px-4 py-3 text-ink/80 text-xs">
                      {paisaToInr(tx.totalPaise)}
                    </td>
                    <td className="px-4 py-3 text-ink/50 font-mono text-xs">
                      <a
                        href={`/users/${tx.userId}`}
                        className="text-accent hover:underline"
                      >
                        {tx.userId.slice(-8)}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-4 py-3 text-ink/50 text-xs">
                      {new Date(tx.createdAt).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
                {data.transactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-ink/40"
                    >
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/transactions"
          />
        </>
      )}
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    buy: "bg-green-900/30 text-green-400",
    sell: "bg-red-900/30 text-red-400",
    bonus: "bg-accent/15 text-accent",
    storage_reward: "bg-blue-900/30 text-blue-400",
    scheme_credit: "bg-purple-900/30 text-purple-400",
    withdrawal: "bg-orange-900/30 text-orange-400",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        colors[type] || "bg-white/10 text-ink/60"
      }`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "bg-green-900/30 text-green-400 border-green-700/30",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
    failed: "bg-red-900/30 text-red-400 border-red-700/30",
    cancelled: "bg-red-900/30 text-red-400 border-red-700/30",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colors[status] || "bg-white/10 text-ink/60 border-border"
      }`}
    >
      {status}
    </span>
  );
}

import { getSchemes } from "@/actions/admin";
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

export default async function SchemesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  let data;
  let error: string | null = null;

  try {
    data = await getSchemes(page);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load schemes";
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Schemes</h1>
        <p className="mt-1 text-sm text-ink/50">
          All gold savings schemes
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
                  <th className="px-4 py-3 font-medium">User ID</th>
                  <th className="px-4 py-3 font-medium">Slab</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Paid</th>
                  <th className="px-4 py-3 font-medium">Bonus</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.schemes.map((s) => {
                  const paidCount = s.installments.filter(
                    (i) => i.status === "paid"
                  ).length;
                  return (
                    <tr
                      key={s._id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 text-ink/50 font-mono text-xs">
                        <a
                          href={`/users/${s.userId}`}
                          className="text-accent hover:underline"
                        >
                          {s.userId.slice(-8)}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-ink/80 text-xs">
                        {paisaToInr(s.slabAmountPaise)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3 text-ink/80 text-xs">
                        {paidCount} / {s.installments.length}
                      </td>
                      <td className="px-4 py-3 text-ink/80 text-xs">
                        {paisaToInr(s.bonusAmountPaise)}
                      </td>
                      <td className="px-4 py-3 text-ink/50 text-xs">
                        {new Date(s.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
                {data.schemes.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-ink/40"
                    >
                      No schemes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/schemes"
          />
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-900/30 text-green-400 border-green-700/30",
    completed: "bg-blue-900/30 text-blue-400 border-blue-700/30",
    withdrawn: "bg-ink/10 text-ink/50 border-border",
    penalized: "bg-red-900/30 text-red-400 border-red-700/30",
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

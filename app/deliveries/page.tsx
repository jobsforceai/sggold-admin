import { getDeliveries } from "@/actions/admin";
import { Pagination } from "../_components/pagination";
import { DeliveryStatusControl } from "./delivery-status-control";

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

export default async function DeliveriesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);

  let data;
  let error: string | null = null;

  try {
    data = await getDeliveries(page);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load deliveries";
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Deliveries</h1>
        <p className="mt-1 text-sm text-ink/50">
          All delivery requests
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
                  <th className="px-4 py-3 font-medium">Amount (g)</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Total Charge</th>
                  <th className="px-4 py-3 font-medium">Pickup Store</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.deliveries.map((d) => (
                  <tr
                    key={d._id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-ink/50 font-mono text-xs">
                      <a
                        href={`/users/${d.userId}`}
                        className="text-accent hover:underline"
                      >
                        {d.userId.slice(-8)}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-ink/80 font-mono text-xs">
                      {mgToGrams(d.amountMg)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-ink/70 capitalize">
                        {d.productType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink/80 text-xs">
                      {paisaToInr(d.totalChargePaise)}
                    </td>
                    <td className="px-4 py-3 text-ink/50 font-mono text-xs">
                      {d.pickupStoreId}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="px-4 py-3 text-ink/50 text-xs">
                      {new Date(d.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <DeliveryStatusControl
                        deliveryId={d._id}
                        currentStatus={d.status}
                      />
                    </td>
                  </tr>
                ))}
                {data.deliveries.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-ink/40"
                    >
                      No deliveries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/deliveries"
          />
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
    processing: "bg-blue-900/30 text-blue-400 border-blue-700/30",
    ready: "bg-green-900/30 text-green-400 border-green-700/30",
    collected: "bg-accent/15 text-accent border-accent/30",
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

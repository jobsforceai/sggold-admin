import { getPendingOrders } from "@/actions/admin";
import { OrderActions } from "./order-actions";

export const dynamic = "force-dynamic";

const fmt = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

export default async function OrdersPage() {
  let data;
  let error: string | null = null;

  try {
    data = await getPendingOrders();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load orders";
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pending Orders</h1>
        <p className="mt-1 text-sm text-ink/50">
          Buy and sell orders waiting for approval
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {data && (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-ink/60">
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Price/g</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Bonus</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.orders.map((order) => {
                const user = typeof order.userId === "object" ? order.userId : null;
                return (
                  <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.type === "buy"
                          ? "bg-green-900/30 text-green-400 border border-green-700/30"
                          : "bg-red-900/30 text-red-400 border border-red-700/30"
                      }`}>
                        {order.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user ? (
                        <div>
                          <p className="text-ink/80">{user.name}</p>
                          <p className="text-xs text-ink/40 font-mono">{user.phone}</p>
                        </div>
                      ) : (
                        <span className="text-ink/40 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-ink">{(order.amountMg / 1000).toFixed(3)}g</td>
                    <td className="px-4 py-3 text-ink/60">{fmt(order.pricePerGramPaise)}</td>
                    <td className="px-4 py-3 font-semibold text-accent">{fmt(order.totalPaise)}</td>
                    <td className="px-4 py-3">
                      {order.bonusMg > 0 ? (
                        <span className="text-emerald-400">+{order.bonusMg}mg</span>
                      ) : (
                        <span className="text-ink/30">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink/50 text-xs">
                      {new Date(order.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <OrderActions orderId={order._id} type={order.type} />
                    </td>
                  </tr>
                );
              })}
              {data.orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-ink/40">
                    No pending orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

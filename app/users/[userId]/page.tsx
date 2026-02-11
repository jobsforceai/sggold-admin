import Link from "next/link";
import { getUserDetail } from "@/actions/admin";
import { JewellerControls } from "./jeweller-controls";

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

export default async function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  let data;
  let error: string | null = null;

  try {
    data = await getUserDetail(params.userId);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load user";
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <Link
          href="/users"
          className="text-sm text-accent hover:underline"
        >
          &larr; Back to Users
        </Link>
        <div className="rounded-xl border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { user, wallet, transactions, schemes } = data;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <Link
        href="/users"
        className="inline-block text-sm text-accent hover:underline"
      >
        &larr; Back to Users
      </Link>

      {/* User Info */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-panel p-5 space-y-4">
          <h2 className="text-lg font-semibold">User Information</h2>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Dt>Name</Dt>
            <Dd>{user.name}</Dd>
            <Dt>Phone</Dt>
            <Dd className="font-mono">{user.phone}</Dd>
            <Dt>Email</Dt>
            <Dd>{user.email || "--"}</Dd>
            <Dt>Account Type</Dt>
            <Dd>
              <span
                className={
                  user.accountType === "jeweller"
                    ? "inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent"
                    : "text-ink/80"
                }
              >
                {user.accountType}
              </span>
            </Dd>
            <Dt>Active</Dt>
            <Dd>{user.isActive ? "Yes" : "No"}</Dd>
            <Dt>Created</Dt>
            <Dd>{new Date(user.createdAt).toLocaleString("en-IN")}</Dd>
          </dl>
        </div>

        {/* Wallet */}
        <div className="rounded-2xl border border-border bg-panel p-5 space-y-4">
          <h2 className="text-lg font-semibold">Wallet</h2>
          {wallet ? (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Dt>Balance</Dt>
              <Dd className="text-accent font-semibold">
                {mgToGrams(wallet.balanceMg)} g
              </Dd>
              <Dt>Total Purchased</Dt>
              <Dd>{mgToGrams(wallet.totalPurchasedMg)} g</Dd>
              <Dt>Total Bonus</Dt>
              <Dd>{mgToGrams(wallet.totalBonusMg)} g</Dd>
            </dl>
          ) : (
            <p className="text-sm text-ink/40">No wallet found</p>
          )}
        </div>
      </div>

      {/* Jeweller Controls */}
      {user.accountType === "jeweller" && (
        <div className="rounded-2xl border border-border bg-panel p-5 space-y-4">
          <h2 className="text-lg font-semibold">Jeweller Approval</h2>
          <div className="text-sm text-ink/60 mb-2">
            Current Status:{" "}
            <StatusBadge status={user.jewellerStatus || "none"} />
            {user.jewellerSubscriptionSlabPaise != null && (
              <span className="ml-3">
                Slab: {paisaToInr(user.jewellerSubscriptionSlabPaise)}
              </span>
            )}
          </div>
          <JewellerControls
            userId={user._id}
            currentStatus={user.jewellerStatus}
          />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Recent Transactions ({transactions.length})
        </h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-ink/60">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount (g)</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <TypeBadge type={tx.type} />
                    </td>
                    <td className="px-4 py-3 text-ink/80 font-mono text-xs">
                      {mgToGrams(tx.amountMg)}
                    </td>
                    <td className="px-4 py-3 text-ink/80 text-xs">
                      {paisaToInr(tx.totalPaise)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="px-4 py-3 text-ink/50 text-xs">
                      {new Date(tx.createdAt).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink/40">No transactions</p>
        )}
      </div>

      {/* Schemes */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Schemes ({schemes.length})</h2>
        {schemes.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-ink/60">
                  <th className="px-4 py-3 font-medium">Slab</th>
                  <th className="px-4 py-3 font-medium">Bonus</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Paid</th>
                  <th className="px-4 py-3 font-medium">Start</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {schemes.map((s) => {
                  const paidCount = s.installments.filter(
                    (i) => i.status === "paid"
                  ).length;
                  return (
                    <tr key={s._id} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-ink/80 text-xs">
                        {paisaToInr(s.slabAmountPaise)}
                      </td>
                      <td className="px-4 py-3 text-ink/80 text-xs">
                        {paisaToInr(s.bonusAmountPaise)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3 text-ink/80 text-xs">
                        {paidCount} / {s.installments.length}
                      </td>
                      <td className="px-4 py-3 text-ink/50 text-xs">
                        {new Date(s.startDate).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-ink/40">No schemes</p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helper components                                            */
/* ------------------------------------------------------------------ */

function Dt({ children }: { children: React.ReactNode }) {
  return <dt className="text-ink/50">{children}</dt>;
}

function Dd({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <dd className={`text-ink/80 ${className}`}>{children}</dd>;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    approved: "bg-green-900/30 text-green-400 border-green-700/30",
    completed: "bg-green-900/30 text-green-400 border-green-700/30",
    active: "bg-green-900/30 text-green-400 border-green-700/30",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
    rejected: "bg-red-900/30 text-red-400 border-red-700/30",
    failed: "bg-red-900/30 text-red-400 border-red-700/30",
    cancelled: "bg-red-900/30 text-red-400 border-red-700/30",
    penalized: "bg-red-900/30 text-red-400 border-red-700/30",
    withdrawn: "bg-ink/10 text-ink/50 border-border",
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

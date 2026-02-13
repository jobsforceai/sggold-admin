import Link from "next/link";
import { getUsers } from "@/actions/admin";
import { Pagination } from "../_components/pagination";
import { SearchForm } from "../_components/search-form";

export const dynamic = "force-dynamic";

const filters = [
  { key: "all", label: "All Users" },
  { key: "jeweller-pending", label: "Jeweller Requests" },
  { key: "jeweller-approved", label: "Approved Jewellers" },
] as const;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; filter?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const search = searchParams.search?.trim() || undefined;
  const filter = searchParams.filter || "all";

  let data;
  let error: string | null = null;

  try {
    data = await getUsers(page, search);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load users";
  }

  // Client-side filter (ideally backend would support this, but works for now)
  let filteredUsers = data?.users ?? [];
  if (filter === "jeweller-pending") {
    filteredUsers = filteredUsers.filter((u) => u.jewellerStatus === "pending");
  } else if (filter === "jeweller-approved") {
    filteredUsers = filteredUsers.filter((u) => u.jewellerStatus === "approved");
  }

  const pendingCount = (data?.users ?? []).filter((u) => u.jewellerStatus === "pending").length;
  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-ink/50">
          All registered users on the platform
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-4">
        <div className="flex overflow-hidden rounded-xl border border-border bg-panel">
          {filters.map((f) => (
            <Link
              key={f.key}
              href={`/users?filter=${f.key}${search ? `&search=${search}` : ""}`}
              className={`relative px-4 py-2 text-sm font-medium transition ${
                filter === f.key ? "bg-accent text-bg" : "text-ink/50 hover:text-ink"
              }`}
            >
              {f.label}
              {f.key === "jeweller-pending" && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {pendingCount}
                </span>
              )}
            </Link>
          ))}
        </div>
        <div className="flex-1">
          <SearchForm placeholder="Search by name or phone..." defaultValue={search} />
        </div>
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
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Account Type</th>
                  <th className="px-4 py-3 font-medium">Jeweller Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-ink/80 font-mono text-xs">
                      {user.phone}
                    </td>
                    <td className="px-4 py-3 text-ink/80">{user.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          user.accountType === "jeweller"
                            ? "inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-medium text-accent"
                            : "inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-ink/60"
                        }
                      >
                        {user.accountType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.jewellerStatus ? (
                        <StatusBadge status={user.jewellerStatus} />
                      ) : (
                        <span className="text-ink/40 text-xs">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink/50 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/users/${user._id}`}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        {user.jewellerStatus === "pending" ? "Review" : "View"}
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                      {filter === "jeweller-pending" ? "No pending jeweller requests" : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filter === "all" && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/users"
              extraParams={search ? { search } : undefined}
            />
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    approved: "bg-green-900/30 text-green-400 border-green-700/30",
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-700/30",
    rejected: "bg-red-900/30 text-red-400 border-red-700/30",
  };
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        colors[status] || "bg-white/10 text-ink/60"
      }`}
    >
      {status}
    </span>
  );
}

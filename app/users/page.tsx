import Link from "next/link";
import { getUsers } from "@/actions/admin";
import { Pagination } from "../_components/pagination";
import { SearchForm } from "../_components/search-form";

export const dynamic = "force-dynamic";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const page = Math.max(1, Number(searchParams.page) || 1);
  const search = searchParams.search?.trim() || undefined;

  let data;
  let error: string | null = null;

  try {
    data = await getUsers(page, search);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load users";
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-ink/50">
          All registered users on the platform
        </p>
      </div>

      <SearchForm placeholder="Search by name or phone..." defaultValue={search} />

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
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.users.map((user) => (
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
                      {user.accountType === "jeweller" && user.jewellerStatus ? (
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
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {data.users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-ink/40">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/users"
            extraParams={search ? { search } : undefined}
          />
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

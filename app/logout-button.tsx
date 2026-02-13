"use client";

import { useRouter } from "next/navigation";
import { adminLogout } from "@/actions/auth";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-border px-4 py-1.5 text-sm text-ink/50 transition hover:border-red-500/30 hover:text-red-400"
    >
      Logout
    </button>
  );
}

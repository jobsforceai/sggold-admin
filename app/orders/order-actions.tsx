"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { approveOrder, rejectOrder } from "@/actions/admin";

export function OrderActions({ orderId, type }: { orderId: string; type: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    try {
      await approveOrder(orderId);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Approval failed");
    }
    setLoading(null);
  }

  async function handleReject() {
    setLoading("reject");
    try {
      await rejectOrder(orderId);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Rejection failed");
    }
    setLoading(null);
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleApprove}
        disabled={loading !== null}
        className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
      >
        {loading === "approve" ? "..." : "Approve"}
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
      >
        {loading === "reject" ? "..." : "Reject"}
      </button>
    </div>
  );
}

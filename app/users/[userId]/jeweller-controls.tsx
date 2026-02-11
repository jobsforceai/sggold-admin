"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateJewellerStatus } from "@/actions/admin";

interface JewellerControlsProps {
  userId: string;
  currentStatus?: string;
}

export function JewellerControls({
  userId,
  currentStatus,
}: JewellerControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [slabPaise, setSlabPaise] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleAction(status: "approved" | "rejected") {
    setMessage(null);
    const slab = status === "approved" ? Number(slabPaise) || undefined : undefined;

    startTransition(async () => {
      try {
        await updateJewellerStatus(userId, status, slab);
        setMessage({
          type: "success",
          text: `Jeweller ${status} successfully`,
        });
        router.refresh();
      } catch (e) {
        setMessage({
          type: "error",
          text: e instanceof Error ? e.message : "Action failed",
        });
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Slab input (only relevant for approval) */}
      <div className="flex items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-ink/50">
            Subscription Slab (paise)
          </label>
          <input
            type="number"
            value={slabPaise}
            onChange={(e) => setSlabPaise(e.target.value)}
            placeholder="e.g. 100000"
            className="block w-48 rounded-lg border border-border bg-white/5 px-3 py-2 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <button
          onClick={() => handleAction("approved")}
          disabled={isPending}
          className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {isPending ? "..." : "Approve"}
        </button>

        <button
          onClick={() => handleAction("rejected")}
          disabled={isPending}
          className="rounded-lg border border-red-700/50 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20 disabled:opacity-50 transition-colors"
        >
          {isPending ? "..." : "Reject"}
        </button>
      </div>

      {message && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-900/20 text-green-400 border border-green-700/30"
              : "bg-red-900/20 text-red-400 border border-red-700/30"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

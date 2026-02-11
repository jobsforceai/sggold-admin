"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateDeliveryStatus } from "@/actions/admin";

const VALID_STATUSES = [
  "pending",
  "processing",
  "ready",
  "collected",
  "cancelled",
] as const;

interface DeliveryStatusControlProps {
  deliveryId: string;
  currentStatus: string;
}

export function DeliveryStatusControl({
  deliveryId,
  currentStatus,
}: DeliveryStatusControlProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState(currentStatus);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleUpdate() {
    if (selected === currentStatus) return;
    setMessage(null);

    startTransition(async () => {
      try {
        await updateDeliveryStatus(deliveryId, selected);
        setMessage({ type: "success", text: "Updated" });
        router.refresh();
      } catch (e) {
        setMessage({
          type: "error",
          text: e instanceof Error ? e.message : "Failed",
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          setMessage(null);
        }}
        className="rounded-lg border border-border bg-white/5 px-2 py-1 text-xs text-ink outline-none focus:border-accent/50 transition-colors"
      >
        {VALID_STATUSES.map((s) => (
          <option key={s} value={s} className="bg-panel text-ink">
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={handleUpdate}
        disabled={isPending || selected === currentStatus}
        className="rounded-lg bg-accent px-2.5 py-1 text-xs font-medium text-bg hover:bg-accent/90 disabled:opacity-40 transition-colors"
      >
        {isPending ? "..." : "Save"}
      </button>

      {message && (
        <span
          className={`text-xs ${
            message.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}

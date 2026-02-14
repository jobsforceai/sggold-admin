"use client";

import { useState, useTransition } from "react";
import { clearCache } from "@/actions/admin";

export function ClearCacheButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleClear() {
    setMessage(null);
    startTransition(async () => {
      try {
        const result = await clearCache();
        setMessage({ type: "success", text: result.message });
      } catch (e) {
        setMessage({ type: "error", text: e instanceof Error ? e.message : "Failed to clear cache" });
      }
    });
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleClear}
        disabled={isPending}
        className="rounded-xl border border-red-700/50 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-300 transition-opacity hover:bg-red-900/40 disabled:opacity-50"
      >
        {isPending ? "Clearing..." : "Clear Redis Cache"}
      </button>
      {message && (
        <span
          className={`text-sm ${
            message.type === "success" ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}

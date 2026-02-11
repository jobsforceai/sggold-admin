"use client";

import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

interface SearchFormProps {
  placeholder?: string;
  defaultValue?: string;
}

export function SearchForm({
  placeholder = "Search...",
  defaultValue = "",
}: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const val = inputRef.current?.value.trim() ?? "";
    const params = new URLSearchParams();
    if (val) params.set("search", val);
    params.set("page", "1");
    router.push(`${pathname}?${params}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="flex-1 rounded-xl border border-border bg-white/5 px-4 py-2 text-sm text-ink placeholder:text-ink/30 outline-none focus:border-accent/50 transition-colors"
      />
      <button
        type="submit"
        className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
      >
        Search
      </button>
    </form>
  );
}

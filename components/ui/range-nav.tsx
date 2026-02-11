import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Currency, Metal, Range } from "@/actions/assets";

const ranges: Array<{ key: Range; label: string }> = [
  { key: "1D", label: "Today" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "5M", label: "5M" },
  { key: "1Y", label: "1Y" },
  { key: "5Y", label: "5Y" },
  { key: "10Y", label: "10Y" }
];

type Props = {
  active: Range;
  currency: Currency;
  metal: Metal;
};

export function RangeNav({ active, currency, metal }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((range) => (
        <Link
          key={range.key}
          href={`/?metal=${metal}&currency=${currency}&range=${range.key}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition",
            active === range.key
              ? "border-ink bg-ink text-white"
              : "border-black/20 bg-white/70 text-ink hover:border-ink/40"
          )}
        >
          {range.label}
        </Link>
      ))}
    </div>
  );
}

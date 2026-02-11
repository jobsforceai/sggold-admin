import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Currency, Metal, Range } from "@/actions/assets";

const metals: Array<{ key: Metal; label: string }> = [
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" }
];

type Props = {
  active: Metal;
  currency: Currency;
  range: Range;
};

export function MetalNav({ active, currency, range }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {metals.map((metal) => (
        <Link
          key={metal.key}
          href={`/?metal=${metal.key}&currency=${currency}&range=${range}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition",
            active === metal.key
              ? "border-accent bg-accent text-bg font-medium"
              : "border-border bg-panel-alt text-ink hover:border-ink/40"
          )}
        >
          {metal.label}
        </Link>
      ))}
    </div>
  );
}

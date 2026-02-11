import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metal, Range } from "@/actions/assets";

const currencies = ["INR", "USD", "EUR", "GBP", "AED"] as const;

type Props = {
  active: string;
  range: Range;
  metal: Metal;
};

export function CurrencyNav({ active, range, metal }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {currencies.map((currency) => (
        <Link
          key={currency}
          href={`/?metal=${metal}&currency=${currency}&range=${range}`}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition",
            active === currency
              ? "border-accent bg-accent text-bg font-medium"
              : "border-border bg-panel-alt text-ink hover:border-ink/40"
          )}
        >
          {currency}
        </Link>
      ))}
    </div>
  );
}

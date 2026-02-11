"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

type Props = {
  name: "GOLD" | "SILVER";
  color: "accent" | "silver";
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  unitLabel: string;
};

export function MetalCard({ name, color, price, change, changePercent, currency, unitLabel }: Props) {
  const isUp = change >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="border border-black/5 p-6 md:p-8">
        <p className="text-xs tracking-[0.35em] text-ink/60">{name}</p>
        <p className={`mt-3 text-3xl font-semibold md:text-4xl ${color === "accent" ? "text-accent" : "text-silver"}`}>
          {formatCurrency(price, currency)}
        </p>
        <p className="mt-1 text-sm font-medium text-ink/65">{unitLabel}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          {isUp ? <ArrowUpRight className="h-4 w-4 text-green-600" /> : <ArrowDownRight className="h-4 w-4 text-red-600" />}
          <span className={isUp ? "text-green-700" : "text-red-700"}>{formatCurrency(change, currency)}</span>
          <span className={isUp ? "text-green-700" : "text-red-700"}>({formatPercent(changePercent)})</span>
        </div>
      </Card>
    </motion.div>
  );
}

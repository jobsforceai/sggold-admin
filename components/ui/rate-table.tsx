import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Row = {
  label: string;
  grams1: number;
  grams10: number;
  grams100: number;
  kilogram1: number;
  ounce1: number;
};

type Props = {
  rows: Row[];
  currency: string;
};

export function RateTable({ rows, currency }: Props) {
  return (
    <Card className="overflow-x-auto border border-black/5">
      <table className="min-w-full text-left">
        <thead className="bg-ink/5 text-xs uppercase tracking-wide text-ink/70">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">1 Gram</th>
            <th className="px-4 py-3">10 Gram</th>
            <th className="px-4 py-3">100 Gram</th>
            <th className="px-4 py-3">1 Kilogram</th>
            <th className="px-4 py-3">1 Ounce</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-black/5 text-sm text-ink/85">
              <td className="px-4 py-3 font-medium">{row.label}</td>
              <td className="px-4 py-3">{formatCurrency(row.grams1, currency)}</td>
              <td className="px-4 py-3">{formatCurrency(row.grams10, currency)}</td>
              <td className="px-4 py-3">{formatCurrency(row.grams100, currency)}</td>
              <td className="px-4 py-3">{formatCurrency(row.kilogram1, currency)}</td>
              <td className="px-4 py-3">{formatCurrency(row.ounce1, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

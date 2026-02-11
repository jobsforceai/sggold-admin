import { CurrencyNav } from "@/components/ui/currency-nav";
import { HistoricalChart } from "@/components/ui/historical-chart";
import { MetalCard } from "@/components/ui/metal-card";
import { MetalNav } from "@/components/ui/metal-nav";
import { RangeNav } from "@/components/ui/range-nav";
import { RateTable } from "@/components/ui/rate-table";
import {
  getGoldRates,
  getHistorical,
  getOverview,
  getSilverRates,
  type Currency,
  type Metal,
  type Range
} from "@/actions/assets";

const fallbackCurrency: Currency = "INR";
const fallbackRange: Range = "1D";
const fallbackMetal: Metal = "gold";
const gramsPerOunce = 31.1035;
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams
}: {
  searchParams: { metal?: Metal; currency?: Currency; range?: Range };
}) {
  const metal = searchParams.metal === "silver" ? "silver" : fallbackMetal;
  const currency = searchParams.currency ?? fallbackCurrency;
  const range = searchParams.range ?? fallbackRange;

  const [overview, history, rates] = await Promise.all([
    getOverview(currency),
    getHistorical(metal, currency, range),
    metal === "gold" ? getGoldRates(currency) : getSilverRates(currency)
  ]);
  const activeAsset = metal === "gold" ? overview.assets.gold : overview.assets.silver;
  const accentColor = metal === "gold" ? "#a67922" : "#6b7280";
  const title = metal === "gold" ? "Gold" : "Silver";
  const convertedLivePrice =
    metal === "gold"
      ? (activeAsset.price / gramsPerOunce) * 10
      : (activeAsset.price / gramsPerOunce) * 1000;
  const convertedLiveChange =
    metal === "gold"
      ? (activeAsset.change / gramsPerOunce) * 10
      : (activeAsset.change / gramsPerOunce) * 1000;
  const displayUnitLabel = metal === "gold" ? "Per 10 gm" : "Per 1 kg";
  const isMockSource = rates.source === "mock";
  const convertedHistoryData = history.data.map((point) => ({
    ...point,
    price: metal === "gold" ? (point.price / gramsPerOunce) * 10 : (point.price / gramsPerOunce) * 1000
  }));

  return (
    <main className="min-h-screen bg-mesh px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="space-y-4 rounded-3xl border border-black/10 bg-panel/90 p-6 shadow-soft md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Bullion Intelligence Panel</h1>
              <p className="mt-1 text-sm text-ink/65">Focused live + historical view by selected asset tab</p>
            </div>
            <div className="flex flex-col gap-2">
              <MetalNav active={metal} currency={currency} range={range} />
              <CurrencyNav active={currency} range={range} metal={metal} />
              <RangeNav active={range} currency={currency} metal={metal} />
            </div>
          </div>

          <MetalCard
            name={metal === "gold" ? "GOLD" : "SILVER"}
            color={metal === "gold" ? "accent" : "silver"}
            price={convertedLivePrice}
            change={convertedLiveChange}
            changePercent={activeAsset.changePercent}
            currency={currency}
            unitLabel={displayUnitLabel}
          />
        </section>

        <section>
          <HistoricalChart
            title={`${title} Trend (${range}) - ${displayUnitLabel}`}
            currency={currency}
            color={accentColor}
            range={range}
            data={convertedHistoryData}
          />
        </section>

        <section className="space-y-3">
          {isMockSource ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Live provider is rate-limited right now. Showing fallback mock values, so prices may not match today's
              India market.
            </div>
          ) : null}
          <div>
            <h2 className="text-2xl font-semibold">{title} Rate Matrix</h2>
            <p className="text-sm text-ink/65">
              Updated at {new Date(rates.updatedAt).toLocaleString("en-IN")} ({rates.source})
            </p>
          </div>
          <RateTable rows={rates.rows} currency={currency} />
        </section>
      </div>
    </main>
  );
}

import { fetchPriceConfig } from "@/actions/admin";
import { PricingForm } from "./pricing-form";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  let config;
  let error: string | null = null;

  try {
    config = await fetchPriceConfig();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load pricing config";
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing Control</h1>
        <p className="mt-1 text-sm text-ink/50">
          Set gold/silver prices, platform spreads, taxes, and state markups
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {config && <PricingForm config={config} />}
    </div>
  );
}

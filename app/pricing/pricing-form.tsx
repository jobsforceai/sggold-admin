"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { savePriceConfig, fetchGoldPrice, fetchSilverPrice, type PriceConfigData, type StateMarkup, type FetchedPriceResult } from "@/actions/admin";

type Props = { config: PriceConfigData };

export function PricingForm({ config }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Gold / Silver manual price toggle
  const [goldManual, setGoldManual] = useState(config.goldPricePerGramPaise != null);
  const [silverManual, setSilverManual] = useState(config.silverPricePerGramPaise != null);

  // Gold price in rupees (for display/input)
  const [goldPrice, setGoldPrice] = useState(
    config.goldPricePerGramPaise != null ? (config.goldPricePerGramPaise / 100).toString() : ""
  );
  const [silverPrice, setSilverPrice] = useState(
    config.silverPricePerGramPaise != null ? (config.silverPricePerGramPaise / 100).toString() : ""
  );

  // Tax percentage for API fetched prices
  const [goldTaxPercent, setGoldTaxPercent] = useState("3");
  const [silverTaxPercent, setSilverTaxPercent] = useState("3");
  const [isFetchingGold, setIsFetchingGold] = useState(false);
  const [isFetchingSilver, setIsFetchingSilver] = useState(false);
  const [goldPriceBreakdown, setGoldPriceBreakdown] = useState<FetchedPriceResult | null>(null);
  const [silverPriceBreakdown, setSilverPriceBreakdown] = useState<FetchedPriceResult | null>(null);

  // Platform spread
  const [buyPremium, setBuyPremium] = useState(config.buyPremiumPercent.toString());
  const [sellDiscount, setSellDiscount] = useState(config.sellDiscountPercent.toString());

  // Tax & Duties
  const [gst, setGst] = useState(config.gstPercent.toString());
  const [importDuty, setImportDuty] = useState(config.importDutyPercent.toString());
  const [aidc, setAidc] = useState(config.aidcPercent.toString());
  const [localPremium, setLocalPremium] = useState(config.localPremiumPercent.toString());

  // State markups
  const [stateMarkups, setStateMarkups] = useState<StateMarkup[]>(config.stateMarkups);

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateStateMarkup(idx: number, value: string) {
    setStateMarkups((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, markupPercent: parseFloat(value) || 0 } : s))
    );
  }

  async function handleFetchGoldPrice() {
    setIsFetchingGold(true);
    setGoldPriceBreakdown(null);
    
    try {
      const tax = parseFloat(goldTaxPercent) || 0;
      const result = await fetchGoldPrice(tax);
      
      setGoldPriceBreakdown(result);
      setGoldPrice(result.finalPrice.toString());
      
      // Automatically enable manual mode if not already enabled
      if (!goldManual) {
        setGoldManual(true);
      }
      
      setMessage({ 
        type: "success", 
        text: `Gold price fetched successfully: Base ₹${result.basePrice} + Tax ₹${result.taxAmount} (${result.taxPercent}%) = ₹${result.finalPrice}/gram` 
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch gold price';
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsFetchingGold(false);
    }
  }

  async function handleFetchSilverPrice() {
    setIsFetchingSilver(true);
    setSilverPriceBreakdown(null);
    
    try {
      const tax = parseFloat(silverTaxPercent) || 0;
      const result = await fetchSilverPrice(tax);
      
      setSilverPriceBreakdown(result);
      setSilverPrice(result.finalPrice.toString());
      
      // Automatically enable manual mode if not already enabled
      if (!silverManual) {
        setSilverManual(true);
      }
      
      setMessage({ 
        type: "success", 
        text: `Silver price fetched successfully: Base ₹${result.basePrice} + Tax ₹${result.taxAmount} (${result.taxPercent}%) = ₹${result.finalPrice}/gram` 
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to fetch silver price';
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setIsFetchingSilver(false);
    }
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      try {
        await savePriceConfig({
          goldPricePerGramPaise: goldManual ? Math.round(parseFloat(goldPrice || "0") * 100) : null,
          silverPricePerGramPaise: silverManual ? Math.round(parseFloat(silverPrice || "0") * 100) : null,
          buyPremiumPercent: parseFloat(buyPremium) || 0,
          sellDiscountPercent: parseFloat(sellDiscount) || 0,
          gstPercent: parseFloat(gst) || 0,
          importDutyPercent: parseFloat(importDuty) || 0,
          aidcPercent: parseFloat(aidc) || 0,
          localPremiumPercent: parseFloat(localPremium) || 0,
          stateMarkups,
        });
        setMessage({ type: "success", text: "Pricing config saved successfully" });
        router.refresh();
      } catch (e) {
        setMessage({ type: "error", text: e instanceof Error ? e.message : "Save failed" });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Status message */}
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-700/50 bg-emerald-900/20 text-emerald-300"
              : "border-red-700/50 bg-red-900/20 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Gold Price */}
      <Section title="Gold Price">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Toggle checked={goldManual} onChange={setGoldManual} label={goldManual ? "Manual Price" : "Live Feed"} />
            {goldManual && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/50">INR per gram:</span>
                <NumInput value={goldPrice} onChange={setGoldPrice} placeholder="e.g. 8500" />
              </div>
            )}
          </div>
          
          {goldManual && (
            <div className="rounded-lg border border-border bg-bg/50 p-4 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-ink/80">Fetch from GoldAPI</h3>
                <p className="text-xs text-ink/40 mt-0.5">Get latest 24k gold price with tax applied</p>
              </div>
              
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-ink/60 mb-1.5">Tax %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={goldTaxPercent}
                    onChange={(e) => setGoldTaxPercent(e.target.value)}
                    placeholder="3"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                
                <button
                  onClick={handleFetchGoldPrice}
                  disabled={isFetchingGold}
                  className="rounded-lg bg-accent/10 border border-accent/30 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingGold ? "Fetching..." : "Fetch Latest Price"}
                </button>
              </div>
              
              {goldPriceBreakdown && (
                <div className="rounded-md bg-emerald-900/10 border border-emerald-700/30 px-3 py-2 text-xs">
                  <p className="text-emerald-300 font-medium">Price Breakdown:</p>
                  <p className="text-ink/70 mt-1">
                    Base Price: <span className="text-ink font-medium">₹{goldPriceBreakdown.basePrice}</span>
                  </p>
                  <p className="text-ink/70">
                    Tax ({goldPriceBreakdown.taxPercent}%): <span className="text-ink font-medium">₹{goldPriceBreakdown.taxAmount}</span>
                  </p>
                  <p className="text-accent font-semibold mt-1 pt-1 border-t border-emerald-700/30">
                    Final Price: ₹{goldPriceBreakdown.finalPrice}/gram
                  </p>
                </div>
              )}
            </div>
          )}
          
          {!goldManual && (
            <p className="text-xs text-ink/40">
              Gold price is fetched from live market feed with Indian market markup applied
            </p>
          )}
        </div>
      </Section>

      {/* Silver Price */}
      <Section title="Silver Price">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Toggle checked={silverManual} onChange={setSilverManual} label={silverManual ? "Manual Price" : "Live Feed"} />
            {silverManual && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink/50">INR per gram:</span>
                <NumInput value={silverPrice} onChange={setSilverPrice} placeholder="e.g. 105" />
              </div>
            )}
          </div>
          
          {silverManual && (
            <div className="rounded-lg border border-border bg-bg/50 p-4 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-ink/80">Fetch from GoldAPI</h3>
                <p className="text-xs text-ink/40 mt-0.5">Get latest silver price with tax applied</p>
              </div>
              
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-ink/60 mb-1.5">Tax %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={silverTaxPercent}
                    onChange={(e) => setSilverTaxPercent(e.target.value)}
                    placeholder="3"
                    className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
                  />
                </div>
                
                <button
                  onClick={handleFetchSilverPrice}
                  disabled={isFetchingSilver}
                  className="rounded-lg bg-accent/10 border border-accent/30 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isFetchingSilver ? "Fetching..." : "Fetch Latest Price"}
                </button>
              </div>
              
              {silverPriceBreakdown && (
                <div className="rounded-md bg-emerald-900/10 border border-emerald-700/30 px-3 py-2 text-xs">
                  <p className="text-emerald-300 font-medium">Price Breakdown:</p>
                  <p className="text-ink/70 mt-1">
                    Base Price: <span className="text-ink font-medium">₹{silverPriceBreakdown.basePrice}</span>
                  </p>
                  <p className="text-ink/70">
                    Tax ({silverPriceBreakdown.taxPercent}%): <span className="text-ink font-medium">₹{silverPriceBreakdown.taxAmount}</span>
                  </p>
                  <p className="text-accent font-semibold mt-1 pt-1 border-t border-emerald-700/30">
                    Final Price: ₹{silverPriceBreakdown.finalPrice}/gram
                  </p>
                </div>
              )}
            </div>
          )}
          
          {!silverManual && (
            <p className="text-xs text-ink/40">
              Silver price is fetched from live market feed with Indian market markup applied
            </p>
          )}
        </div>
      </Section>

      {/* Platform Spread */}
      <Section title="Platform Buy / Sell Spread">
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldRow label="Buy Premium %" sublabel="Extra % charged when user buys">
            <NumInput value={buyPremium} onChange={setBuyPremium} placeholder="0" />
          </FieldRow>
          <FieldRow label="Sell Discount %" sublabel="% deducted when user sells">
            <NumInput value={sellDiscount} onChange={setSellDiscount} placeholder="0" />
          </FieldRow>
        </div>
      </Section>

      {/* Tax & Duties */}
      <Section title="Tax & Duties">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FieldRow label="GST %">
            <NumInput value={gst} onChange={setGst} placeholder="3" />
          </FieldRow>
          <FieldRow label="Import Duty %">
            <NumInput value={importDuty} onChange={setImportDuty} placeholder="6" />
          </FieldRow>
          <FieldRow label="AIDC %">
            <NumInput value={aidc} onChange={setAidc} placeholder="1" />
          </FieldRow>
          <FieldRow label="Local Premium %">
            <NumInput value={localPremium} onChange={setLocalPremium} placeholder="1" />
          </FieldRow>
        </div>
        <p className="mt-2 text-xs text-ink/40">
          Import Duty, AIDC, and Local Premium are applied to live feed prices for INR.
          GST is applied at the point of buy transaction.
        </p>
      </Section>

      {/* State Markups */}
      <Section title="State-wise Markup %">
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-panel-alt">
                <th className="px-4 py-2.5 text-left font-medium text-ink/60">State</th>
                <th className="px-4 py-2.5 text-left font-medium text-ink/60">Code</th>
                <th className="px-4 py-2.5 text-left font-medium text-ink/60">Markup %</th>
              </tr>
            </thead>
            <tbody>
              {stateMarkups.map((s, idx) => (
                <tr key={s.stateCode} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2 text-ink/80">{s.stateName}</td>
                  <td className="px-4 py-2 text-ink/50">{s.stateCode}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.1"
                      value={s.markupPercent}
                      onChange={(e) => updateStateMarkup(idx, e.target.value)}
                      className="w-24 rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-ink outline-none focus:border-accent"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink/40">
          State markup is added on top of the base price for users in that state
        </p>
      </Section>

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        {config.updatedAt && (
          <span className="text-xs text-ink/40">
            Last updated: {new Date(config.updatedAt).toLocaleString("en-IN")}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Helper Components ──────────────────────────────────────────────── */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-5 space-y-4">
      <h2 className="text-base font-semibold text-accent">{title}</h2>
      {children}
    </div>
  );
}

function FieldRow({
  label,
  sublabel,
  children,
}: {
  label: string;
  sublabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink/70">{label}</label>
      {sublabel && <p className="text-xs text-ink/40">{sublabel}</p>}
      {children}
    </div>
  );
}

function NumInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      step="any"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-accent"
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5"
    >
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className="text-sm text-ink/70">{label}</span>
    </button>
  );
}

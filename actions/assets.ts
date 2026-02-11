"use server";

export type Currency = "USD" | "INR" | "EUR" | "GBP" | "AED";
export type Metal = "gold" | "silver";
export type Range = "1D" | "1W" | "1M" | "5M" | "1Y" | "5Y" | "10Y";

const API_BASE = process.env.BACKEND_API_BASE_URL;
const API_KEY = process.env.BACKEND_API_KEY;
const DEFAULT_API_BASE = "http://localhost:4000";

async function callBackend<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json"
  };
  const cleanedKey = API_KEY?.trim();
  if (cleanedKey && cleanedKey.toLowerCase() !== "replace_me") {
    headers["x-api-key"] = cleanedKey;
  }

  const response = await fetch(`${API_BASE ?? DEFAULT_API_BASE}${path}`, {
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Backend request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

export async function getOverview(currency: Currency) {
  return callBackend<{
    currency: Currency;
    updatedAt: string;
    source: "alpha_vantage" | "mock";
    assets: {
      gold: {
        metal: Metal;
        price: number;
        currency: Currency;
        change: number;
        changePercent: number;
        timestamp: string;
        source: "alpha_vantage" | "mock";
      };
      silver: {
        metal: Metal;
        price: number;
        currency: Currency;
        change: number;
        changePercent: number;
        timestamp: string;
        source: "alpha_vantage" | "mock";
      };
    };
  }>(`/api/v1/assets/overview?currency=${currency}`);
}

export async function getHistorical(metal: Metal, currency: Currency, range: Range) {
  return callBackend<{
    metal: Metal;
    currency: Currency;
    range: Range;
    source: "alpha_vantage" | "mock";
    data: Array<{ time: string; price: number }>;
  }>(`/api/v1/assets/${metal}/historical?currency=${currency}&range=${range}`);
}

export async function getGoldRates(currency: Currency) {
  return callBackend<{
    currency: Currency;
    updatedAt: string;
    source: "alpha_vantage" | "mock";
    rows: Array<{
      label: string;
      grams1: number;
      grams10: number;
      grams100: number;
      kilogram1: number;
      ounce1: number;
    }>;
  }>(`/api/v1/assets/gold/rates?currency=${currency}`);
}

export async function getSilverRates(currency: Currency) {
  return callBackend<{
    currency: Currency;
    updatedAt: string;
    source: "alpha_vantage" | "mock";
    rows: Array<{
      label: string;
      grams1: number;
      grams10: number;
      grams100: number;
      kilogram1: number;
      ounce1: number;
    }>;
  }>(`/api/v1/assets/silver/rates?currency=${currency}`);
}

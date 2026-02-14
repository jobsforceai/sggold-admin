"use server";

const API_BASE = process.env.BACKEND_API_BASE_URL ?? "http://localhost:4000";
const ADMIN_KEY = process.env.ADMIN_API_KEY ?? "";

/* ------------------------------------------------------------------ */
/*  Generic fetcher                                                    */
/* ------------------------------------------------------------------ */

async function adminFetch<T>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const url = `${API_BASE}${path}`;

  if (!API_BASE || API_BASE === "http://localhost:4000") {
    throw new Error(
      "BACKEND_API_BASE_URL is not set. Configure it in your environment variables."
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-admin-key": ADMIN_KEY,
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: options?.method ?? "GET",
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    throw new Error(`Cannot reach backend at ${API_BASE}: ${msg}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Admin API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Cache Management                                                   */
/* ------------------------------------------------------------------ */

export async function clearCache(): Promise<{ message: string }> {
  return adminFetch<{ message: string }>("/api/v1/admin/clear-cache", {
    method: "POST",
  });
}

/* ------------------------------------------------------------------ */
/*  Price Config                                                       */
/* ------------------------------------------------------------------ */

export interface StateMarkup {
  stateCode: string;
  stateName: string;
  markupPercent: number;
}

export interface PriceConfigData {
  _id: string;
  goldPricePerGramPaise: number | null;
  silverPricePerGramPaise: number | null;
  buyPremiumPercent: number;
  sellDiscountPercent: number;
  gstPercent: number;
  importDutyPercent: number;
  aidcPercent: number;
  localPremiumPercent: number;
  stateMarkups: StateMarkup[];
  updatedAt: string;
}

export async function fetchPriceConfig(): Promise<PriceConfigData> {
  return adminFetch<PriceConfigData>("/api/v1/admin/price-config");
}

export async function savePriceConfig(
  data: Partial<Omit<PriceConfigData, "_id" | "updatedAt">>
): Promise<PriceConfigData> {
  return adminFetch<PriceConfigData>("/api/v1/admin/price-config", {
    method: "PUT",
    body: data,
  });
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

export interface DashboardStats {
  totalUsers: number;
  totalTransactions: number;
  activeSchemes: number;
  totalDeliveries: number;
  totalGoldHeldMg: number;
  totalGoldPurchasedMg: number;
}

export async function getStats(): Promise<DashboardStats> {
  return adminFetch<DashboardStats>("/api/v1/admin/stats");
}

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  _id: string;
  phone: string;
  name: string;
  email?: string;
  accountType: "regular" | "jeweller";
  jewellerStatus?: "pending" | "approved" | "rejected";
  jewellerSubscriptionSlabPaise?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export async function getUsers(
  page: number = 1,
  search?: string
): Promise<UsersResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set("search", search);
  return adminFetch<UsersResponse>(`/api/v1/admin/users?${params}`);
}

/* ------------------------------------------------------------------ */
/*  User detail                                                        */
/* ------------------------------------------------------------------ */

export interface AdminWallet {
  _id: string;
  userId: string;
  balanceMg: number;
  totalPurchasedMg: number;
  totalBonusMg: number;
  updatedAt: string;
}

export interface AdminTransaction {
  _id: string;
  userId: string;
  type: string;
  amountMg: number;
  pricePerGramPaise: number;
  totalPaise: number;
  bonusMg: number;
  status: string;
  createdAt: string;
}

export interface AdminScheme {
  _id: string;
  userId: string;
  slabAmountPaise: number;
  bonusAmountPaise: number;
  status: string;
  startDate: string;
  installments: {
    dueDate: string;
    paidDate?: string;
    amountPaise: number;
    status: string;
  }[];
  missedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailResponse {
  user: AdminUser;
  wallet: AdminWallet | null;
  transactions: AdminTransaction[];
  schemes: AdminScheme[];
}

export async function getUserDetail(
  userId: string
): Promise<UserDetailResponse> {
  return adminFetch<UserDetailResponse>(`/api/v1/admin/users/${userId}`);
}

/* ------------------------------------------------------------------ */
/*  Jeweller status                                                    */
/* ------------------------------------------------------------------ */

export async function updateJewellerStatus(
  userId: string,
  status: "approved" | "rejected",
  slabPaise?: number
): Promise<{ user: AdminUser }> {
  return adminFetch<{ user: AdminUser }>(
    `/api/v1/admin/users/${userId}/jeweller-status`,
    { method: "PATCH", body: { status, slabPaise } }
  );
}

/* ------------------------------------------------------------------ */
/*  Transactions                                                       */
/* ------------------------------------------------------------------ */

export interface TransactionsResponse {
  transactions: AdminTransaction[];
  total: number;
  page: number;
  limit: number;
}

export async function getTransactions(
  page: number = 1
): Promise<TransactionsResponse> {
  return adminFetch<TransactionsResponse>(
    `/api/v1/admin/transactions?page=${page}`
  );
}

/* ------------------------------------------------------------------ */
/*  Schemes                                                            */
/* ------------------------------------------------------------------ */

export interface SchemesResponse {
  schemes: AdminScheme[];
  total: number;
  page: number;
  limit: number;
}

export async function getSchemes(page: number = 1): Promise<SchemesResponse> {
  return adminFetch<SchemesResponse>(`/api/v1/admin/schemes?page=${page}`);
}

/* ------------------------------------------------------------------ */
/*  Deliveries                                                         */
/* ------------------------------------------------------------------ */

export interface AdminDelivery {
  _id: string;
  userId: string;
  amountMg: number;
  productType: "coin" | "bar";
  productWeightMg: number;
  coinChargePaise: number;
  gstPaise: number;
  totalChargePaise: number;
  pickupStoreId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveriesResponse {
  deliveries: AdminDelivery[];
  total: number;
  page: number;
  limit: number;
}

export async function getDeliveries(
  page: number = 1
): Promise<DeliveriesResponse> {
  return adminFetch<DeliveriesResponse>(
    `/api/v1/admin/deliveries?page=${page}`
  );
}

export async function updateDeliveryStatus(
  id: string,
  status: string
): Promise<{ delivery: AdminDelivery }> {
  return adminFetch<{ delivery: AdminDelivery }>(
    `/api/v1/admin/deliveries/${id}/status`,
    { method: "PATCH", body: { status } }
  );
}

/* ------------------------------------------------------------------ */
/*  Orders (Buy/Sell pending approval)                                 */
/* ------------------------------------------------------------------ */

export interface PendingOrder {
  _id: string;
  userId: { _id: string; name: string; phone: string } | string;
  type: "buy" | "sell";
  amountMg: number;
  pricePerGramPaise: number;
  totalPaise: number;
  bonusMg: number;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PendingOrdersResponse {
  orders: PendingOrder[];
  total: number;
  page: number;
  limit: number;
}

export async function getPendingOrders(page: number = 1): Promise<PendingOrdersResponse> {
  return adminFetch<PendingOrdersResponse>(`/api/v1/admin/orders/pending?page=${page}`);
}

export async function approveOrder(orderId: string): Promise<unknown> {
  return adminFetch(`/api/v1/admin/orders/${orderId}/approve`, { method: "PATCH" });
}

export async function rejectOrder(orderId: string): Promise<unknown> {
  return adminFetch(`/api/v1/admin/orders/${orderId}/reject`, { method: "PATCH" });
}

/* ------------------------------------------------------------------ */
/*  GoldAPI Price Fetching                                             */
/* ------------------------------------------------------------------ */

export interface GoldAPIResponse {
  timestamp: number;
  metal: string;
  currency: string;
  exchange: string;
  symbol: string;
  prev_close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  open_time: number;
  price: number;
  ch: number;
  chp: number;
  ask: number;
  bid: number;
  price_gram_24k: number;
  price_gram_22k: number;
  price_gram_21k: number;
  price_gram_20k: number;
  price_gram_18k: number;
  price_gram_16k: number;
  price_gram_14k: number;
  price_gram_10k: number;
}

export interface FetchedPriceResult {
  basePrice: number;
  taxPercent: number;
  taxAmount: number;
  finalPrice: number;
  metal: string;
}

const GOLDAPI_KEY = process.env.GOLDAPI_KEY ?? "goldapi-ipcsmlmhbtev-io";

type MetalType = 'XAU' | 'XAG';

async function fetchMetalPrice(
  metalType: MetalType,
  taxPercent: number = 3
): Promise<FetchedPriceResult> {
  const metalNames: Record<MetalType, string> = {
    XAU: 'Gold (24k)',
    XAG: 'Silver',
  };

  try {
    const url = `https://www.goldapi.io/api/${metalType}/INR`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'x-access-token': GOLDAPI_KEY },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`GoldAPI request failed: ${response.statusText}`);
    }

    const data = await response.json() as GoldAPIResponse;
    const basePrice = data.price_gram_24k;

    if (!basePrice || typeof basePrice !== 'number') {
      throw new Error('Invalid price data received from GoldAPI');
    }

    const taxAmount = basePrice * (taxPercent / 100);
    const finalPrice = basePrice + taxAmount;

    return {
      basePrice: parseFloat(basePrice.toFixed(2)),
      taxPercent,
      taxAmount: parseFloat(taxAmount.toFixed(2)),
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      metal: metalNames[metalType],
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch ${metalNames[metalType]} price: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function fetchGoldPrice(taxPercent: number = 3): Promise<FetchedPriceResult> {
  return fetchMetalPrice('XAU', taxPercent);
}

export async function fetchSilverPrice(taxPercent: number = 3): Promise<FetchedPriceResult> {
  return fetchMetalPrice('XAG', taxPercent);
}

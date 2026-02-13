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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "x-admin-key": ADMIN_KEY,
  };

  const res = await fetch(`${API_BASE}${path}`, {
    method: options?.method ?? "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Admin API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
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

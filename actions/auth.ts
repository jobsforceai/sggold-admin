"use server";

import { cookies } from "next/headers";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "superadmin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "SgGold@2026";
const COOKIE_NAME = "sg_admin_session";

export async function adminLogin(username: string, password: string): Promise<{ error?: string }> {
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return { error: "Invalid username or password" };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 1 day
    path: "/",
  });

  return {};
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === "authenticated";
}

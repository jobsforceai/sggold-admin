import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { Sidebar } from "./sidebar";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "SG Gold Admin",
  description: "SG Gold administration panel",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("sg_admin_session")?.value === "authenticated";

  if (!isLoggedIn) {
    return (
      <html lang="en" className="dark">
        <body className="min-h-screen bg-bg text-ink">{children}</body>
      </html>
    );
  }

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen bg-bg text-ink">
        <Sidebar />
        <div className="flex flex-1 flex-col ml-64 min-h-screen">
          <header className="flex items-center justify-end border-b border-border px-6 py-3">
            <LogoutButton />
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

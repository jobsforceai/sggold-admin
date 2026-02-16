import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { LayoutShell } from "./layout-shell";

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
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}

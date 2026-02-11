import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "./sidebar";

export const metadata: Metadata = {
  title: "SG Gold Admin",
  description: "SG Gold administration panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen bg-bg text-ink">
        <Sidebar />
        <main className="flex-1 overflow-y-auto ml-64 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

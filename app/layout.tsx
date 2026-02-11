import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bullion Desk",
  description: "Real-time gold and silver intelligence"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

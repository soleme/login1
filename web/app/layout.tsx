import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phase 1",
  description: "Phase 1 authentication frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

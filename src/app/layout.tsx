import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Path AI",
  description: "Seu próximo passo para uma carreira internacional",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
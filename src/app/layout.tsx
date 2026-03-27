import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const uiFont = Inter({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AILA",
  description:
    "Descubra carreiras, países e um plano de estudos realista com base no seu perfil.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={uiFont.variable}>{children}</body>
    </html>
  );
}
